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
import { useGooglePay } from '@stripe/stripe-react-native';
import {
    Order,
    ORDER_TYPE,
    setPaymentSuccess,
    setOrder,
    setTipAmount,
    setGrandTotal,
    setDeliveryZip,
    switchOrderType
} from '../../../redux/consumer/ordersSlide';
import {
    placeOrder,
    placePendingOrder
} from '../../../redux/consumer/ordersActions';
import { fetchPaymentParams } from '../../../firebase';

import InputField from '../../../components/InputField';
import { useCanBeDelivery } from '../../../hooks/useCanBeDelivery';
import CustomTip from '../../../components/CustomTip';
import KeyboardScreen from '../../../components/KeyboardScreen';

export type CheckOutProps = NativeStackScreenProps<
    ConsumerCartStackScreens,
    'Checkout'
>;
const Checkout = ({ navigation }: CheckOutProps) => {
    const theme = useAppSelector((state) => state.theme);
    const { isGooglePaySupported } = useGooglePay();

    const [loading, setLoading] = useState(false);
    const [paymentId, setPaymentId] = useState('');
    const { user } = useAppSelector((state) => state.auth);
    const [showCustomTip, setShowCustomTip] = useState(false);
    const [deliveryInstructions, setDeliveryInstructions] = React.useState('');
    const [showInstructions, setShowInstuctions] = React.useState(false);
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
                    stripeFee(total, orderType) +
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
                allowsDelayedPaymentMethods: true,
                merchantDisplayName: business?.name!,
                applePay: {
                    merchantCountryCode: 'US'
                },
                googlePay: {
                    merchantCountryCode: 'US',
                    currencyCode: 'usd',
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
            if (deliveryAdd && !canBeDelivery) {
                dispatch(
                    setDeliveryZip(
                        +deliveryAdd.street.split(', ')[2].split(' ')[1]
                    )
                );
            }
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
                    stripeFee(total, orderType)
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
            <KeyboardScreen>
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
                            flex: 1
                        }}
                    >
                        <View style={{ flex: 0.7 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View>
                                    <Section>
                                        <Row horizontalAlign="space-between">
                                            <Stack>
                                                <Text bold>
                                                    Your information
                                                </Text>
                                                <Text>
                                                    {order?.contactPerson.name}{' '}
                                                    {
                                                        order?.contactPerson
                                                            .lastName
                                                    }
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
                                                containerStyle={{
                                                    width: '100%'
                                                }}
                                                horizontalAlign="space-between"
                                            >
                                                <Stack>
                                                    <Text bold>
                                                        Pick up at{' '}
                                                        {business?.name}
                                                    </Text>
                                                    <Text py_4>
                                                        {business?.address?.slice(
                                                            0,
                                                            -10
                                                        )}
                                                    </Text>
                                                    <Text>
                                                        {business?.phone}
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
                                    {orderType === ORDER_TYPE.delivery && (
                                        <Section
                                            onPress={() =>
                                                navigation.navigate(
                                                    'AddressSelection'
                                                )
                                            }
                                        >
                                            <Row
                                                containerStyle={{
                                                    width: '100%'
                                                }}
                                                horizontalAlign="space-between"
                                            >
                                                <Stack>
                                                    <Text bold>
                                                        Delivery To
                                                    </Text>
                                                    <Text>
                                                        {deliveryAdd?.street?.substring(
                                                            0,
                                                            deliveryAdd.street
                                                                .length - 5
                                                        )}
                                                    </Text>
                                                    {deliveryAdd?.apt && (
                                                        <Text>
                                                            Apt{' '}
                                                            {deliveryAdd.apt}
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
                                    {orderType === ORDER_TYPE.delivery && (
                                        <Section>
                                            <Row
                                                containerStyle={{
                                                    width: '100%',
                                                    padding: SIZES.padding
                                                }}
                                                horizontalAlign="space-between"
                                            >
                                                <Text bold>
                                                    Delivery Instructions
                                                </Text>

                                                <Button
                                                    outlined
                                                    title={
                                                        order?.deliveryInstructions
                                                            ? 'Edit'
                                                            : 'Add'
                                                    }
                                                    onPress={() => {
                                                        setShowInstuctions(
                                                            true
                                                        );
                                                    }}
                                                />
                                            </Row>
                                            {order?.deliveryInstructions && (
                                                <View
                                                    style={{
                                                        padding: SIZES.base
                                                    }}
                                                >
                                                    <Text px_4>
                                                        {
                                                            order?.deliveryInstructions
                                                        }
                                                    </Text>
                                                </View>
                                            )}
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
                                            <Text
                                                raleway_bold
                                                medium
                                                center
                                                py_4
                                            >
                                                {quantity}{' '}
                                                {quantity > 1
                                                    ? 'items'
                                                    : 'item'}
                                            </Text>
                                            {items.map((item, index) => (
                                                <ProductListItem
                                                    key={index.toString()}
                                                    item={item}
                                                    index={index}
                                                />
                                            ))}
                                        </>
                                        <Princing>
                                            <Row horizontalAlign="space-between">
                                                <Text bold left>
                                                    Sub-Total{' '}
                                                </Text>
                                                <Text bold>
                                                    ${total.toFixed(2)}
                                                </Text>
                                            </Row>

                                            <Row horizontalAlign="space-between">
                                                <Text py_2>Service Fee</Text>
                                                <Text>
                                                    $
                                                    {stripeFee(
                                                        total,
                                                        orderType
                                                    )}
                                                </Text>
                                            </Row>
                                            {orderType ===
                                                ORDER_TYPE.delivery && (
                                                <Row horizontalAlign="space-between">
                                                    <Text>Tip Amount</Text>
                                                    <Text>
                                                        $
                                                        {customTip &&
                                                        orderType ===
                                                            ORDER_TYPE.delivery
                                                            ? customTip
                                                            : amount.toFixed(
                                                                  2
                                                              )}{' '}
                                                    </Text>
                                                </Row>
                                            )}
                                        </Princing>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
                            <Footer
                                style={{
                                    justifyContent: 'flex-end',
                                    borderRadius: SIZES.radius
                                }}
                            >
                                {orderType === ORDER_TYPE.delivery ? (
                                    <CustomTip
                                        customTip={customTip}
                                        setCustomTip={setCustomTip}
                                        setShowCustomTip={setShowCustomTip}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginVertical: 10
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                Alert.alert(
                                                    'Order Type',
                                                    'Do you want to change your order to delivery?',
                                                    [
                                                        {
                                                            text: 'No',
                                                            style: 'cancel'
                                                        },
                                                        {
                                                            text: 'Yes',
                                                            style: 'destructive',
                                                            onPress: () => {
                                                                dispatch(
                                                                    switchOrderType(
                                                                        ORDER_TYPE.delivery
                                                                    )
                                                                );
                                                            }
                                                        }
                                                    ]
                                                );
                                            }}
                                        >
                                            <Text bold py_6>
                                                Switch to Delivery
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <Button
                                    disabled={loading}
                                    isLoading={loading}
                                    containerStyle={{
                                        width: '80%',
                                        alignSelf: 'center',
                                        marginVertical: SIZES.padding
                                    }}
                                    title={`Pay $${(
                                        total +
                                        (customTip &&
                                        orderType === ORDER_TYPE.delivery
                                            ? +parseInt(customTip).toFixed(2)
                                            : amount) +
                                        stripeFee(total, orderType)
                                    ).toFixed(2)}`}
                                    outlined
                                    onPress={handlePlacePendingOrder}
                                />
                            </Footer>
                        </View>
                    </Container>
                </StripeProvider>
            </KeyboardScreen>

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
                                            stripeFee(total, orderType)
                                        ).toFixed(2)
                                    )
                                );
                                setShowCustomTip(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>
            <Modal visible={showInstructions} animationType="slide">
                <View
                    style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}
                >
                    <Header
                        title="Delivery Instructions"
                        onPressBack={() => setShowInstuctions(false)}
                    />
                    <View style={{ marginTop: 30 }}>
                        <Text raleway_bold px_4>
                            Delivery Instructions
                        </Text>
                        <InputField
                            nogap
                            containerStyle={{
                                borderRadius: SIZES.radius
                            }}
                            multiline
                            placeholder="Note for the driver"
                            value={deliveryInstructions}
                            maxLenght={100}
                            onChangeText={(text) => {
                                setDeliveryInstructions(text);
                                dispatch(
                                    setOrder({
                                        ...order!,
                                        deliveryInstructions: text
                                    })
                                );
                            }}
                        />
                        {deliveryInstructions.length > 0 && (
                            <Text px_4 small>
                                {deliveryInstructions.length} / 100
                            </Text>
                        )}

                        <Button
                            containerStyle={{
                                marginTop: 20,
                                width: '80%',
                                alignSelf: 'center'
                            }}
                            title={
                                order?.deliveryInstructions ? 'Update' : 'Add'
                            }
                            onPress={() => {
                                setShowInstuctions(false);
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
    background-color: ${(props) => props.theme.CARD_BACKGROUND};
    margin: 2px 0px
    shadow-opacity: 0.4;
    shadow-radius: 3px;
    padding: 0px 4px;
    border-radius: 6px;
    shadow-box: 4px 4px 6px ${(props) => props.theme.SHADOW_COLOR};
`;

const Footer = styled.View`
    padding: ${SIZES.base * 2}px;
    background-color: ${(props) => props.theme.CARD_BACKGROUND};
`;
const Container = styled.View``;
const Princing = styled.View`
    width: 100%;
    padding: ${SIZES.base * 2}px;
`;
