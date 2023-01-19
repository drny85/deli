import { View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import Text from '../../../components/Text';

import { useNavigation } from '@react-navigation/native';
import { useOrder } from '../../../hooks/useOrder';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerOrdersStackScreens } from '../../../navigation/consumer/typing';
import Loader from '../../../components/Loader';
import { useAppSelector } from '../../../redux/store';
import { SIZES } from '../../../constants';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useDispatch } from 'react-redux';
import { getCurrentBusiness } from '../../../redux/business/businessActions';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Coors } from '../../../redux/business/businessSlide';
import { FontAwesome } from '@expo/vector-icons';
import AnimatedLottieView from 'lottie-react-native';
import { ORDER_STATUS } from '../../../redux/consumer/ordersSlide';
import { Image } from 'moti';
import ProductListItem from '../../../components/ProductListItem';
import Stack from '../../../components/Stack';
import Divider from '../../../components/Divider';
import moment from 'moment';
import Row from '../../../components/Row';
import { stripeFee } from '../../../utils/stripeFee';
import Button from '../../../components/Button';
import Header from '../../../components/Header';

type Props = NativeStackScreenProps<ConsumerOrdersStackScreens, 'OrderDetails'>;

const EGDE = 200;

const OrderDetails = ({
    route: {
        params: { orderId }
    }
}: Props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { business } = useAppSelector((state) => state.business);
    const [distance, setDistance] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [origin, setOrigin] = useState<Coors>();
    const [destination, setDestination] = useState<Coors>();
    const theme = useAppSelector((state) => state.theme);
    const { loading, order } = useOrder(orderId);

    const snapPoints = useMemo(() => ['13%', '25%', '50%', '90%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        if (!order?.courier?.coors) return;
        setOrigin({
            lat: order.courier.coors?.lat!,
            lng: order.courier.coors?.lng!
        });
    }, [order?.courier?.coors]);

    useEffect(() => {
        if (business?.coors) {
            setOrigin(business.coors);
        }
    }, [business?.coors]);

    useEffect(() => {
        mapRef.current?.fitToCoordinates(
            [
                {
                    latitude: business?.coors?.lat!,
                    longitude: business?.coors?.lng!
                },
                {
                    latitude: order?.address?.coors.lat!,
                    longitude: order?.address?.coors.lng!
                }
            ],
            {
                animated: true,
                edgePadding: {
                    right: SIZES.width / EGDE,
                    bottom: SIZES.height / EGDE,
                    left: SIZES.width / EGDE,
                    top: SIZES.height / EGDE
                }
            }
        );
    }, [business?.coors, order?.address?.coors]);

    useEffect(() => {
        if (order?.status === ORDER_STATUS.picked_up_by_driver) {
            bottomSheetRef.current?.snapToIndex(1);
        }

        if (
            order?.status === ORDER_STATUS.marked_ready_for_delivery ||
            order?.status === ORDER_STATUS.accepted_by_driver
        ) {
            bottomSheetRef.current?.snapToIndex(0);
        }
    }, [order?.status]);

    useEffect(() => {
        if (!order) return;
        setDestination(order.address?.coors);

        // @ts-ignore
        dispatch(getCurrentBusiness(order.businessId!));
    }, [order?.businessId]);

    if (loading || !order || !business) return <Loader />;

    const renderOrderMarkedForDelivery = (): JSX.Element => {
        return (
            <View
                style={{
                    height:
                        order.status === ORDER_STATUS.accepted_by_driver ||
                        order.status === ORDER_STATUS.picked_up_by_driver
                            ? SIZES.height * 0.8
                            : 0.9
                }}
            >
                <MapView
                    ref={mapRef}
                    initialRegion={{
                        latitude: origin?.lat!,
                        longitude: origin?.lng!,
                        latitudeDelta: 0.7665,
                        longitudeDelta: 0.6076
                    }}
                    mapPadding={{ bottom: 50, left: 50, top: 50, right: 50 }}
                    style={{ flex: 1, borderRadius: SIZES.base }}
                    mapType="mutedStandard"
                >
                    <Marker
                        identifier="origin"
                        coordinate={{
                            latitude: origin?.lat!,
                            longitude: origin?.lng!
                        }}
                        title={business.name}
                        description={business?.address?.split(', ')[0]}
                    >
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                tintColor: '#212121'
                            }}
                            resizeMode="contain"
                            source={require('../../../restaurant.png')}
                        />
                    </Marker>
                    <Marker
                        coordinate={{
                            latitude: destination?.lat!,
                            longitude: destination?.lng!
                        }}
                        identifier="destination"
                        title="Me"
                        description={order.address?.street.split(', ')[0]}
                    >
                        <Image
                            source={require('../../../assets/images/user.png')}
                            style={{
                                height: 40,
                                width: 40,
                                tintColor: '#212121'
                            }}
                            resizeMode="contain"
                        />
                    </Marker>
                    <MapViewDirections
                        mode={
                            order.courier && order.courier.transportation
                                ? order.courier.transportation
                                : 'BICYCLING'
                        }
                        apikey={process.env.GOOGLE_API!}
                        onError={(er) => console.log(er)}
                        optimizeWaypoints={true}
                        strokeWidth={0.1}
                        onReady={(result) => {
                            const { duration, distance } = result;

                            setDuration(duration);
                            setDistance(distance);
                            mapRef.current?.fitToCoordinates(
                                result.coordinates,
                                {
                                    edgePadding: {
                                        right: EGDE * 1.5,
                                        bottom: EGDE * 2,
                                        left: EGDE * 1.5,
                                        top: EGDE * 2
                                    }
                                }
                            );
                        }}
                        origin={{
                            latitude: origin?.lat!,
                            longitude: origin?.lng!
                        }}
                        destination={{
                            latitude: destination?.lat!,
                            longitude: destination?.lng!
                        }}
                    ></MapViewDirections>
                </MapView>
            </View>
        );
    };

    const renderAcceptedByDriver = (): JSX.Element => {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <>
                    <AnimatedLottieView
                        style={{ flex: 1 }}
                        resizeMode="contain"
                        autoPlay={true}
                        source={
                            theme.mode === 'dark'
                                ? require('../../../assets/animations/delivering_dark.json')
                                : require('../../../assets/animations/delivering_light.json')
                        }
                    />

                    <View
                        style={{
                            paddingVertical: SIZES.padding * 3
                        }}
                    >
                        <View style={{ paddingVertical: SIZES.padding * 2 }}>
                            <Text
                                py_8
                                large
                                lobster
                                center
                                animation={'fadeInDown'}
                            >
                                {order.courier?.name}, is on his way to pick up
                                your order.
                            </Text>
                        </View>
                    </View>
                </>
            </View>
        );
    };
    const renderSearchingDriver = (): JSX.Element => {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <View style={{ flex: 1 }}>
                    <AnimatedLottieView
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        resizeMode="contain"
                        autoPlay={true}
                        source={
                            theme.mode === 'dark'
                                ? require('../../../assets/animations/searching_dark.json')
                                : require('../../../assets/animations/searching_light.json')
                        }
                    />

                    <View
                        style={{
                            paddingVertical: SIZES.padding * 3
                        }}
                    >
                        <View
                            style={{
                                paddingVertical: SIZES.padding * 2,
                                paddingHorizontal: 6
                            }}
                        >
                            <Text
                                medium
                                lobster
                                py_8
                                center
                                animation={'fadeInDown'}
                            >
                                We are looking for the best driver to deliver
                                your order.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderDeliveredOrder = (): JSX.Element => {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Stack center>
                    <Text lobster medium animation={'fadeInDown'}>
                        Thank you for doing business with us
                    </Text>
                    <Text
                        lobster
                        medium
                        py_8
                        animation={'fadeInUp'}
                        delay={600}
                    >
                        Have a wonderful day {user?.name}
                    </Text>
                    <Text py_8 medium animation={'fadeInLeft'} delay={800}>
                        Your order was delivery on{' '}
                        {moment(order.deliveredOn).format('lll')}
                    </Text>
                </Stack>
                <Stack center>
                    <Text bold> It was delivered by</Text>
                    <Text capitalize py_6 lobster medium>
                        {order.deliveredBy?.name}
                    </Text>
                </Stack>
            </View>
        );
    };

    const renderNewOrder = (): JSX.Element => {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <>
                    <AnimatedLottieView
                        style={{ flex: 1 }}
                        resizeMode="contain"
                        autoPlay={true}
                        source={
                            theme.mode === 'dark'
                                ? require('../../../assets/animations/preparing-dark.json')
                                : require('../../../assets/animations/preparing.json')
                        }
                    />

                    <View
                        style={{
                            paddingVertical: SIZES.padding * 3
                        }}
                    >
                        <View style={{ paddingVertical: SIZES.padding }}>
                            <Text
                                large
                                lobster
                                py_8
                                center
                                animation={'fadeInDown'}
                            >
                                {user?.name}, Thank you for your order
                            </Text>
                        </View>
                    </View>
                </>
            </View>
        );
    };
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.BACKGROUND_COLOR
            }}
        >
            <View
                style={{
                    zIndex: 200,
                    paddingHorizontal: 10,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: SIZES.statusBarHeight
                }}
            >
                <Header
                    onPressBack={() => {
                        navigation.navigate('ConsumerOrders', {
                            screen: 'Orders'
                        });
                    }}
                    title="Order Details"
                />
            </View>
            {order.status === ORDER_STATUS.new && renderNewOrder()}
            {order.status === ORDER_STATUS.delivered && renderDeliveredOrder()}
            {order.status === ORDER_STATUS.in_progress && renderNewOrder()}
            {order.status === ORDER_STATUS.marked_ready_for_delivery &&
                renderSearchingDriver()}
            {order.status === ORDER_STATUS.accepted_by_driver &&
                renderAcceptedByDriver()}
            {order.status === ORDER_STATUS.picked_up_by_driver &&
                renderOrderMarkedForDelivery()}
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                handleIndicatorStyle={{ backgroundColor: theme.TEXT_COLOR }}
                backgroundStyle={{
                    backgroundColor: theme.SECONDARY_BUTTON_COLOR
                }}
            >
                {order.status === ORDER_STATUS.picked_up_by_driver && (
                    <Stack center>
                        <Row
                            containerStyle={{
                                alignSelf: 'center',
                                width: '100%',
                                maxWidth: 200
                            }}
                            horizontalAlign="space-around"
                        >
                            <Text bold>{duration.toFixed(0)} mins</Text>
                            <FontAwesome
                                name={
                                    order.courier &&
                                    order.courier.transportation === 'BICYCLING'
                                        ? 'bicycle'
                                        : 'car'
                                }
                                size={26}
                                color={'#212121'}
                            />
                            <Text bold>
                                {(distance * 0.621371).toFixed(1)} miles
                            </Text>
                        </Row>
                        <Stack center>
                            <Image
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30
                                }}
                                resizeMode="contain"
                                source={
                                    order.courier && order.courier.image
                                        ? { uri: order.courier.image }
                                        : require('../../../assets/images/user.png')
                                }
                            />
                            <Text py_4 capitalize lobster medium center>
                                {order.courier?.name} just picked up your order
                            </Text>
                        </Stack>
                    </Stack>
                )}
                <BottomSheetScrollView
                    contentContainerStyle={{
                        width: '100%'
                    }}
                >
                    {order.status === ORDER_STATUS.delivered && (
                        <Stack center py={2}>
                            <Button
                                title="Delivered"
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                        </Stack>
                    )}
                    <Text center lobster medium py_4>
                        {order.status === ORDER_STATUS.new &&
                            `${business.name} just got your order`}

                        {order.status === ORDER_STATUS.in_progress &&
                            `${business.name} started preparing your order`}
                        {order.status ===
                            ORDER_STATUS.marked_ready_for_delivery &&
                            `Your order is ready for delivery`}

                        {order.status === ORDER_STATUS.accepted_by_driver &&
                            `${
                                order.courier && order.courier.name
                            } has accepted your order`}
                    </Text>

                    <Stack containerStyle={{ marginTop: 30 }}>
                        <Text bold>From</Text>
                        <Text>{business.address?.split(', ')[0]}</Text>
                        <View style={{ height: 10 }} />
                        <Text bold>To</Text>
                        <Text>{order.address?.street?.split(', ')[0]}</Text>
                        <Text py_4>
                            Order Date: {moment(order.orderDate).format('lll')}
                        </Text>
                    </Stack>
                    <Divider
                        thickness="medium"
                        bgColor={theme.TEXT_COLOR}
                        small
                    />
                    <View style={{ padding: SIZES.padding }}>
                        <Text center bold>
                            Items
                        </Text>
                        {order.items.map((item, index) => (
                            <ProductListItem
                                key={index.toString()}
                                item={item}
                                index={index}
                            />
                        ))}
                        <Stack>
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text capitalize>Sub Total</Text>
                                <Text capitalize>
                                    ${order.total.toFixed(2)}
                                </Text>
                            </Row>
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text py_4 capitalize>
                                    Service Fee
                                </Text>
                                <Text capitalize>
                                    ${stripeFee(order.total).toFixed(2)}
                                </Text>
                            </Row>
                            <Divider small />
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text py_4 bold large capitalize>
                                    Total
                                </Text>
                                <Text bold large capitalize>
                                    $
                                    {(
                                        order.total + stripeFee(order.total)
                                    ).toFixed(2)}
                                </Text>
                            </Row>
                        </Stack>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
};

export default OrderDetails;
