import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { fetchPaymentParams } from '../../../firebase';
import { placeOrder } from '../../../redux/consumer/ordersActions';
import Header from '../../../components/Header';
import Stack from '../../../components/Stack';
import Row from '../../../components/Row';
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import ProductListItem from '../../../components/ProductListItem';
import { SIZES } from '../../../constants';
import { stripeFee } from '../../../utils/stripeFee';
import Divider from '../../../components/Divider';
import Button from '../../../components/Button';
import PaymentLoading from '../../../components/PaymentLoading';

type Props = {};

const Checkout = ({}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { business } = useAppSelector((state) => state.business);
    const { order } = useAppSelector((state) => state.orders);
    const { total, items, quantity } = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);

    console.log('order', order?.address?.apt);

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

    const openPaymentSheet = useCallback(async (paymentId: string) => {
        try {
            const { error, paymentOption } = await presentPaymentSheet();
            if (error) {
                console.log('error', error);
                Alert.alert(`${error.code}`, error.message);
                return;
            } else {
                if (!order) return;
                console.log('PO', paymentOption);
                const { payload } = await dispatch(
                    placeOrder({ ...order, paymentIntent: paymentId })
                );

                console.log('Order Placed', payload);
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

                // navigation.navigate('ConsumerOrders', {
                //     screen: 'OrderDetails'
                // });
            }
        } catch (error) {
            console.log('error C', error);
        }
    }, []);

    if (loading) return <PaymentLoading />;
    return (
        <Screen>
            <StripeProvider
                publishableKey={process.env.STRIPE_TEST_PK!}
                merchantIdentifier="net.robertdev.deli.app"
                threeDSecureParams={{
                    backgroundColor: theme.BACKGROUND_COLOR,
                    timeout: 8
                }}
            >
                <Header
                    title="Checkout"
                    onPressBack={() => navigation.goBack()}
                />
                <Container
                    style={{
                        justifyContent: 'space-between',
                        flexGrow: 1
                    }}
                >
                    <ScrollView>
                        <View>
                            <Section>
                                <Row horizontalAlign="space-between">
                                    <Stack>
                                        <Text bold>Your information</Text>
                                        <Text>
                                            {order?.contactPerson.name}{' '}
                                            {order?.contactPerson.lastName}
                                        </Text>
                                        <Text>
                                            {order?.contactPerson.phone}
                                        </Text>
                                    </Stack>
                                    <FontAwesome
                                        name="chevron-right"
                                        size={18}
                                        color={theme.TEXT_COLOR}
                                    />
                                </Row>
                            </Section>
                            <Section onPress={() => navigation.goBack()}>
                                <Row
                                    containerStyle={{ width: '100%' }}
                                    horizontalAlign="space-between"
                                >
                                    <Stack>
                                        <Text bold>Delivery To</Text>
                                        <Text>
                                            {order?.address?.street.substring(
                                                0,
                                                order.address.street.length - 5
                                            )}
                                        </Text>
                                        {order?.address?.apt && (
                                            <Text>Apt {order.address.apt}</Text>
                                        )}
                                    </Stack>
                                    <FontAwesome
                                        name="chevron-right"
                                        size={18}
                                        color={theme.TEXT_COLOR}
                                    />
                                </Row>
                            </Section>
                            {order?.deliveryInstructions && (
                                <Section onPress={() => navigation.goBack()}>
                                    <Row
                                        containerStyle={{ width: '100%' }}
                                        horizontalAlign="space-between"
                                    >
                                        <Stack>
                                            <Text bold>
                                                Delivery Instructions
                                            </Text>
                                            <Text>
                                                {order.deliveryInstructions}
                                            </Text>
                                        </Stack>
                                        <FontAwesome
                                            name="chevron-right"
                                            size={18}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </Row>
                                </Section>
                            )}
                            <View
                                style={{
                                    paddingHorizontal: SIZES.padding,
                                    maxHeight: '40%'
                                }}
                            >
                                <>
                                    <Divider />
                                    <Text raleway_bold medium center py_4>
                                        {quantity}{' '}
                                        {quantity > 1 ? 'items' : 'item'}
                                    </Text>
                                    {items.map((item, index) => (
                                        <ProductListItem
                                            key={index.toString()}
                                            item={item}
                                            index={index}
                                        />
                                    ))}
                                </>
                            </View>
                        </View>
                    </ScrollView>
                    <Princing>
                        <Row horizontalAlign="space-between">
                            <Text left>sub-total </Text>
                            <Text>${total.toFixed(2)}</Text>
                        </Row>

                        <Row horizontalAlign="space-between">
                            <Text>service fee</Text>
                            <Text>${stripeFee(total)}</Text>
                        </Row>
                        <Row horizontalAlign="space-between">
                            <Text bold medium>
                                {' '}
                                Total
                            </Text>
                            <Text py_4 left bold medium>
                                ${(total + stripeFee(total)).toFixed(2)}
                            </Text>
                        </Row>
                    </Princing>
                    <Footer
                        style={{
                            alignSelf: 'center',
                            width: '60%'
                        }}
                    >
                        <Button
                            disabled={loading}
                            isLoading={loading}
                            title="Place Order"
                            outlined
                            onPress={startPayment}
                        />
                    </Footer>
                </Container>
            </StripeProvider>
        </Screen>
    );
};

export default Checkout;

const Section = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.BACKGROUND_COLOR};
    margin: 6px 0px
    shadow-opacity: 0.4;
    shadow-radius: 3px;
    shadow-box: 4px 4px 6px ${(props) => props.theme.SHADOW_COLOR};
`;

const Footer = styled.View`
    padding: ${SIZES.base * 2}px;
    height: 10%;
`;
const Container = styled.View``;
const Princing = styled.View`
    width: 100%;
    padding: ${SIZES.base * 2}px;
`;

const styles = StyleSheet.create({
    section: {}
});
