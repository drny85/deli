import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';

import Row from '../../../components/Row';
import Screen from '../../../components/Screen';
import Stack from '../../../components/Stack';
import Text from '../../../components/Text';
import { SIZES } from '../../../constants';
import { setPreviosRoute } from '../../../redux/consumer/settingSlide';
import { useAppSelector } from '../../../redux/store';

import Loader from '../../../components/Loader';
import PaymentWrapper from '../../../components/PaymentWrapper';
import { Order, setOrder } from '../../../redux/consumer/ordersSlide';
import {
    getBusiness,
    getCurrentBusiness
} from '../../../redux/business/businessActions';
import { stripeFee } from '../../../utils/stripeFee';
import Divider from '../../../components/Divider';

type Props = {};

const OrderReview = ({}: Props) => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [startPaymentt, setStartPayment] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const { order } = useAppSelector((state) => state.orders);
    const { previousRoute } = useAppSelector((state) => state.settings);
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useDispatch();
    const { items, quantity, total } = useAppSelector((state) => state.cart);
    const [deliveryInstructions, setDeliveryInstructions] = React.useState('');
    const { business } = useAppSelector((state) => state.business);

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
                if (
                    business?.minimumDelivery &&
                    business?.minimumDelivery > total
                ) {
                    Alert.alert(
                        'Minimum Delivery Required',
                        ` Please add $${(
                            business.minimumDelivery - total
                        ).toFixed(2)} to continue.   `
                    );
                    return;
                }
                //payment sucess to true

                const newOrder: Order = {
                    ...order,
                    userId: user.id!,
                    orderDate: new Date().toISOString(),
                    items: items,
                    total: +total.toFixed(2),
                    paymentIntent: paymentIntent!,
                    status: 'new',
                    orderType: 'delivery',
                    deliveryInstructions: deliveryInstructions,
                    address: {
                        street: '123 main st',
                        apt: '1D',
                        coors: { lat: 3, lng: 4 }
                    }
                };
                dispatch(setOrder({ ...newOrder }));

                setStartPayment(true);
            }
        } catch (error) {
            console.log('error D', error);
        }
    };

    useEffect(() => {
        if (items.length === 0) return;
        //@ts-ignore
        dispatch(getCurrentBusiness(items[0].businessId));
        //remove previous rouite if any;
        const state = navigation.getState();
        console.log('state', state);
        if (previousRoute) {
            dispatch(setPreviosRoute(null));
        }
    }, [items.length, previousRoute]);

    if (!business) return <Loader />;
    return (
        <PaymentWrapper
            business={business}
            paymentSuccess={startPaymentt}
            setPaymentSuccess={setStartPayment}
            loading={loading}
            setLoading={setLoading}
            setPaymentIntentId={setPaymentIntent}
        >
            <Screen>
                <Header
                    onPressBack={() => navigation.goBack()}
                    title="Order Review"
                />

                <View>
                    <Stack px={4}>
                        <Text raleway_bold>{business?.name}</Text>
                        <Text raleway_italic>
                            {business?.address?.substring(
                                0,
                                business.address.length - 5
                            )}
                        </Text>
                    </Stack>
                    <Divider />
                    <ScrollView
                        contentContainerStyle={{
                            width: '100%',
                            paddingHorizontal: SIZES.base,
                            maxHeight: SIZES.height * 0.5
                        }}
                    >
                        <Text raleway_bold medium>
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
                                        {(
                                            (item.size
                                                ? item.size.price
                                                : +item.price) * item.quantity
                                        ).toFixed(2)}
                                    </Text>
                                </Row>
                            </Row>
                        ))}
                        <View
                            style={{
                                alignSelf: 'flex-end',
                                paddingTop: SIZES.base
                            }}
                        >
                            <Row>
                                <Text capitalize px_4>
                                    service fee
                                </Text>
                                <Text>{stripeFee(total)}</Text>
                            </Row>
                            <Text right medium>
                                Total ${(total + stripeFee(total)).toFixed(2)}
                            </Text>
                        </View>
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
                                    ${(total + stripeFee(total)).toFixed(2)}
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
        </PaymentWrapper>
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
