import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
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
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetView
} from '@gorhom/bottom-sheet';
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

type Props = NativeStackScreenProps<ConsumerOrdersStackScreens, 'OrderDetails'>;

const EGDE = 10;

const OrderDetails = ({
    route: {
        params: { orderId }
    }
}: Props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { business } = useAppSelector((state) => state.business);
    const [view, setView] = useState<'lottie' | 'details' | 'map'>('lottie');
    const [origin, setOrigin] = useState<Coors>();
    const [destination, setDestination] = useState<Coors>();
    const theme = useAppSelector((state) => state.theme);
    const { loading, order } = useOrder(orderId);
    const [minutes, setMinutes] = useState<number | null>(null);
    const snapPoints = useMemo(() => ['10%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const goToOrder = () => {
        navigation.navigate('ConsumerOrders', { screen: 'Orders' });
    };

    const mapRef = useRef<MapView>(null);
    const lottieRef = useRef<AnimatedLottieView>(null);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

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
        if (!order) return;
        setDestination(order.address?.coors);
        // @ts-ignore
        dispatch(getCurrentBusiness(order.businessId!));
    }, [order?.businessId]);

    console.log(order?.id);

    if (loading || !order || !business) return <Loader />;

    const renderOrderMarkedForDelivery = (): JSX.Element => {
        return (
            <View style={{ height: SIZES.height * 0.5 }}>
                <MapView
                    ref={mapRef}
                    initialRegion={{
                        latitude: order.address?.coors.lat!,
                        longitude: order.address?.coors.lng!,
                        latitudeDelta: 0.7665,
                        longitudeDelta: 0.6076
                    }}
                    style={{ flex: 1, borderRadius: SIZES.base }}
                >
                    <Marker
                        coordinate={{
                            latitude: origin?.lat!,
                            longitude: origin?.lng!
                        }}
                        title={business.name}
                        description={business?.address?.split(', ')[0]}
                        // draggable
                        // onDragEnd={(coors) => {
                        //     setOrigin({
                        //         lat: coors.nativeEvent.coordinate.latitude,
                        //         lng: coors.nativeEvent.coordinate.longitude
                        //     });
                        // }}
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
                        draggable
                        title="Me"
                        description={order.address?.street.split(', ')[0]}

                        // onDragEnd={(coors) => {
                        //     setDestination({
                        //         lat: coors.nativeEvent.coordinate.latitude,
                        //         lng: coors.nativeEvent.coordinate.longitude
                        //     });
                        // }}
                    />
                    <MapViewDirections
                        apikey={process.env.GOOGLE_API!}
                        strokeColor={theme.ASCENT}
                        strokeWidth={5}
                        onError={(er) => console.log(er)}
                        optimizeWaypoints={true}
                        onReady={(result) => {
                            const { duration, coordinates } = result;

                            setMinutes(duration);
                            mapRef.current?.fitToCoordinates(
                                result.coordinates,
                                {
                                    edgePadding: {
                                        right: SIZES.width / EGDE,
                                        bottom: SIZES.height / EGDE,
                                        left: SIZES.width / EGDE,
                                        top: SIZES.height / EGDE
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
                {minutes && <Text>ETA {Math.round(minutes)} minutes</Text>}
                <TouchableOpacity
                    onPress={goToOrder}
                    style={{
                        position: 'absolute',
                        top: SIZES.statusBarHeight,

                        left: 10,
                        height: 40,
                        width: 40,
                        borderRadius: 20,

                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100
                    }}
                >
                    <FontAwesome
                        name="chevron-left"
                        size={28}
                        color={theme.TEXT_COLOR}
                    />
                </TouchableOpacity>
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
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ConsumerOrders', {
                                screen: 'Orders'
                            })
                        }
                        style={{
                            position: 'absolute',
                            top: SIZES.statusBarHeight,
                            left: 20,
                            padding: SIZES.base,
                            zIndex: 120
                        }}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={24}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
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
                backgroundColor:
                    theme.mode === 'light' ? '#f5ebe0' : theme.BACKGROUND_COLOR
            }}
        >
            {order.status === ORDER_STATUS.new && renderNewOrder()}
            {order.status === ORDER_STATUS.in_progress && renderNewOrder()}
            {order.status === ORDER_STATUS.marked_ready_for_delivery &&
                renderOrderMarkedForDelivery()}
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
            >
                <BottomSheetScrollView>
                    <Text darkText center lobster medium py_4>
                        {order.status === ORDER_STATUS.new &&
                            `${business.name} just got your order`}

                        {order.status === ORDER_STATUS.in_progress &&
                            `${business.name} started preparing your order`}
                        {order.status ===
                            ORDER_STATUS.marked_ready_for_delivery &&
                            `Your order is ready for delivery`}
                    </Text>
                    <Stack>
                        <Text darkText bold>
                            From
                        </Text>
                        <Text darkText>{business.address?.split(', ')[0]}</Text>
                        <View style={{ height: 10 }} />
                        <Text darkText bold>
                            To
                        </Text>
                        <Text darkText>
                            {order.address?.street?.split(', ')[0]}
                        </Text>
                        <Text darkText py_4>
                            Order Date: {moment(order.orderDate).format('lll')}
                        </Text>
                    </Stack>
                    <Divider small />
                    <View style={{ padding: SIZES.padding }}>
                        <Text darkText center bold>
                            Items
                        </Text>
                        {order.items.map((item, index) => (
                            <ProductListItem
                                themeTextColor
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
                                <Text darkText capitalize>
                                    Sub Total
                                </Text>
                                <Text darkText capitalize>
                                    &{order.total.toFixed(2)}
                                </Text>
                            </Row>
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text py_4 darkText capitalize>
                                    Service Fee
                                </Text>
                                <Text darkText capitalize>
                                    ${stripeFee(order.total).toFixed(2)}
                                </Text>
                            </Row>
                            <Divider small />
                            <Row
                                containerStyle={{ width: '100%' }}
                                horizontalAlign="space-between"
                            >
                                <Text py_4 darkText bold large capitalize>
                                    Total
                                </Text>
                                <Text darkText bold large capitalize>
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
