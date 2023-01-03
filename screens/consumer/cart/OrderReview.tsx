import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
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
import ProductListItem from '../../../components/ProductListItem';
import { useLocation } from '../../../hooks/useLocation';
import { AnimatePresence, MotiView } from 'moti';
import GoogleAutoComplete from '../../../components/GoogleAutoCompleteField';
import { Business } from '../../../redux/business/businessSlide';
import {
    GooglePlaceDetail,
    GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete';

type Props = {};

const OrderReview = ({}: Props) => {
    const navigation = useNavigation();
    const googleRef = useRef<GooglePlacesAutocompleteRef>(null);
    const { address, latitude, longitude } = useLocation();
    const [deliveryAddress, setDeliveryAddress] = useState<Order['address']>();
    const [changeAddress, setChangeAddress] = useState<boolean>(false);
    const [showAddress, setShowAddress] = useState<boolean>(true);
    const [apt, setApt] = useState<string>('');
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
            if (
                business?.minimumDelivery &&
                business?.minimumDelivery > total
            ) {
                Alert.alert(
                    'Minimum Delivery Required',
                    ` Please add $${(business.minimumDelivery - total).toFixed(
                        2
                    )} to continue.   `
                );
                return;
            }
            if (!user) {
                dispatch(setPreviosRoute('OrderReview'));

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
                if (business?.id || user?.id) return;
                const newOrder: Order = {
                    ...order,
                    userId: user.id!,
                    businessId: business?.id!,
                    orderDate: new Date().toISOString(),
                    items: items,
                    total: +total.toFixed(2),
                    paymentIntent: paymentIntent!,
                    status: 'new',
                    orderType: 'delivery',
                    deliveryInstructions: deliveryInstructions,
                    address: deliveryAddress || null
                };

                if (!newOrder.address) return;
                dispatch(setOrder({ ...newOrder }));

                setStartPayment(true);
            }
        } catch (error) {
            console.log('error D', error);
        }
    };

    useEffect(() => {
        if (!address || !longitude || !latitude || changeAddress) return;
        const { street, streetNumber, city, subregion, postalCode } = address;
        setDeliveryAddress({
            ...deliveryAddress!,
            street: `${streetNumber} ${street} , ${city}, ${subregion}, ${postalCode}`,
            coors: { lat: latitude, lng: longitude }
        });
    }, [address, latitude, longitude, changeAddress]);

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
                    onPressBack={() =>
                        navigation.navigate('ConsumerCart', { screen: 'Cart' })
                    }
                    title="Order Review"
                />

                <View>
                    <Stack px={4}>
                        <Text raleway_bold> From: {business?.name}</Text>
                        <Text px_6 raleway>
                            {business?.address?.substring(
                                0,
                                business.address.length - 5
                            )}
                        </Text>
                    </Stack>
                    <Stack px={4}>
                        <Text raleway_bold> To: You</Text>
                        {deliveryAddress && (
                            <Text px_6>{deliveryAddress.street}</Text>
                        )}
                        {!deliveryAddress && (
                            <Text animation={'pulse'} px_6 raleway>
                                getting current location
                            </Text>
                        )}

                        <AnimatePresence>
                            {showAddress && (
                                <MotiView
                                    style={{
                                        alignSelf: 'center',
                                        paddingVertical: SIZES.base
                                    }}
                                    from={{ opacity: 0, translateY: -20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                >
                                    <Button
                                        outlined
                                        title={'Change Address'}
                                        onPress={() => {
                                            setChangeAddress((prev) => {
                                                if (prev) {
                                                    googleRef.current?.clear();
                                                    return false;
                                                }
                                                setShowAddress(false);
                                                return !prev;
                                            });
                                        }}
                                    />
                                </MotiView>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {changeAddress && !showAddress && (
                                <MotiView
                                    style={{ width: '100%' }}
                                    from={{ opacity: 0, translateY: -20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: -20 }}
                                    transition={{ type: 'timing' }}
                                >
                                    <GoogleAutoComplete
                                        ref={googleRef}
                                        placeholder="Delivery Address"
                                        label="Delivery Address"
                                        onPress={(
                                            _: any,
                                            details: GooglePlaceDetail
                                        ) => {
                                            setDeliveryAddress({
                                                ...deliveryAddress!,
                                                street: details.formatted_address,
                                                coors: {
                                                    ...details.geometry.location
                                                }
                                            });
                                        }}
                                    />
                                    <View style={{ alignSelf: 'center' }}>
                                        <Button
                                            outlined
                                            title="Update Address"
                                            onPress={() => {
                                                if (
                                                    !googleRef.current?.getAddressText()
                                                        .length
                                                )
                                                    return;
                                                setShowAddress(true);
                                            }}
                                        />
                                    </View>
                                </MotiView>
                            )}
                        </AnimatePresence>
                    </Stack>
                    <Divider small />
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
                            <ProductListItem
                                key={index.toString()}
                                item={item}
                                index={index}
                            />
                        ))}
                        <View
                            style={{
                                alignSelf: 'flex-end',
                                paddingTop: SIZES.base
                            }}
                        >
                            <Text right>sub-total ${total.toFixed(2)}</Text>
                            <Row>
                                <Text px_4>service fee</Text>
                                <Text>${stripeFee(total)}</Text>
                            </Row>
                            <Text right bold medium>
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
                            <Text bold large>
                                ${(total + stripeFee(total)).toFixed(2)}
                            </Text>
                        </View>
                        <Button
                            disabled={loading}
                            isLoading={loading}
                            outlined
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
