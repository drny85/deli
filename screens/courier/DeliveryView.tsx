import { Alert, Image, StatusBar, TouchableOpacity, View } from 'react-native';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import Communications from 'react-native-communications';
import { runTransaction } from 'firebase/firestore';

import Text from '../../components/Text';
import { businessCollection, db, ordersCollection } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useLocation } from '../../hooks/useLocation';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import Stack from '../../components/Stack';
import { updateOrder } from '../../redux/consumer/ordersActions';
import Loader from '../../components/Loader';
import * as Location from 'expo-location';
import { Business, Coors } from '../../redux/business/businessSlide';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SIZES } from '../../constants';
import { FontAwesome } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Row from '../../components/Row';
import Header from '../../components/Header';
import Button from '../../components/Button';
import AnimatedLottieView from 'lottie-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourierStackScreens } from '../../navigation/courier/typing';
import { useReadyForDeliveryOrders } from '../../hooks/useReadyForDeliveryOrders';

let a: NodeJS.Timeout;

const ACCEPTED_TIME = 'ACCEPTED_TIME';
const EGDE_PADDING = 100;

type Props = NativeStackScreenProps<CourierStackScreens, 'DeliveryView'>;

const DeliveryView = ({
    navigation,
    route: {
        params: { orderId }
    }
}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const { location } = useLocation();
    const [isReady, setIsReady] = useState(false);
    const [isCloseToDestination, setIsCloseToDestination] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const theme = useAppSelector((state) => state.theme);
    const [order, setOrder] = useState<Order>();
    const { orders, loading } = useReadyForDeliveryOrders();
    const [origin, setOrigin] = useState<Coors>();
    const [distance, setDistance] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [destination, setDestination] = useState<Coors>();
    const mapViewRef = useRef<MapView>(null);
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['10%', '80%'], []);
    const [business, setBusiness] = React.useState<Business>();
    const dispatch = useAppDispatch();

    const makeCall = async (phone: string) => {
        try {
            Communications.phonecall(phone.replace(/-/g, ''), true);
        } catch (error) {
            console.log(error);
        }
    };

    const saveAcceptedTimeStamp = useCallback(async () => {
        try {
            await AsyncStorage.setItem(
                ACCEPTED_TIME,
                JSON.stringify(new Date().toISOString())
            );
        } catch (error) {
            console.log(error);
        }
    }, []);

    const performeBath = async (order: Order) => {
        try {
            await runTransaction(db, async (transaction) => {
                const docRf = doc(ordersCollection, order.id);
                const orderRef = await transaction.get(docRf);
                if (!orderRef.exists()) {
                    throw 'Document does not exist!';
                }
                if (
                    orderRef.data().status === ORDER_STATUS.accepted_by_driver
                ) {
                    Alert.alert('Order was already taken by some other driver');
                    return;
                }

                transaction.update(docRf, {
                    status: ORDER_STATUS.accepted_by_driver,
                    acceptedOn: new Date().toISOString(),
                    courier: {
                        ...user,
                        coors: { lat: origin?.lat!, lng: origin?.lng! }
                    }
                });

                console.log('Transaction successfully committed!');
            });
        } catch (e) {
            console.log('Transaction failed: ', e);
        }
    };

    const checkIfCourierCanAceeptAnotherDelivery = (): boolean => {
        if (
            orders.length > 0 &&
            orders.some(
                (order) => order.status === ORDER_STATUS.accepted_by_driver
            )
        )
            return true;

        return false;
    };

    const handlePressActionButton = async () => {
        try {
            if (order?.status === ORDER_STATUS.marked_ready_for_delivery) {
                if (!user) return;
                //TO DO: CHECK IF COURIER HAS PENDING ORDER BEFORE TAKIONG A NEW ONE
                const canNotTakeMoreOrder =
                    checkIfCourierCanAceeptAnotherDelivery();
                if (canNotTakeMoreOrder) {
                    Alert.alert(
                        'Pending Order',
                        'Please complete your pending order first'
                    );
                    sheetRef.current?.close();
                    navigation.navigate('CourierDeliveries');
                    return;
                }
                await performeBath(order);

                sheetRef.current?.snapToIndex(0);
                mapViewRef.current?.animateToRegion({
                    latitude: origin?.lat!,
                    longitude: origin?.lng!,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2
                });
            }

            if (order?.status === ORDER_STATUS.accepted_by_driver) {
                if (!user) return;
                if (!isCloseToDestination) {
                    Alert.alert(
                        'No There Tey',
                        'Please get more closer to the destination'
                    );
                    return;
                }
                const { payload } = await dispatch(
                    updateOrder({
                        ...order,
                        status: ORDER_STATUS.picked_up_by_driver,
                        pickedUpOn: new Date().toISOString(),
                        courier: {
                            ...user,
                            coors: { lat: origin?.lat!, lng: origin?.lng! }
                        }
                    })
                );
                if (payload) {
                    sheetRef.current?.snapToIndex(0);
                    mapViewRef.current?.animateToRegion({
                        latitude: origin?.lat!,
                        longitude: origin?.lng!,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2
                    });
                }
            }
            if (order?.status === ORDER_STATUS.picked_up_by_driver) {
                if (!user) return;
                if (!isCloseToDestination) {
                    Alert.alert(
                        'No There Tey',
                        'Please get more closer to the destination'
                    );
                    return;
                }
                const { payload } = await dispatch(
                    updateOrder({
                        ...order,
                        status: ORDER_STATUS.delivered,
                        courier: null,
                        deliveredBy: user,
                        deliveredOn: new Date().toISOString()
                    })
                );
                if (payload) {
                    sheetRef.current?.snapToIndex(0);
                    setAccepted(false);
                    navigation.navigate('MyDeliveries');

                    // mapViewRef.current?.animateToRegion({
                    //     latitude: origin?.lat!,
                    //     longitude: origin?.lng!,
                    //     latitudeDelta: 0.2,
                    //     longitudeDelta: 0.2
                    // });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        sheetRef.current?.snapToIndex(0);
    }, []);

    useEffect(() => {
        if (!order || !location) return;
        if (order.status === ORDER_STATUS.marked_ready_for_delivery) {
            setOrigin({
                lat: location.coords.latitude!,
                lng: location.coords.longitude!
            });
            setDestination({
                lat: order.address?.coors.lat!,
                lng: order.address?.coors.lng!
            });

            a = setTimeout(() => {
                mapViewRef.current?.fitToSuppliedMarkers(
                    ['origin', 'business'],
                    {
                        edgePadding: {
                            left: EGDE_PADDING,
                            right: EGDE_PADDING,
                            top: EGDE_PADDING,
                            bottom: EGDE_PADDING * 1.5
                        }
                    }
                );
            }, 1000);

            a = setTimeout(() => {
                mapViewRef.current?.fitToSuppliedMarkers(
                    ['business', 'destination'],
                    {
                        edgePadding: {
                            left: EGDE_PADDING,
                            right: EGDE_PADDING,
                            top: EGDE_PADDING,
                            bottom: EGDE_PADDING * 1.5
                        }
                    }
                );
            }, 4000);
            a = setTimeout(() => {
                mapViewRef.current?.fitToSuppliedMarkers(
                    ['origin', 'business', 'destination'],
                    {
                        edgePadding: {
                            left: EGDE_PADDING,
                            right: EGDE_PADDING,
                            top: EGDE_PADDING,
                            bottom: EGDE_PADDING * 1.5
                        }
                    }
                );
            }, 5000);

            a = setTimeout(() => {
                mapViewRef.current?.fitToSuppliedMarkers(
                    ['origin', 'business'],
                    {
                        edgePadding: {
                            left: EGDE_PADDING,
                            right: EGDE_PADDING,
                            top: EGDE_PADDING,
                            bottom: EGDE_PADDING * 1.5
                        }
                    }
                );
            }, 7000);
        }
        if (order.status === ORDER_STATUS.accepted_by_driver) {
            setDestination({
                lat: business?.coors?.lat!,
                lng: business?.coors?.lng!
            });
            saveAcceptedTimeStamp();

            mapViewRef.current?.animateToRegion({
                latitude: business?.coors?.lat!,
                longitude: business?.coors?.lng!,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02
            });
            a = setTimeout(() => {
                mapViewRef.current?.fitToSuppliedMarkers(
                    ['origin', 'business'],
                    {
                        edgePadding: {
                            left: EGDE_PADDING,
                            right: EGDE_PADDING,
                            top: EGDE_PADDING,
                            bottom: EGDE_PADDING * 1.5
                        }
                    }
                );
            }, 2000);
        }
        if (order.status === ORDER_STATUS.picked_up_by_driver) {
            setDestination({
                lat: order.address?.coors?.lat!,
                lng: order.address?.coors?.lng!
            });
            mapViewRef.current?.animateToRegion({
                latitude: business?.coors?.lat!,
                longitude: business?.coors?.lng!,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02
            });

            mapViewRef.current?.fitToSuppliedMarkers(
                ['business', 'destination'],
                {
                    edgePadding: {
                        left: EGDE_PADDING,
                        right: EGDE_PADDING,
                        top: EGDE_PADDING,
                        bottom: EGDE_PADDING
                    }
                }
            );
        }

        return () => {
            clearTimeout(a);
        };
    }, [order?.status, location]);

    useEffect(() => {
        let sub: Location.LocationSubscription;
        (async () => {
            if (!order) return;
            console.log('HEE');
            if (
                !accepted ||
                order.status === ORDER_STATUS.marked_ready_for_delivery
            )
                return;

            console.log('UPDATING 1');
            sub = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 100
                },
                (result) => {
                    if (result && result.coords.latitude !== origin?.lat) {
                        console.log('UPDATING 2');
                        dispatch(
                            updateOrder({
                                ...order!,
                                courier: {
                                    ...order?.courier!,
                                    coors: {
                                        lat: result.coords.latitude,
                                        lng: result.coords.longitude
                                    }
                                }
                            })
                        );
                    }
                }
            );
        })();

        return () => {
            if (sub) {
                sub.remove();
            }
        };
    }, [location, order, accepted]);

    useEffect(() => {
        if (
            order?.status === ORDER_STATUS.cancelled ||
            order?.status === ORDER_STATUS.in_progress ||
            order?.status === ORDER_STATUS.new
        ) {
            navigation.replace('CourierHome');
        }
        if (
            order?.status === ORDER_STATUS.accepted_by_driver &&
            order.courier &&
            order.courier.id !== user?.id
        ) {
            Alert.alert('Sorry', 'This delivery was already taken');
            navigation.goBack();
        }
    }, [order?.status]);

    useEffect(() => {
        if (!orderId) return;
        const q = doc(ordersCollection, orderId);
        const sub = onSnapshot(q, (snap) => {
            if (!snap.exists()) return;
            setOrder({ id: snap.id, ...snap.data() });
        });

        return sub;
    }, [orderId]);

    useEffect(() => {
        if (!order?.businessId) return;
        const q = doc(businessCollection, order.businessId);
        const sub = onSnapshot(q, (snap) => {
            if (!snap.exists()) return;
            setBusiness({ id: snap.id, ...snap.data() });
        });
        return sub;
    }, [order?.businessId]);

    useEffect(() => {
        if (!order?.courier) return;
        setAccepted(
            order.status === ORDER_STATUS.accepted_by_driver ||
                order.status === ORDER_STATUS.picked_up_by_driver
        );

        setOrigin({
            lat: order.courier.coors?.lat!,
            lng: order.courier.coors?.lng!
        });
    }, [order?.courier, order?.status]);
    if (!location) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
                <AnimatedLottieView
                    autoPlay
                    resizeMode="contain"
                    style={{ flex: 1 }}
                    source={
                        theme.mode === 'dark'
                            ? require('../../assets/animations/location_light.json')
                            : require('../../assets/animations/location_light.json')
                    }
                />
            </View>
        );
    }

    if (!origin || !destination || loading) return <Loader />;
    return (
        <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
            <StatusBar barStyle={'dark-content'} />
            <View
                style={{
                    position: 'absolute',
                    top: SIZES.statusBarHeight,
                    width: '100%',
                    zIndex: 200,
                    alignSelf: 'center'
                }}
            >
                <Header
                    titleColor="#212121"
                    iconColor="#212121"
                    title="Delivery View"
                    onPressBack={() => {
                        if (
                            order?.status ===
                            ORDER_STATUS.marked_ready_for_delivery
                        ) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('CourierDeliveries');
                        }
                    }}
                />
            </View>
            <MapView
                showsUserLocation
                followsUserLocation
                mapType="mutedStandard"
                showsPointsOfInterest={false}
                showsBuildings={false}
                zoomEnabled
                zoomControlEnabled
                mapPadding={{ left: 50, top: 50, right: 50, bottom: 100 }}
                zoomTapEnabled
                ref={mapViewRef}
                style={{ height: '91%', width: '100%' }}
                region={{
                    latitude: origin?.lat!,
                    longitude: origin?.lng!,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.04
                }}
            >
                {business?.coors && (
                    <Marker
                        title={business?.name}
                        identifier="business"
                        description={business?.address?.split(', ')[0]}
                        coordinate={{
                            latitude: business?.coors?.lat!,
                            longitude: business?.coors?.lng!
                        }}
                    >
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                tintColor: '#212121'
                            }}
                            resizeMode="contain"
                            source={require('../../restaurant.png')}
                        />
                    </Marker>
                )}
                {origin && (
                    <Marker
                        title="Me"
                        identifier="origin"
                        coordinate={{
                            latitude: origin.lat!,
                            longitude: origin?.lng!
                        }}
                    >
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                tintColor: '#212121'
                            }}
                            resizeMode="contain"
                            source={require('../../assets/images/delivery.png')}
                        />
                    </Marker>
                )}

                {order?.address?.coors && (
                    <Marker
                        title={order?.contactPerson.name}
                        identifier="destination"
                        description={order?.address?.street.split(', ')[0]}
                        coordinate={{
                            latitude: order?.address?.coors.lat!,
                            longitude: order?.address?.coors?.lng!
                        }}
                    >
                        <FontAwesome
                            name="user"
                            color={theme.TEXT_COLOR}
                            size={26}
                        />
                    </Marker>
                )}

                <MapViewDirections
                    apikey={process.env.GOOGLE_API!}
                    strokeColor={'#212121'}
                    strokeWidth={5}
                    mode={
                        user?.transportation ? user.transportation : 'BICYCLING'
                    }
                    optimizeWaypoints={true}
                    waypoints={
                        order?.status === ORDER_STATUS.marked_ready_for_delivery
                            ? [
                                  {
                                      latitude: business?.coors?.lat!,
                                      longitude: business?.coors?.lng!
                                  }
                              ]
                            : []
                    }
                    origin={{ latitude: origin?.lat!, longitude: origin?.lng! }}
                    destination={{
                        latitude: destination?.lat!,
                        longitude: destination?.lng!
                    }}
                    onError={(err) => {
                        console.log(err);
                    }}
                    onReady={(result) => {
                        const { distance, duration } = result;
                        console.log('DIS', distance);
                        setIsCloseToDestination(distance < 0.2);
                        setDuration(duration);
                        setDistance(distance);
                    }}
                />
            </MapView>
            <BottomSheet
                index={0}
                ref={sheetRef}
                handleIndicatorStyle={{ backgroundColor: theme.TEXT_COLOR }}
                backgroundStyle={{
                    backgroundColor: theme.SECONDARY_BUTTON_COLOR
                }}
                snapPoints={snapPoints}
            >
                <BottomSheetScrollView>
                    <Row
                        containerStyle={{
                            alignSelf: 'center',
                            width: '60%',
                            maxWidth: 400
                        }}
                        horizontalAlign="space-around"
                    >
                        <Text bold>{duration.toFixed(0)} mins</Text>
                        <FontAwesome
                            name={
                                user?.transportation === 'BICYCLING'
                                    ? 'bicycle'
                                    : 'car'
                            }
                            size={26}
                            color={theme.TEXT_COLOR}
                        />
                        <Text bold>
                            {(distance * 0.621371).toFixed(1)} miles
                        </Text>
                    </Row>

                    <View style={{ marginTop: 30 }}>
                        <Stack>
                            <Text bold py_4>
                                Delivery Contact
                            </Text>
                            <Row>
                                <Text>{order?.contactPerson.name}</Text>
                                <Text px_4>
                                    {order?.contactPerson.lastName}
                                </Text>
                            </Row>
                            <Row>
                                <Text bold>{order?.contactPerson.phone}</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        makeCall(order?.contactPerson.phone!)
                                    }
                                    style={{
                                        marginLeft: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: theme.TEXT_COLOR,
                                        borderWidth: 0.5,
                                        padding: 6,
                                        borderRadius: 10
                                    }}
                                >
                                    <FontAwesome
                                        name="phone"
                                        size={24}
                                        color={theme.TEXT_COLOR}
                                    />
                                    <Text bold px_4>
                                        Call
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                        </Stack>
                        <Stack>
                            <Text bold py_4>
                                Pick Up At
                            </Text>
                            <Text bold>{business?.name}</Text>
                            <Text>{business?.address}</Text>
                            <Text bold py_4>
                                Drof Off At
                            </Text>

                            <Text>{order?.address?.street}</Text>
                            {order?.address?.apt && (
                                <Text py_4 bold>
                                    APT: {order.address.apt}
                                </Text>
                            )}
                        </Stack>
                        <Stack>
                            {order?.deliveryInstructions && (
                                <>
                                    <Text bold>Delivery Instructions</Text>
                                    <Text>{order.deliveryInstructions}</Text>
                                </>
                            )}
                        </Stack>
                    </View>
                </BottomSheetScrollView>
                <View
                    style={{
                        width: '80%',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 30
                    }}
                >
                    <Button
                        title={
                            order?.status === ORDER_STATUS.accepted_by_driver
                                ? 'Pick Up Order'
                                : order?.status ===
                                  ORDER_STATUS.marked_ready_for_delivery
                                ? 'Accept Order'
                                : order?.status ===
                                  ORDER_STATUS.picked_up_by_driver
                                ? 'Deliver Order'
                                : 'Take Action'
                        }
                        onPress={handlePressActionButton}
                    />
                </View>
            </BottomSheet>
        </View>
    );
};

export default DeliveryView;
