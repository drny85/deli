import { Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

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
import PaymentLoading from '../../../components/lottie/PaymentLoading';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerCartStackScreens } from '../../../navigation/consumer/typing';
import {
    Order,
    ORDER_TYPE,
    setPaymentSuccess,
    setOrder,
    setTipAmount,
    setGrandTotal
} from '../../../redux/consumer/ordersSlide';
import {
    placeOrder,
    placePendingOrder
} from '../../../redux/consumer/ordersActions';
import { fetchPaymentParams } from '../../../firebase';

import InputField from '../../../components/InputField';
import { useCanBeDelivery } from '../../../hooks/useCanBeDelivery';

export type CheckOutProps = NativeStackScreenProps<
    ConsumerCartStackScreens,
    'Checkout'
>;
const Checkout = ({ navigation }: CheckOutProps) => {
    const theme = useAppSelector((state) => state.theme);
    const [loading, setLoading] = useState(false);
    const [paymentId, setPaymentId] = useState('');
    const { user } = useAppSelector((state) => state.auth);
    const [showCustomTip, setShowCustomTip] = useState(false);
    const [customTip, setCustomTip] = useState('');
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { total, items, quantity } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const canBeDelivery = useCanBeDelivery();
    //const navigation = useNavigation();
    const {
        order,
        deliveryAdd,
        paymentSuccess,
        loading: loadingOrder,
        orderType,
        tip: { amount, percentage }
    } = useAppSelector((state) => state.orders);
    const { business } = useAppSelector((state) => state.business);

    const [pOrder, setPendingOrder] = useState<Order>();

    const validateOrder = (): boolean => {
        if (orderType === ORDER_TYPE.delivery) {
            if (!deliveryAdd) {
                Alert.alert(
                    'No Delevery Address',
                    'Please enter a delivery address'
                );
                return false;
            }
        }
        return true;
    };

    const refuseToContinue = () => {
        Alert.alert(
            'Change Address',
            `${business?.name} is not current offering delivery to this address`
        );
        return;
    };

    const handlePlacePendingOrder = async () => {
        try {
            if (!order) return;
            if (orderType === ORDER_TYPE.delivery && !canBeDelivery) {
                refuseToContinue();
                return;
            }
            const valid = validateOrder();
            if (!valid) return;
            const o: Order = {
                ...order,
                deliveryPaid: false,
                tip:
                    orderType === ORDER_TYPE.delivery
                        ? {
                              amount: customTip
                                  ? +parseInt(customTip).toFixed(2)
                                  : +amount.toFixed(2),
                              percentage
                          }
                        : { amount: 0, percentage: 0 },
                orderType: orderType,
                paymentIntent: paymentId,
                transferId: null
            };
            const { payload } = await dispatch(placePendingOrder({ ...o }));
            const { success, pendingOrder } = payload as {
                success: boolean;
                pendingOrder: Order | null;
            };

            if (success && pendingOrder && pendingOrder.id) {
                //dispatch(setGrandTotal(grandTotal));
                setPendingOrder({ ...pendingOrder });
                const tAmount = +(
                    total +
                    stripeFee(total) +
                    (customTip ? +parseInt(customTip).toFixed(2) : amount)
                ).toFixed(2);

                startPayment(pendingOrder.id, tAmount);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const completeOrder = async (order: Order) => {
        try {
            if (!order.id) return;

            const { payload } = await dispatch(
                placeOrder({ ...order, paymentIntent: paymentId })
            );

            const { success, orderId } = payload as {
                success: boolean;
                orderId: string | null;
            };

            if (success && orderId) {
                navigation.replace('OrderSuccess', {
                    orderId
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchParams = async (orderId: string, amount: number) => {
        try {
            setLoading(true);

            if (!business || !business.stripeAccount) return;

            const func = fetchPaymentParams('createPaymentIntent');

            const {
                data: { success, result }
            } = await func({
                connectedId: business.stripeAccount,
                total: amount,
                orderId: orderId
            });

            if (!success) {
                console.log('ERROR =>', result);
                return;
            }
            const { customer, ephemeralKey, paymentIntentId, paymentIntent } =
                result;
            setPaymentId(paymentIntentId);

            return {
                customer,
                ephemeralKey,
                paymentIntentId,
                paymentIntent
            };
        } catch (error) {
            console.log('error', error);
            const err = error as any;
            Alert.alert(`${err.code}`, err.message);
        } finally {
            setLoading(false);
        }
    };

    const openPaymentSheet = useCallback(async (paymentId: string) => {
        try {
            if (total === 0) return;
            const { error } = await presentPaymentSheet();
            if (error) {
                Alert.alert(`${error.code}`, error.message);

                return;
            } else {
                if (!order) return;
                dispatch(
                    setOrder({
                        ...order,
                        paymentIntent: paymentId,
                        address: deliveryAdd
                    })
                );

                dispatch(setPaymentSuccess(true));
            }
        } catch (error) {
            console.log('error C', error);
        }
    }, []);
    const startPayment = async (orderId: string, amount: number) => {
        try {
            const result = await fetchParams(orderId, amount);

            if (!result || !orderId) return;

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

                openPaymentSheet(paymentId);
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
    };

    useEffect(() => {
        if (orderType === ORDER_TYPE.delivery) {
            dispatch(
                setTipAmount({
                    amount: (total * percentage) / 100,
                    percentage: percentage > 0 ? percentage : 20
                })
            );
        } else {
            dispatch(
                setTipAmount({
                    amount: 0,
                    percentage: 0
                })
            );
        }
    }, [percentage, amount, orderType]);

    useEffect(() => {
        dispatch(
            setGrandTotal(
                +(
                    total +
                    (total * percentage) / 100 +
                    stripeFee(total)
                ).toFixed(2)
            )
        );
    }, [percentage, total, customTip]);

    useEffect(() => {
        if (!paymentSuccess || !pOrder) return;

        completeOrder(pOrder);

        return () => {
            dispatch(setPaymentSuccess(false));
        };
    }, [paymentSuccess, pOrder]);

    useEffect(() => {
        if (canBeDelivery || orderType === ORDER_TYPE.pickup) return;

        refuseToContinue();
    }, [canBeDelivery]);

    if (loading || loadingOrder) return <PaymentLoading />;
    return (
        <Screen>
            <StripeProvider
                publishableKey={process.env.STRIPE_TEST_PK!}
                merchantIdentifier="merchant.net.robertdev.deli.app"
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
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ maxHeight: '50%' }}
                    >
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
                            {orderType === ORDER_TYPE.pickup && (
                                <Section>
                                    <Row
                                        containerStyle={{ width: '100%' }}
                                        horizontalAlign="space-between"
                                    >
                                        <Stack>
                                            <Text bold>
                                                Pick up at {business?.name}
                                            </Text>
                                            <Text py_4>
                                                {business?.address?.slice(
                                                    0,
                                                    -10
                                                )}
                                            </Text>
                                            <Text>{business?.phone}</Text>
                                        </Stack>
                                        <FontAwesome
                                            name="chevron-right"
                                            size={18}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </Row>
                                </Section>
                            )}
                            {orderType === ORDER_TYPE.delivery && (
                                <Section
                                    onPress={() =>
                                        navigation.navigate('AddressSelection')
                                    }
                                >
                                    <Row
                                        containerStyle={{ width: '100%' }}
                                        horizontalAlign="space-between"
                                    >
                                        <Stack>
                                            <Text bold>Delivery To</Text>
                                            <Text>
                                                {deliveryAdd?.street?.substring(
                                                    0,
                                                    deliveryAdd.street.length -
                                                        5
                                                )}
                                            </Text>
                                            {deliveryAdd?.apt && (
                                                <Text>
                                                    Apt {deliveryAdd.apt}
                                                </Text>
                                            )}
                                        </Stack>
                                        <FontAwesome
                                            name="chevron-right"
                                            size={18}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </Row>
                                </Section>
                            )}
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
                        {orderType === ORDER_TYPE.delivery && (
                            <Stack
                                containerStyle={{
                                    width: '100%',
                                    alignSelf: 'center'
                                }}
                            >
                                <Row
                                    containerStyle={{
                                        width: '100%',
                                        marginVertical: SIZES.base
                                    }}
                                    horizontalAlign="space-between"
                                >
                                    <Text pb_4>Add a tip for your driver</Text>
                                    <Text>
                                        {!customTip ? percentage + '% ' : ''}

                                        <Text bold px_4>
                                            $
                                            {customTip
                                                ? customTip
                                                : amount.toFixed(2)}
                                        </Text>
                                    </Text>
                                </Row>

                                <Row containerStyle={{ width: '100%' }}>
                                    <Row
                                        containerStyle={{
                                            width: '85%',
                                            alignSelf: 'center',
                                            overflow: 'hidden',
                                            backgroundColor:
                                                theme.SECONDARY_BUTTON_COLOR,
                                            borderRadius: SIZES.radius
                                        }}
                                        horizontalAlign="space-around"
                                    >
                                        {[10, 15, 20, 25].map((p, index) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    dispatch(
                                                        setTipAmount({
                                                            percentage: p,
                                                            amount:
                                                                (total * p) /
                                                                100
                                                        })
                                                    );
                                                    dispatch(
                                                        setGrandTotal(
                                                            +(
                                                                total +
                                                                (total * p) /
                                                                    100 +
                                                                stripeFee(total)
                                                            ).toFixed(2)
                                                        )
                                                    );
                                                    setCustomTip('');
                                                }}
                                                style={{
                                                    justifyContent: 'center',
                                                    backgroundColor:
                                                        percentage === p &&
                                                        !customTip
                                                            ? theme.ASCENT
                                                            : theme.SECONDARY_BUTTON_COLOR,
                                                    alignItems: 'center',
                                                    width: '25%',

                                                    paddingVertical:
                                                        SIZES.padding * 0.5,

                                                    borderLeftColor:
                                                        theme.TEXT_COLOR,
                                                    borderLeftWidth:
                                                        index === 0 ? 0 : 0.5
                                                }}
                                                key={p}
                                            >
                                                <Text
                                                    lightText={
                                                        percentage === p &&
                                                        !customTip
                                                    }
                                                    bold={
                                                        percentage === p &&
                                                        !customTip
                                                    }
                                                    center
                                                >
                                                    {p}%
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </Row>
                                    <TouchableOpacity
                                        style={{ flexGrow: 1 }}
                                        onPress={() => setShowCustomTip(true)}
                                    >
                                        <Text px_4>Custom</Text>
                                    </TouchableOpacity>
                                </Row>
                            </Stack>
                        )}

                        <Row horizontalAlign="space-between">
                            <Text left>Sub-Total </Text>
                            <Text>${total.toFixed(2)}</Text>
                        </Row>

                        <Row horizontalAlign="space-between">
                            <Text py_2>Service Fee</Text>
                            <Text>${stripeFee(total)}</Text>
                        </Row>
                        {orderType === ORDER_TYPE.delivery && (
                            <Row horizontalAlign="space-between">
                                <Text>Tip Amount</Text>
                                <Text>
                                    $
                                    {customTip &&
                                    orderType === ORDER_TYPE.delivery
                                        ? customTip
                                        : amount.toFixed(2)}{' '}
                                </Text>
                            </Row>
                        )}

                        <Row horizontalAlign="space-between">
                            <Text bold medium>
                                {' '}
                                Total
                            </Text>
                            <Text py_4 left bold medium>
                                $
                                {(
                                    total +
                                    (customTip &&
                                    orderType === ORDER_TYPE.delivery
                                        ? +parseInt(customTip).toFixed(2)
                                        : amount) +
                                    stripeFee(total)
                                ).toFixed(2)}
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
                            onPress={handlePlacePendingOrder}
                        />
                    </Footer>
                </Container>
            </StripeProvider>

            <Modal
                visible={showCustomTip}
                animationType="slide"
                presentationStyle="formSheet"
            >
                <View
                    style={{
                        paddingTop: 20,
                        flex: 1,
                        backgroundColor: theme.BACKGROUND_COLOR
                    }}
                >
                    <Header
                        title="Enter a custom tip"
                        onPressBack={() => setShowCustomTip(false)}
                    />
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20
                        }}
                    >
                        <Stack>
                            <Text>
                                Show your appreciation by tipping the courier.
                                100% of your tips go to the driver
                            </Text>
                        </Stack>
                        <View style={{ marginVertical: 20 }} />
                        <InputField
                            label="How much would you like to tip your driver?"
                            value={customTip}
                            leftIcon={
                                <FontAwesome
                                    name="dollar"
                                    size={18}
                                    color={theme.TEXT_COLOR}
                                />
                            }
                            placeholder="Custom Tip"
                            keyboardType="numeric"
                            contentStyle={{
                                fontSize: 18,
                                fontFamily: 'montserrat-bold'
                            }}
                            onChangeText={(text) => {
                                setCustomTip(text);
                                // dispatch(
                                //     setTipAmount({
                                //         amount: +text,
                                //         percentage: 0
                                //     })
                                // );
                            }}
                        />

                        <Button
                            outlined
                            title="Update Tip"
                            onPress={() => {
                                dispatch(
                                    setTipAmount({
                                        amount: +customTip,
                                        percentage: 0
                                    })
                                );
                                dispatch(
                                    setGrandTotal(
                                        +(
                                            total +
                                            +parseInt(customTip).toFixed(2) +
                                            stripeFee(total)
                                        ).toFixed(2)
                                    )
                                );
                                setShowCustomTip(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>
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
