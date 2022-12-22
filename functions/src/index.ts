import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();
admin.initializeApp();

import Stripe from 'stripe';

import { assignUserType } from './shared';

import { UserRecord } from 'firebase-functions/v1/auth';

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
            const data = change.after.data();

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
            console.log(error);
            throw new functions.https.HttpsError(
                'aborted',
                'error creating connected account',
                error
            );
        }
    }
);

exports.businessAccount = functions.https.onRequest(
    async (
        req: functions.https.Request,
        res: functions.Response<any>
    ): Promise<any> => {
        const webhookSecret = process.env.CONNECTED;
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
                    break;
                case 'payment_intent.succeeded':
                    const paymentIntentSucceeded = event.data
                        .object as Stripe.PaymentIntent;

                    console.log('PAY', paymentIntentSucceeded);

                    // Then define and call a function to handle the event payment_intent.succeeded
                    break;
                // ... handle other event types
                case 'account.updated':
                    break;

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

export async function isAuthorizedToGrantAccess(
    email: string
): Promise<boolean> {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && user.customClaims.type === 'business') return true;
    return false;
}
