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
import { PREVIOUS_ROUTE, SIZES } from '../../../constants';
import { useAppSelector } from '../../../redux/store';

import Loader from '../../../components/Loader';

import {
    Order,
    OrderAddress,
    ORDER_STATUS,
    ORDER_TYPE,
    saveDeliveryAddress,
    setOrder
} from '../../../redux/consumer/ordersSlide';
import { getCurrentBusiness } from '../../../redux/business/businessActions';
import { stripeFee } from '../../../utils/stripeFee';
import Divider from '../../../components/Divider';
import ProductListItem from '../../../components/ProductListItem';
import { useLocation } from '../../../hooks/useLocation';
import { AnimatePresence, MotiView } from 'moti';
import GoogleAutoComplete from '../../../components/GoogleAutoCompleteField';

import {
    GooglePlaceDetail,
    GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderReview = () => {
    const navigation = useNavigation();
    const googleRef = useRef<GooglePlacesAutocompleteRef>(null);
    const { address, latitude, longitude } = useLocation();
    const [deliveryAddress, setDeliveryAddress] = useState<OrderAddress>();
    const { user } = useAppSelector((state) => state.auth);
    const { order, deliveryAdd, orderType } = useAppSelector(
        (state) => state.orders
    );

    const theme = useAppSelector((state) => state.theme);
    const dispatch = useDispatch();
    const { items, quantity, total } = useAppSelector((state) => state.cart);
    const [deliveryInstructions, setDeliveryInstructions] = React.useState('');
    const { business } = useAppSelector((state) => state.business);

    const continueToCheckout = async () => {
        try {
            const newOrder: Order = {
                ...order,
                userId: user?.id!,
                businessId: business?.id!,
                orderDate: new Date().toISOString(),
                items: items,
                deliveryPaid: false,
                transferId: null,
                contactPerson: {
                    name: user?.name!,
                    lastName: user?.lastName!,
                    phone: user?.phone!
                },
                total: +total.toFixed(2),
                paymentIntent: '',
                status: ORDER_STATUS.new,
                orderType: orderType,
                deliveryInstructions: deliveryInstructions,
                address: deliveryAddress || null,
                deliveredBy: null
            };

            if (!newOrder.address) {
                Alert.alert(
                    'Delivery address required',
                    'please provide delivery address'
                );
                return;
            }
            dispatch(setOrder({ ...newOrder }));

            navigation.navigate('ConsumerCart', {
                screen: 'Checkout'
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (deliveryAdd) {
            setDeliveryAddress(deliveryAdd);
            googleRef.current?.setAddressText(deliveryAdd.street);
        } else {
            if (!address || !longitude || !latitude) return;
            const { street, streetNumber, city, subregion, postalCode } =
                address;
            if (!googleRef.current?.isFocused()) {
                setDeliveryAddress({
                    ...deliveryAddress!,
                    street: `${streetNumber} ${street} , ${city}, ${subregion}, ${postalCode}`,
                    coors: { lat: latitude, lng: longitude }
                });
            }

            //dispatch()
            dispatch(
                saveDeliveryAddress({
                    street: `${streetNumber} ${street} , ${city}, ${subregion}, ${postalCode}`,
                    coors: { lat: latitude, lng: longitude },
                    addedOn: new Date().toISOString()
                })
            );
        }
    }, [address, deliveryAdd]);

    const removePreviousRoute = async () => {
        try {
            const data = await AsyncStorage.getItem(PREVIOUS_ROUTE);
            if (data === null) return;
            await AsyncStorage.removeItem(PREVIOUS_ROUTE);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (items.length === 0) return;
        //@ts-ignore
        dispatch(getCurrentBusiness(items[0].businessId));

        removePreviousRoute();
    }, [items.length]);

    if (!business) return <Loader />;
    return (
        <Screen>
            <Header
                onPressBack={() =>
                    navigation.navigate('ConsumerCart', {
                        screen: 'Cart'
                    })
                }
                title="Order Review"
            />

            <View>
                {orderType === ORDER_TYPE.delivery && (
                    <>
                        <Stack px={4}>
                            <Text raleway_bold> From: {business?.name}</Text>
                            <Text px_4 raleway>
                                {business?.address?.substring(
                                    0,
                                    business.address.length - 5
                                )}
                            </Text>
                        </Stack>
                        <Stack px={4} py={1}>
                            <Text raleway_bold py_4>
                                {' '}
                                To: You
                            </Text>

                            <MotiView
                                style={{ width: '100%' }}
                                from={{ opacity: 0, translateY: -20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                exit={{ opacity: 0, translateY: -20 }}
                                transition={{ type: 'timing' }}
                            >
                                <GoogleAutoComplete
                                    inputRadius={SIZES.radius}
                                    ref={googleRef}
                                    placeholder="Please type your delivery address"
                                    onPress={(
                                        _: any,
                                        details: GooglePlaceDetail
                                    ) => {
                                        setDeliveryAddress({
                                            ...deliveryAddress!,
                                            street: details.formatted_address,
                                            coors: {
                                                ...details.geometry.location
                                            },
                                            addedOn: new Date().toISOString()
                                        });
                                        dispatch(
                                            saveDeliveryAddress({
                                                street: details.formatted_address,
                                                coors: details.geometry
                                                    .location,
                                                addedOn:
                                                    new Date().toISOString()
                                            })
                                        );
                                    }}
                                />
                            </MotiView>
                            <AnimatePresence>
                                {deliveryAddress?.street && (
                                    <MotiView
                                        from={{ opacity: 0, translateY: -20 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        style={{ width: '100%' }}
                                    >
                                        <Row containerStyle={{ width: '100%' }}>
                                            <View style={{ flexGrow: 1 }}>
                                                <Text px_4 bold>
                                                    Apt #, Suite, Floor, etc
                                                </Text>
                                            </View>

                                            <InputField
                                                nogap
                                                mainStyle={{
                                                    width: '40%'
                                                }}
                                                containerStyle={{
                                                    borderRadius: SIZES.radius
                                                }}
                                                contentStyle={{
                                                    textAlign: 'center'
                                                }}
                                                value={deliveryAddress?.apt!}
                                                onChangeText={(text) => {
                                                    setDeliveryAddress({
                                                        ...deliveryAddress!,
                                                        apt: text.toUpperCase()
                                                    });
                                                    dispatch(
                                                        saveDeliveryAddress({
                                                            ...deliveryAdd!,
                                                            apt: text.toUpperCase()
                                                        })
                                                    );
                                                }}
                                                placeholder="Apt #, Suite, Floor, etc"
                                            />
                                        </Row>

                                        <View>
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
                                                    setDeliveryInstructions(
                                                        text
                                                    );
                                                    dispatch(
                                                        setOrder({
                                                            ...order!,
                                                            deliveryInstructions:
                                                                text
                                                        })
                                                    );
                                                }}
                                            />
                                            {deliveryInstructions.length >
                                                0 && (
                                                <Text px_4 small>
                                                    {
                                                        deliveryInstructions.length
                                                    }{' '}
                                                    / 100
                                                </Text>
                                            )}
                                        </View>
                                    </MotiView>
                                )}
                            </AnimatePresence>
                        </Stack>
                    </>
                )}
                {orderType === ORDER_TYPE.pickup && (
                    <Stack>
                        <Text bold>Picking Up At</Text>
                        <Text py_4>{business.address?.slice(0, -10)}</Text>
                        <Text>{business.phone}</Text>
                    </Stack>
                )}

                <Divider small />
                <ScrollView
                    contentContainerStyle={{
                        width: '100%',
                        paddingHorizontal: SIZES.base,
                        maxHeight: SIZES.height * 0.5
                    }}
                >
                    <Text raleway_bold medium center>
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
                    </View>
                </ScrollView>
            </View>

            <View
                style={[
                    styles.btn,
                    {
                        bottom: 30
                    }
                ]}
            >
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
                            Total ${(total + stripeFee(total)).toFixed(2)}
                        </Text>
                    </View>
                    <Button
                        outlined
                        containerStyle={{
                            paddingVertical: SIZES.padding * 0.8
                        }}
                        title={`Checkout`}
                        onPress={continueToCheckout}
                    />
                </Row>
            </View>
        </Screen>
    );
};

export default OrderReview;

const styles = StyleSheet.create({
    btn: {
        position: 'absolute',
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
