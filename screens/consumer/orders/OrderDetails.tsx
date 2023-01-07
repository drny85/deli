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
import BottomSheet from '@gorhom/bottom-sheet';
import { Coors } from '../../../redux/business/businessSlide';
import { FontAwesome } from '@expo/vector-icons';
import AnimatedLottieView from 'lottie-react-native';
import { ORDER_STATUS } from '../../../redux/consumer/ordersSlide';
import { Image } from 'moti';

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
    const snapPoints = useMemo(() => ['10%', '25%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const goToOrder = () => {
        navigation.navigate('ConsumerOrders', { screen: 'Orders' });
    };

    const mapRef = useRef<MapView>(null);

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

                    <TouchableOpacity
                        onPress={goToOrder}
                        style={{
                            position: 'absolute',
                            top: 30,
                            left: 20,
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
                            size={20}
                            color={'#212121'}
                        />
                    </TouchableOpacity>
                </MapView>
                {minutes && <Text>ETA {Math.round(minutes)} minutes</Text>}
            </View>
        );
    };

    const renderNewOrder = (): JSX.Element => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    console.log('onPress');
                    navigation.goBack();
                }}
            >
                <View style={{ flex: 1 }}>
                    <>
                        <AnimatedLottieView
                            style={{ flex: 1 }}
                            resizeMode="contain"
                            autoPlay
                            source={
                                theme.mode === 'dark'
                                    ? require('../../../assets/animations/preparing-dark.json')
                                    : require('../../../assets/animations/preparing.json')
                            }
                        />
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                position: 'absolute',
                                top: 30,
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
                                flex: 1,
                                justifyContent: 'space-between',
                                paddingVertical: SIZES.padding * 3
                            }}
                        >
                            <View>
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
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                    >
                        <View>
                            <Text lobster medium center darkText>
                                {business.name} just got your order 🎉
                            </Text>
                        </View>
                    </BottomSheet>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    return (
        <Screen>
            {order.status === ORDER_STATUS.new && renderNewOrder()}
            {order.status === ORDER_STATUS.marked_ready_for_delivery &&
                renderOrderMarkedForDelivery()}
        </Screen>
    );
};

export default OrderDetails;
