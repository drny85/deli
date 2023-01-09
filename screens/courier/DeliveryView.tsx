import {
    Alert,
    FlatList,
    Image,
    ListRenderItem,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View
} from 'react-native';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { businessCollection, ordersCollection } from '../../firebase';
import { doc, onSnapshot, query, where } from 'firebase/firestore';
import { useLocation } from '../../hooks/useLocation';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import Stack from '../../components/Stack';
import { updateOrder } from '../../redux/consumer/ordersActions';
import Loader from '../../components/Loader';
import * as Location from 'expo-location';
import { Business, Coors } from '../../redux/business/businessSlide';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CourierHomeStackScreens } from '../../navigation/courier/typing';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SIZES } from '../../constants';
import { FontAwesome } from '@expo/vector-icons';
import BottomSheet, {
    BottomSheetFooter,
    BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import Row from '../../components/Row';
import Header from '../../components/Header';
import Button from '../../components/Button';
import AnimatedLottieView from 'lottie-react-native';

const EGDE = 10;
type Props = NativeStackScreenProps<CourierHomeStackScreens, 'DeliveryView'>;

const DeliveryView = ({
    navigation,
    route: {
        params: { orderId }
    }
}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const { location } = useLocation();
    const [isCloseToDestination, setIsCloseToDestination] = useState(false);
    const theme = useAppSelector((state) => state.theme);
    const [order, setOrder] = useState<Order>();
    const [origin, setOrigin] = useState<Coors>();
    const [distance, setDistance] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [destination, setDestination] = useState<Coors>();
    const mapViewRef = useRef<MapView>(null);
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['10%', '80%'], []);
    const [business, setBusiness] = React.useState<Business>();
    const dispatch = useAppDispatch();
    console.log(isCloseToDestination);

    const handlePressActionButton = async () => {
        try {
            if (order?.status === ORDER_STATUS.marked_ready_for_delivery) {
                if (!user) return;

                const { payload } = await dispatch(
                    updateOrder({
                        ...order,
                        status: ORDER_STATUS.accepted_by_driver,
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
        }
        if (order.status === ORDER_STATUS.accepted_by_driver) {
            setDestination({
                lat: business?.coors?.lat!,
                lng: business?.coors?.lng!
            });
        }
        if (order.status === ORDER_STATUS.picked_up_by_driver) {
            setDestination({
                lat: order.address?.coors?.lat!,
                lng: order.address?.coors?.lng!
            });
        }
    }, [order?.status, location]);

    useEffect(() => {
        let sub: Location.LocationSubscription;
        (async () => {
            if (!order) return;
            if (order?.status === ORDER_STATUS.marked_ready_for_delivery)
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

                    mapViewRef.current?.animateToRegion({
                        latitude: result.coords.latitude!,
                        longitude: result.coords.longitude!,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    });
                }
            );
        })();

        return () => {
            if (sub) {
                sub.remove();
            }
        };
    }, [location, order]);

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

        setOrigin({
            lat: order.courier.coors?.lat!,
            lng: order.courier.coors?.lng!
        });
        if (order.status === ORDER_STATUS.accepted_by_driver) {
            setDestination({
                lat: business?.coors?.lat!,
                lng: business?.coors?.lng!
            });

            mapViewRef.current?.animateToRegion({
                latitude: business?.coors?.lat!,
                longitude: business?.coors?.lng!,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            });
        }
        if (order.status === ORDER_STATUS.picked_up_by_driver) {
            setDestination({
                lat: order.address?.coors.lat!,
                lng: order.address?.coors.lng!
            });

            mapViewRef.current?.animateToRegion({
                latitude: order.address?.coors.lat!,
                longitude: order.address?.coors.lat!,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            });
        }
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

    if (!origin || !destination) return <Loader />;
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
                    iconColor="#212121"
                    title="Delivery View"
                    onPressBack={() => navigation.goBack()}
                />
            </View>
            <MapView
                showsUserLocation
                followsUserLocation
                zoomEnabled
                zoomControlEnabled
                ref={mapViewRef}
                style={{ height: '91%', width: '100%' }}
                region={{
                    latitude: origin?.lat!,
                    longitude: origin?.lng!,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.04
                }}
            >
                <Marker
                    title={business?.name}
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

                <Marker
                    title="Me"
                    coordinate={{
                        latitude: origin.lat!,
                        longitude: origin?.lng!
                    }}
                />

                <Marker
                    title={order?.contactPerson.name}
                    description={order?.address?.street.split(', ')[0]}
                    coordinate={{
                        latitude: order?.address?.coors.lat!,
                        longitude: order?.address?.coors?.lng!
                    }}
                >
                    <FontAwesome name="user" color={'#212121'} size={26} />
                </Marker>

                <MapViewDirections
                    apikey={process.env.GOOGLE_API!}
                    strokeColor={'#212121'}
                    strokeWidth={5}
                    mode="BICYCLING"
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
            <BottomSheet index={0} ref={sheetRef} snapPoints={snapPoints}>
                <BottomSheetScrollView>
                    <Row
                        containerStyle={{
                            alignSelf: 'center',
                            width: '50%',
                            maxWidth: 200
                        }}
                        horizontalAlign="space-around"
                    >
                        <Text darkText bold>
                            {duration.toFixed(0)} mins
                        </Text>
                        <FontAwesome
                            name="bicycle"
                            size={26}
                            color={'#212121'}
                        />
                        <Text bold darkText>
                            {(distance * 0.621371).toFixed(1)} miles
                        </Text>
                    </Row>

                    <View style={{ marginTop: 30 }}>
                        <Stack>
                            <Text darkText bold py_4>
                                Delivery Contact
                            </Text>
                            <Row>
                                <Text darkText>
                                    {order?.contactPerson.name}
                                </Text>
                                <Text px_4 darkText>
                                    {order?.contactPerson.lastName}
                                </Text>
                            </Row>
                            <Text darkText bold>
                                {order?.contactPerson.phone}
                            </Text>
                        </Stack>
                        <Stack>
                            <Text bold py_4 darkText>
                                Pick Up At
                            </Text>
                            <Text darkText>{business?.address}</Text>
                            <Text darkText bold py_4>
                                Drof Off At
                            </Text>
                            <Text darkText>{order?.address?.street}</Text>
                            {order?.address?.apt && (
                                <Text py_4 darkText bold>
                                    APT: {order.address.apt}
                                </Text>
                            )}
                        </Stack>
                        <Stack>
                            {order?.deliveryInstructions && (
                                <>
                                    <Text bold darkText>
                                        Delivery Instructions
                                    </Text>
                                    <Text darkText>
                                        {order.deliveryInstructions}
                                    </Text>
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
