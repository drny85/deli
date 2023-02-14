import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
admin.initializeApp();

import { v4 as UUID } from 'uuid';

import Stripe from 'stripe';

import { assignUserType } from './shared';

import { UserRecord } from 'firebase-functions/v1/auth';
import { AppUser, Business, CartItem, Order, ORDER_STATUS } from './typing';

const stripe = new Stripe(process.env.STRIPE_TEST_KEY!, {
    apiVersion: '2022-11-15'
});

interface Response {
    success: boolean;
    result: string;
}

exports.createStripeCustomer = functions.firestore
    .document('/users/{userId}')
    .onWrite(async (change, context) => {
        try {
            if (context.eventType === 'google.firestore.document.update')
                return;
            const data = change.after.data() as AppUser;

            if (!data) return;
            const email = data?.email;
            const name = data?.name + ' ' + data?.lastName;

            const customer = await stripe.customers.create({
                email: email,
                name: name,
                metadata: { userId: context.params.userId }
            });

            if (data.email === 'melendez@robertdev.net') {
                await assignUserType(context.params.userId, 'admin');
            }

            return assignUserType(context.params.userId, data.type).then(() => {
                return admin
                    .firestore()
                    .collection('stripe_customers')
                    .doc(context.params.userId)
                    .set({ customer_id: customer.id });
            });
        } catch (error) {
            throw new functions.https.HttpsError(
                'aborted',
                'error while creating stripe customer'
            );
        }
    });

exports.createConnectedBusinessAccount = functions.https.onCall(
    async (
        data: {
            businessName: string;
            phone: string;
            address: string;
            name: string;
            lastName: string;
        },
        context
    ): Promise<Response> => {
        try {
            console.log(
                'ENV =>',
                process.env.NODE_ENV === 'development',
                process.env.NODE_ENV === 'production'
            );
            const email = context.auth?.token.email;
            const isAuth = await isAuthorizedToGrantAccess(email!);
            if (!context.auth || !isAuth)
                throw new functions.https.HttpsError(
                    'permission-denied',
                    'you are not authorized'
                );

            const address = data.address.split(', ');

            const account = await stripe.accounts.create({
                type: 'express',
                country: 'US',
                email: email,
                business_type: 'individual',
                metadata: { businessId: context.auth.uid },
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true }
                },
                business_profile: {
                    name: data.businessName,
                    url: 'https://robertdev.net'
                },
                individual: {
                    last_name: data.lastName,
                    first_name: data.name,
                    address: {
                        line1: address[0],
                        city: address[1],
                        state: address[2].split(' ')[0],
                        postal_code: address[2].split(' ')[1],
                        country: 'US'
                    },
                    phone: data.phone
                }
            });

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: `https://robertdev.net/reauth?accountId=${account.id}`,
                return_url: `https://robertdev.net/return_url?accountId=${account.id}`,
                type: 'account_onboarding'
            });

            return { success: true, result: accountLink.url };
        } catch (error) {
            const err = error as any;
            console.log('Error Creating Account Link', err.message);
            throw new functions.https.HttpsError(
                'aborted',
                'error creating connected account',
                error
            );
        }
    }
);

exports.webhook = functions.https.onRequest(
    async (
        req: functions.https.Request,
        res: functions.Response<any>
    ): Promise<any> => {
        const webhookSecret = process.env.WEBHOOK_CONNECTED;
        const signature = req.headers['stripe-signature'];
        const payloadData = req.rawBody;
        const payloadString = payloadData.toString();
        let event;

        try {
            if (!webhookSecret || !signature) return;
            event = stripe.webhooks.constructEvent(
                payloadString,
                signature,
                webhookSecret
            );
            const webhookRef = admin
                .firestore()
                .collection('connectedAccounts')
                .doc(event.id);

            const exists = (await webhookRef.get()).exists;
            if (exists) return res.status(400).send('Already exists');
            const wkType = { type: event.type };
            const wkStatus = { status: 'new' };
            const eventType = { event_type: 'businessAccount' };
            const data = {
                ...wkStatus,
                ...wkType,
                ...eventType,
                ...event.data.object
            };

            await webhookRef.set(data);
            switch (event.type) {
                case 'payment_intent.payment_failed':
                    const paymentIntentFailed = event.data
                        .object as Stripe.PaymentIntent;
                    // Then define and call a function to handle the event payment_intent.payment_failed
                    console.log(paymentIntentFailed);
                    return res.status(200).send('Success');
                case 'payment_intent.succeeded':
                    const paymentIntentSucceeded = event.data
                        .object as Stripe.PaymentIntent;

                    console.log('PAY', paymentIntentSucceeded);

                    // Then define and call a function to handle the event payment_intent.succeeded
                    return res.status(200).send('Success');
                // ... handle other event types
                case 'account.updated':
                    return res.status(200).send('Success');

                case 'account.application.deauthorized':
                    const data = event.data.object;
                    const meta = data as any;
                    const businessId = meta?.metadata as any;
                    const id = businessId.businessId;
                    if (!id) return;
                    await admin
                        .firestore()
                        .collection('business')
                        .doc(id)
                        .update({ stripeAccount: null });

                    return res.status(200).send('Success');

                default:
                    console.log(`Unhandled event type ${event.type}`);
                    functions.logger.error('Error', event.type);
                    break;
            }

            return res.status(200).send('Success');
        } catch (error) {
            console.log(error);
            functions.logger.error('Error message', error);
            return res.status(400).send(`Webhook Main Error:' ${error}`);
        }
    }
);

exports.deli = functions.https.onRequest(
    async (
        req: functions.https.Request,
        res: functions.Response<any>
    ): Promise<any> => {
        const webhookSecret = process.env.WEBHOOK_DELI;
        const signature = req.headers['stripe-signature'];
        const payloadData = req.rawBody;
        const payloadString = payloadData.toString();
        let event;

        try {
            if (!webhookSecret || !signature) return;
            event = stripe.webhooks.constructEvent(
                payloadString,
                signature,
                webhookSecret
            );
            const webhookRef = admin
                .firestore()
                .collection('deli')
                .doc(event.id);

            const exists = (await webhookRef.get()).exists;
            if (exists) return res.status(400).send('Already exists');
            const wkType = { type: event.type };
            const wkStatus = { status: 'new' };
            const eventType = { event_type: 'deli' };
            const data = {
                ...wkStatus,
                ...wkType,
                ...eventType,
                ...event.data.object
            };

            await webhookRef.set(data);
            // Handle the event
            switch (event.type) {
                case 'payment_intent.payment_failed':
                    const paymentIntent_failed = event.data
                        .object as Stripe.PaymentIntent;
                    // Then define and call a function to handle the event payment_intent.payment_failed
                    console.log(paymentIntent_failed);
                    break;
                case 'payment_intent.requires_action':
                    const paymentIntent_actions = event.data.object;
                    console.log(paymentIntent_actions);
                    // Then define and call a function to handle the event payment_intent.requires_action
                    break;
                case 'payment_intent.succeeded':
                    const { id, transfer_group, latest_charge, metadata } =
                        event.data.object as Stripe.PaymentIntent;
                    console.log('PAYMENT ID =>', id);
                    const { orderId } = metadata;
                    const order = await admin
                        .firestore()
                        .collection('pendingOrders')
                        .doc(orderId)
                        .get();
                    if (!order.exists) {
                        console.log('No Order with ID => ', order.id);
                        return res.status(404).send('no order found');
                    }

                    const { total, businessId } = order.data() as Order;
                    const business = await admin
                        .firestore()
                        .collection('business')
                        .doc(businessId)
                        .get();
                    const { stripeAccount } = business.data() as Business;
                    if (!stripeAccount) {
                        console.log('No Stripe Account', stripeAccount);
                        return res.status(404).send('no order found');
                    }

                    let myFee = (total * 1.1) / 100;
                    if (myFee >= 2) {
                        myFee = 2;
                    }

                    const amountTobePaid = total - +myFee.toFixed(2);
                    const fee = Math.round(+amountTobePaid.toFixed(2) * 100);

                    const transf = await stripe.transfers.create({
                        amount: fee,
                        currency: 'usd',
                        destination: stripeAccount!,
                        transfer_group: transfer_group!,
                        source_transaction: latest_charge?.toString(),
                        metadata: {
                            orderId
                        }
                    });

                    await order.ref.delete();

                    return res.status(200).send(transf.id);
                // Then define and call a function to handle the event payment_intent.succeeded

                case 'transfer.created':
                    const eventT = event.data.object as Stripe.Transfer;

                    return res.status(200).send(eventT.id);

                // Then define and call a function to handle the event transfer.created

                case 'transfer.reversed':
                    const { id: tReversed } = event.data
                        .object as Stripe.Transfer;
                    // Then define and call a function to handle the event transfer.reversed
                    console.log(tReversed);
                    break;
                case 'transfer.updated':
                    const transfer = event.data.object as Stripe.Transfer;
                    console.log(transfer.id);
                    // Then define and call a function to handle the event transfer.updated
                    break;
                // ... handle other event types
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            return res.status(200).send('Success');
        } catch (error) {
            console.log(error);
            const err = error as any;
            functions.logger.error('Error message', err.message);
            return res.status(400).send(`Webhook Deli Error:' ${err.message}`);
        }
    }
);

exports.checkIfEmailIsVerified = functions.https.onCall(
    async (data: { email: string }, context): Promise<UserRecord | null> => {
        try {
            if (!data.email || !context.auth) return null;
            const user = await admin.auth().getUserByEmail(data.email);

            if (user.emailVerified) {
                await admin
                    .firestore()
                    .collection('users')
                    .doc(user.uid)
                    .update({ emailVerified: true });
            }
            return user;
        } catch (error) {
            const err = error as any;
            console.log('Error on verifing email', err.message);
            return null;
        }
    }
);

exports.addConnectedAccountToBusiness = functions.https.onCall(
    async (data: { accountId: string }, context): Promise<Response> => {
        try {
            if (!context.auth)
                return { success: false, result: 'Not authorized' };
            const userId = context.auth?.uid;
            const isAuth = await isAuthorizedToGrantAccess(
                context.auth?.token.email!
            );

            if (!context.auth || !isAuth)
                return { success: false, result: 'Not authorized' };

            const { accountId } = data;
            if (!accountId)
                return { success: false, result: 'no account Id provided' };

            const account = await stripe.accounts.retrieve({
                stripeAccount: accountId
            });
            const { charges_enabled } = account;
            if (charges_enabled) {
                await admin.firestore().collection('business').doc(userId).set(
                    {
                        stripeAccount: account.id,
                        activatedOn: new Date().toISOString(),
                        charges_enabled: charges_enabled
                    },
                    { merge: true }
                );

                return {
                    success: charges_enabled,
                    result: 'account connected'
                };
            }
            return {
                success: charges_enabled,
                result: 'account not connected'
            };
        } catch (error) {
            const err = error as any;
            console.log('Error connecting store', err.message);
            return { success: false, result: err.message };
        }
    }
);

exports.checkForStoreReady = functions.firestore
    .document('business/{businessId}')
    .onWrite(async (change, context) => {
        try {
            const data = change.after.data() as Business;

            const { stripeAccount, profileCompleted } = data;
            if (!stripeAccount || profileCompleted) return;

            const { charges_enabled, id } = await stripe.accounts.retrieve(
                stripeAccount
            );
            if (!charges_enabled) {
                await admin
                    .firestore()
                    .collection(`business`)
                    .doc(context.params.businessId)
                    .update({ isActive: false, profileCompleted: false });
            }

            const productsRef = admin
                .firestore()
                .collection(`products/${context.params.businessId}/products`);

            const products = await productsRef.get();
            const hasProducts = products.size > 0;
            const cardEnabled = charges_enabled;
            console.log('READY =>', hasProducts, cardEnabled);
            if (!hasProducts || !cardEnabled) return;

            return admin
                .firestore()
                .collection(`business`)
                .doc(context.params.businessId)
                .set(
                    {
                        isActive: true,
                        profileCompleted: true,
                        charges_enabled: cardEnabled,
                        stripeAccount: id
                    },
                    { merge: true }
                );
        } catch (error) {
            const err = error as any;
            console.log('Error checking for store', err.message);
            throw new functions.https.HttpsError(
                'aborted',
                'error creating connected account',
                error
            );
        }
    });

exports.createPaymentIntent = functions.https.onCall(
    async (
        data: { connectedId: string; total: number; orderId: string },
        context
    ): Promise<{ success: boolean; result: any }> => {
        try {
            if (context.auth === undefined || context.auth.uid === undefined)
                return { result: 'no autthorized', success: false };
            const customer = await admin
                .firestore()
                .collection('stripe_customers')
                .doc(context.auth.uid)
                .get();
            if (!customer.exists)
                return { result: 'no customer', success: false };
            const { customer_id } = customer.data() as { customer_id: string };
            if (!customer_id)
                return { result: 'no customer id', success: false };
            const userData = await admin
                .firestore()
                .collection('users')
                .doc(context.auth.uid)
                .get();
            const { email } = userData.data() as AppUser;
            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer_id },
                { apiVersion: '2022-11-15' }
            );

            console.log('ORDER-ID =>', data.orderId, 'TOTAL =>', data.total);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(+data.total.toFixed(2) * 100),
                currency: 'usd',
                customer: customer_id,
                receipt_email: email,
                automatic_payment_methods: {
                    enabled: true
                },
                // transfer_data: {
                //     destination: data.connectedId
                // },
                on_behalf_of: data.connectedId,
                transfer_group: UUID(),

                // application_fee_amount: +(data.total * 100 * 0.08).toFixed(0),
                metadata: {
                    userId: context.auth.uid,
                    userEmail: email,
                    orderId: data.orderId
                }
            });

            return {
                success: true,
                result: {
                    ephemeralKey: ephemeralKey.secret,
                    paymentIntent: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
                    customer: customer_id
                }
            };
        } catch (error) {
            const err = error as any;
            console.log('Error creating payment intent', err);

            return { success: false, result: err.message };
        }
    }
);
exports.createRefund = functions.https.onCall(
    async (
        data: { payment_intent: string },
        context: functions.https.CallableContext
    ) => {
        try {
            if (!context.auth) return;
            const admin = await isAuthorizedToGrantAccess(
                context.auth.token.email!
            );
            if (!admin) return;

            const refund = await stripe.refunds.create({
                payment_intent: data.payment_intent,
                reverse_transfer: true,
                refund_application_fee: true
            });

            console.log('REFUND_ID => ', refund.id);

            return { refundId: refund.id, status: refund.status };
        } catch (error) {
            const err = error as any;
            console.log('Refund Error', err.message);
            throw new functions.https.HttpsError(
                'aborted',
                'error occurred in refund',
                err.message
            );
        }
    }
);

exports.generateOrderNumber = functions.firestore
    .document('/orders/{orderId}')
    .onCreate(async (snap, contex) => {
        try {
            const data = snap.data() as Order;

            const restaurantOrdersTotal = (
                await admin
                    .firestore()
                    .collection('orders')
                    .where('businessId', '==', data.businessId)
                    .get()
            ).docs.length;
            return await snap.ref.update({
                orderNumber: restaurantOrdersTotal + 1
            });
        } catch (error) {
            console.log(error);
            const err = error as any;
            throw new functions.https.HttpsError('aborted', err.message);
        }
    });

exports.updateUnitSold = functions.firestore
    .document('/orders/{orderId}')
    .onCreate(async (snap, contex) => {
        const items = snap.data().items;

        items.forEach(async (item: CartItem) => {
            try {
                const productsRef = admin
                    .firestore()
                    .collection('products')
                    .doc(item.businessId)
                    .collection('products')
                    .doc(item.id!);
                const products = await productsRef.get();

                // await sendNewOrderNotification(contex.params.orderId);
                return productsRef.update({
                    unitSold: parseInt(
                        products.data()?.unitSold + item.quantity
                    )
                });
            } catch (error) {
                console.error('ERROR updating units sold', error);
                return null;
            }
        });
    });

exports.sendOrderStatusUpdates = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(
        async (
            change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
            context
        ) => {
            try {
                const data = change.after.data() as Order;
                const before = change.before.data() as Order;
                if (data.status === before.status) return;
                let title,
                    body,
                    notificationType = '';

                if (!data) return;

                if (data.status === ORDER_STATUS.picked_up_by_driver) {
                    title = 'Great News';
                    body = `${
                        data.courier?.name.charAt(0).toUpperCase() +
                        data.courier?.name.slice(1)!
                    } is on his way to pick up your order`;
                    notificationType = data.status;
                } else if (data.status === ORDER_STATUS.delivered) {
                    title = 'You got Delivered';
                    body =
                        'Your order was just delivery, we hope you enjoy it!';
                    notificationType = data.status;
                } else {
                    return;
                }

                const userRef = await admin
                    .firestore()
                    .collection('users')
                    .doc(data.userId)
                    .get();
                if (!userRef.exists) return;
                const user = userRef.data() as AppUser;

                if (!user.pushToken) return;

                return fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        host: 'exp.host',
                        accept: 'application/json',
                        'accept-encoding': 'gzip, deflate',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: user.pushToken,
                        title: `${title}`,
                        body: `${body}`,
                        data: { notificationType }
                    })
                });
            } catch (error) {
                console.log(error);
                throw new functions.https.HttpsError(
                    'aborted',
                    'error sending notification'
                );
            }
        }
    );

exports.payCourier = functions.https.onCall(
    async (data: { orderId: string }, context) => {
        try {
            const orderRef = await admin
                .firestore()
                .collection('orders')
                .doc(data.orderId)
                .get();
            if (!orderRef.exists) return;

            const order = orderRef.data() as Order;
            if (!order.tip?.amount || order.deliveryPaid) return;

            const { transfer_group, status } =
                await stripe.paymentIntents.retrieve(order.paymentIntent);
            console.log('TIP =>', order.tip.amount);
            if (status !== 'succeeded') return;
            await stripe.transfers.create({
                amount: Math.round(+order.tip?.amount.toFixed(2) * 100),
                currency: 'usd',
                destination: 'acct_1MMGYfCGpz9ntd7c',
                transfer_group: transfer_group!,
                metadata: {
                    orderId: order.id!
                }
            });

            await admin
                .firestore()
                .collection('orders')
                .doc(data.orderId)
                .set({ ...data, deliveryPaid: true }, { merge: true });

            console.log('COURIER PAID =>', order.tip.amount);
        } catch (error) {
            const err = error as any;
            console.log(err.message);
            throw new functions.https.HttpsError(
                'aborted',
                'error sending notification'
            );
        }
    }
);

export async function isAuthorizedToGrantAccess(
    email: string
): Promise<boolean> {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && user.customClaims.type === 'business') return true;
    return false;
}
