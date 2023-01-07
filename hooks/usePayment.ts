import { CommonActions, useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { fetchPaymentParams } from '../firebase';
import { placeOrder } from '../redux/consumer/ordersActions';
import { saveDeliveryAddress } from '../redux/consumer/ordersSlide';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const usePayment = () => {
    const { total } = useAppSelector((state) => state.cart);
    const { order } = useAppSelector((state) => state.orders);
    const { business } = useAppSelector((state) => state.business);
    const { user } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

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
        } finally {
            setLoading(false);
        }
    }, [business?.stripeAccount, total]);

    const openPaymentSheet = useCallback(async (paymentId: string) => {
        try {
            if (total === 0) return;
            const { error } = await presentPaymentSheet();
            if (error) {
                console.log('error', error);
                Alert.alert(`${error.code}`, error.message);
                return;
            } else {
                if (!order) return;

                const { payload } = await dispatch(
                    placeOrder({ ...order, paymentIntent: paymentId })
                );
                const { success, orderId } = payload as {
                    success: boolean;
                    orderId: string | null;
                };

                console.log('Order Placed Result', payload);
                if (!success || !orderId) return;
                navigation.dispatch((state) => {
                    const routes = state.routes.filter(
                        (r) => r.name === ('Cart' as any)
                    );
                    //RESET ALL NAVIGATION BUT CART SCREEN
                    return CommonActions.reset({
                        ...state,
                        routes: [...routes],
                        index: 0
                    });
                });
                dispatch(saveDeliveryAddress(null));

                navigation.navigate('ConsumerOrders', {
                    screen: 'OrderDetails',
                    params: { orderId: orderId }
                });
            }
        } catch (error) {
            console.log('error C', error);
        }
    }, []);

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
                    email: user?.email,
                    phone: user?.phone ? user?.phone : undefined
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
    }, []);

    return { loading, startPayment };
};
