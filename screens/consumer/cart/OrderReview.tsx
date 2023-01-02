import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import KeyboardScreen from '../../../components/KeyboardScreen';
import Row from '../../../components/Row';
import Screen from '../../../components/Screen';
import Stack from '../../../components/Stack';
import Text from '../../../components/Text';
import { SIZES } from '../../../constants';
import { setPreviosRoute } from '../../../redux/consumer/settingSlide';
import { useAppSelector } from '../../../redux/store';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { fetchPaymentParams } from '../../../firebase';

type Props = {};

const OrderReview = ({}: Props) => {
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useDispatch();
    const { items, quantity, total } = useAppSelector((state) => state.cart);
    const [deliveryInstructions, setDeliveryInstructions] = React.useState('');
    const { businesses } = useAppSelector((state) => state.business);
    const business = businesses.find(
        (business) => business.id === items[0].businessId
    );

    const fetchParams = useCallback(async () => {
        try {
            setLoading(true);

            if (!business || !business?.stripeAccount) return;

            const func = fetchPaymentParams('createPaymentIntent');
            const {
                data: { success, result }
            } = await func({
                connectedId: business.stripeAccount,
                total: +total.toFixed(2)
            });

            console.log(success, result);
            if (!success) return;
            const { customer, ephemeralKey, paymentIntentId, paymentIntent } =
                result;

            setPaymentIntent(paymentIntentId);

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

            const { customer, ephemeralKey, paymentIntentId, paymentIntent } =
                result!;

            const { error } = await initPaymentSheet({
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                customerId: customer,
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
                openPaymentSheet();
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

    const openPaymentSheet = useCallback(async () => {
        try {
            const { error } = await presentPaymentSheet();
            if (error) {
                console.log('error', error);
                Alert.alert(`${error.code}`, error.message);
                return;
            } else {
                console.log('openPaymentSheet SUCCESS');
            }
        } catch (error) {
            console.log('error C', error);
        }
    }, []);

    const handleCheckout = async () => {
        try {
            if (!user) {
                dispatch(setPreviosRoute('OrderReview'));
                navigation.goBack();
                navigation.navigate('ConsumerProfile', {
                    screen: 'Auth',
                    params: { screen: 'Login' }
                });
                return;
            } else {
                startPayment();
            }
        } catch (error) {
            console.log('error D', error);
        }
    };
    return (
        <StripeProvider
            publishableKey={process.env.STRIPE_TEST_PK!}
            merchantIdentifier="net.robertdev.deli.app"
            threeDSecureParams={{
                backgroundColor: theme.BACKGROUND_COLOR,
                timeout: 8
            }}
        >
            <Screen>
                <Header
                    onPressBack={() =>
                        navigation.navigate('ConsumerCart', { screen: 'Cart' })
                    }
                    title="Order Review"
                />

                <View>
                    <Stack>
                        <Text raleway_bold>{business?.name}</Text>
                        <Text raleway_italic>
                            {business?.address?.substring(
                                0,
                                business.address.length - 5
                            )}
                        </Text>
                    </Stack>
                    <ScrollView
                        contentContainerStyle={{
                            width: '100%',
                            paddingHorizontal: SIZES.base,
                            maxHeight: SIZES.height * 0.5
                        }}
                    >
                        <Text raleway_bold medium px_6>
                            {quantity} Items
                        </Text>
                        {items.map((item, index) => (
                            <Row
                                containerStyle={{
                                    width: '100%',
                                    marginVertical: SIZES.base
                                }}
                                horizontalAlign="space-between"
                                key={index.toString()}
                            >
                                <View>
                                    <Text left>
                                        {item.quantity} - {item.name}
                                    </Text>
                                </View>
                                <Row
                                    containerStyle={{
                                        width: '60%'
                                    }}
                                    horizontalAlign="space-between"
                                >
                                    <Text capitalize px_6>
                                        {item.size
                                            ? item.size.size.substring(0, 1)
                                            : ''}
                                    </Text>
                                    <Text center>
                                        {item.size
                                            ? item.size.price
                                            : item.price}
                                    </Text>
                                    <Text bold>
                                        $
                                        {(item.size
                                            ? item.size.price
                                            : +item.price) * item.quantity}
                                    </Text>
                                </Row>
                            </Row>
                        ))}
                    </ScrollView>
                    <Stack>
                        <Text raleway_bold py_4>
                            Delivery Instructions
                        </Text>
                        <InputField
                            nogap
                            containerStyle={{ borderRadius: SIZES.radius }}
                            multiline
                            placeholder="Note for the driver"
                            value={deliveryInstructions}
                            onChangeText={setDeliveryInstructions}
                        />
                    </Stack>
                </View>

                <View style={[styles.btn]}>
                    <Row horizontalAlign="space-evenly">
                        <View
                            style={[
                                styles.leftBtn,
                                {
                                    shadowColor: theme.SHADOW_COLOR,
                                    backgroundColor: theme.BACKGROUND_COLOR,
                                    borderColor: theme.SHADOW_COLOR
                                }
                            ]}
                        >
                            <Text bold medium>
                                Total:
                                <Text bold large>
                                    {' '}
                                    ${total.toFixed(2)}
                                </Text>
                            </Text>
                        </View>
                        <Button
                            disabled={loading}
                            isLoading={loading}
                            containerStyle={{
                                paddingVertical: SIZES.padding * 0.8
                            }}
                            title={`Checkout`}
                            onPress={handleCheckout}
                        />
                    </Row>
                </View>
            </Screen>
        </StripeProvider>
    );
};

export default OrderReview;

const styles = StyleSheet.create({
    btn: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: '90%'
    },
    leftBtn: {
        paddingVertical: SIZES.base * 1.5,
        paddingHorizontal: SIZES.padding * 1.5,
        borderRadius: SIZES.radius,
        elevation: 4,
        borderWidth: 0.3,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.5,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 300,
        marginHorizontal: SIZES.base
    }
});
