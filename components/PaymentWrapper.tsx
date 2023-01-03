import { Alert, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchPaymentParams } from '../firebase';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import Loader from './Loader';
import { Business } from '../redux/business/businessSlide';
import { Order, setOrder } from '../redux/consumer/ordersSlide';
import PaymentLoading from './PaymentLoading';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { placeOrder } from '../redux/consumer/ordersActions';

type Props = {
    children: React.ReactElement;
    loading: boolean;
    setLoading: (value: boolean) => void;
    setPaymentIntentId: (value: string) => void;
    paymentSuccess: boolean;
    setPaymentSuccess: (value: boolean) => void;
    business: Business;
};

const PaymentWrapper = ({
    setLoading,
    loading,
    paymentSuccess,
    setPaymentSuccess,
    setPaymentIntentId,
    business,
    children
}: Props) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { user } = useAppSelector((state) => state.auth);
    const { order } = useAppSelector((state) => state.orders);
    const { total } = useAppSelector((state) => state.cart);
    const fetchParams = useCallback(async () => {
        try {
            setLoading(true);

            if (!business || !business.stripeAccount) return;
            console.log(+total.toFixed(2));

            const func = fetchPaymentParams('createPaymentIntent');
            const {
                data: { success, result }
            } = await func({
                connectedId: business.stripeAccount,
                total: +total.toFixed(2)
            });

            console.log('Results', success, result);
            if (!success) return;
            const { customer, ephemeralKey, paymentIntentId, paymentIntent } =
                result;

            return {
                customer,
                ephemeralKey,
                paymentIntentId,
                paymentIntent
            };
        } catch (error) {
            console.log('error', error);
            setPaymentSuccess(false);
        } finally {
            setLoading(false);
        }
    }, [business?.stripeAccount, total]);

    const startPayment = useCallback(async () => {
        try {
            const result = await fetchParams();

            if (!result) return;

            const { customer, ephemeralKey, paymentIntent, paymentIntentId } =
                result!;

            const { error } = await initPaymentSheet({
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                customerId: customer,
                appearance: {
                    primaryButton: {
                        colors: {
                            background: theme.ASCENT,
                            text: theme.WHITE_COLOR
                        }
                    },
                    colors: {
                        dark: {
                            componentDivider: theme.ASCENT,
                            background: theme.BACKGROUND_COLOR,
                            componentBorder: theme.ASCENT,
                            componentBackground: theme.BACKGROUND_COLOR
                        },
                        light: {
                            componentDivider: theme.ASCENT,
                            background: theme.BACKGROUND_COLOR,
                            componentBorder: theme.ASCENT,
                            componentBackground: theme.BACKGROUND_COLOR
                        }
                    }
                },
                merchantDisplayName: business?.name!,
                applePay: {
                    merchantCountryCode: 'US'
                },
                googlePay: {
                    merchantCountryCode: 'US',
                    testEnv: true
                },
                defaultBillingDetails: {
                    name: `${user?.name} ${user?.lastName}`,
                    email: user?.email
                }
            });

            if (!error) {
                setLoading(true);

                openPaymentSheet(paymentIntentId);
            } else {
                console.log('error A', error);
                Alert.alert(`${error.code}`, error.message);
                return;
            }
        } catch (error) {
            console.log('error B', error);
        } finally {
            setLoading(false);
        }
    }, [paymentSuccess]);

    const openPaymentSheet = useCallback(async (paymentId: string) => {
        try {
            const { error } = await presentPaymentSheet();
            if (error) {
                console.log('error', error);
                Alert.alert(`${error.code}`, error.message);
                return;
            } else {
                setPaymentSuccess(false);

                if (!order) return;
                const { payload } = await dispatch(
                    placeOrder({ ...order, paymentIntent: paymentId })
                );
                console.log('payload', payload);
                if (!payload) return;
                navigation.dispatch((state) => {
                    const routes = state.routes.filter(
                        (r) => r.name !== ('OrderReview' as any)
                    );

                    return CommonActions.reset({
                        ...state,
                        routes: [...routes],
                        index: 0
                    });
                });

                navigation.navigate('ConsumerOrders', {
                    screen: 'OrderDetails'
                });
            }
        } catch (error) {
            console.log('error C', error);
        }
    }, []);
    console.log('PAYMENT_METHODS', paymentSuccess);

    useEffect(() => {
        if (!paymentSuccess || !business) return;
        if (paymentSuccess) {
            startPayment();
        }
        return () => {
            setPaymentSuccess(false);
        };
    }, [paymentSuccess, business]);

    if (loading) return <PaymentLoading />;
    return (
        <StripeProvider
            publishableKey={process.env.STRIPE_TEST_PK!}
            merchantIdentifier="net.robertdev.deli.app"
            threeDSecureParams={{
                backgroundColor: theme.BACKGROUND_COLOR,
                timeout: 8
            }}
        >
            {children}
        </StripeProvider>
    );
};

export default PaymentWrapper;
