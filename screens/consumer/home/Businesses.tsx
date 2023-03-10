import {
    FlatList,
    TextInput,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableOpacity,
    View,
    Switch
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Loader from '../../../components/Loader';
import { Business, setBusiness } from '../../../redux/business/businessSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

import { useNavigation } from '@react-navigation/native';
import BusinessCard from '../../../components/business/BusinessCard';
import { useLocation } from '../../../hooks/useLocation';
import { FontAwesome } from '@expo/vector-icons';
import { isTherePreviousRoute } from '../../../utils/checkForPreviousRoute';
import { AnimatePresence, MotiView } from 'moti';
import Row from '../../../components/Row';
import {
    Order,
    ORDER_TYPE,
    saveDeliveryAddress,
    setDeliveryZip
} from '../../../redux/consumer/ordersSlide';

import InputField from '../../../components/InputField';
import { SIZES } from '../../../constants';
import { useAllProducts } from '../../../hooks/useAllProducts';
import OrderTypeSwitcher from '../../../components/OrderTypeSwitcher';
import MostRecentOrders from '../../../components/MostRecentOrders';
import FloatingArrowUpButton from '../../../components/FloatingArrowUpButton';

import useNotifications from '../../../hooks/useNotifications';
import PickupMap from '../../../components/modals/PickupMap';
import HomeBusinessOrderDetails from '../../../components/modals/HomeBusinessOrderDetails';

const Businesses = () => {
    useNotifications();

    const { user, loading } = useAppSelector((state) => state.auth);
    const { orderType } = useAppSelector((state) => state.orders);
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const [order, setOrder] = useState<Order>();
    const {
        businessAvailable,
        allProducts,
        loading: isLoading
    } = useAllProducts();
    // variables
    const [showOnlyWithinDeliveryZone, setShowOnlyWithinDeliveryZone] =
        useState(true);

    const { address, latitude, longitude } = useLocation();

    const navigation = useNavigation();
    const currentOffset = useRef(0);
    const currentDirection = useRef<'up' | 'down'>('up');
    const inputRef = useRef<TextInput>(null);
    const [nothingFound, setNothingFound] = useState(false);
    const { deliveryAdd, deliveryZip } = useAppSelector(
        (state) => state.orders
    );

    const [show, setShow] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const listRef = useRef<FlatList>(null);

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = e.nativeEvent.contentOffset.y;
        const direction = y > currentOffset.current && y > 0 ? 'down' : 'up';
        if (currentDirection.current !== direction) {
            currentDirection.current = direction;
            setShow(currentDirection.current === 'up');
        }
        currentOffset.current = y;
    };

    const handleSearch = (text: string) => {
        setSearchValue(text.replace(/[^a-z]/gi, ''));

        if (text.length > 0) {
            const bus = businessAvailable.filter((b) =>
                allProducts.some((p) => {
                    const regex = new RegExp(
                        `${searchValue.toLowerCase()}`,
                        'gi'
                    );

                    return (
                        p.businessId === b.id &&
                        p.name.toLowerCase().match(regex)
                    );
                })
            );
            if (bus.length > 0) {
                setBusinesses(bus);
                setNothingFound(false);
            } else {
                //setBusinesses(businessAvailable);
                setBusinesses([]);
                setNothingFound(true);
            }
        } else {
            setBusinesses(businessAvailable);
        }
    };

    useEffect(() => {
        if (!businessAvailable.length) return;
        if (deliveryAdd && showOnlyWithinDeliveryZone && deliveryZip) {
            setBusinesses(
                businessAvailable.filter(
                    (b) => b.zips && b.zips.includes(deliveryZip)
                )
            );
        } else {
            setBusinesses(businessAvailable);
        }
    }, [
        businessAvailable,
        showOnlyWithinDeliveryZone,
        deliveryAdd,
        deliveryZip
    ]);

    useEffect(() => {
        if (deliveryAdd) return;
        if (!address || !latitude || !longitude) return;

        const { streetNumber, street, city, subregion, postalCode } = address;
        dispatch(
            saveDeliveryAddress({
                street: `${streetNumber} ${street} , ${city}, ${subregion}, ${postalCode}`,
                coors: { lat: latitude, lng: longitude },
                addedOn: new Date().toISOString()
            })
        );
        dispatch(setDeliveryZip(+postalCode!));
    }, [address, latitude, latitude]);

    useEffect(() => {
        const sub = navigation.addListener('focus', async () => {
            const { success, route } = await isTherePreviousRoute();

            if (user && success) {
                console.log('Redirecting to previous route');
                if (route === 'OrderReview') {
                    navigation.navigate('ConsumerCart', {
                        screen: 'OrderReview'
                    });
                }
                if (route === 'Orders') {
                    navigation.navigate('ConsumerOrders', { screen: 'Orders' });
                }
            }
        });

        return sub;
    }, [user]);

    const renderBusinesses: ListRenderItem<Business> = ({ item }) => {
        return (
            <BusinessCard
                business={item}
                onPress={() => {
                    dispatch(setBusiness(item));
                    navigation.navigate('ConsumerHome', {
                        screen: 'BusinessPage'
                    });
                }}
            />
        );
    };
    console.log(isLoading, businessAvailable.length, loading);

    if (isLoading || !businessAvailable.length || loading) return <Loader />;

    return (
        <Screen>
            <AnimatePresence>
                {currentDirection.current === 'up' && (
                    <MotiView
                        from={{
                            height: 0,
                            opacity: 0,
                            translateY: -50
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                            height: 60
                        }}
                        exit={{
                            opacity: 0,
                            translateY: -50,
                            height: 0
                        }}
                        transition={{ type: 'timing' }}
                    >
                        <Row horizontalAlign="space-between">
                            <View
                                style={{
                                    marginRight: SIZES.base * 1.5
                                }}
                            >
                                <Text textColor={'#7d8597'} bold px_4>
                                    Deliver Now
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('ConsumerHome', {
                                            screen: 'DeliveryAddressSelection'
                                        });
                                    }}
                                >
                                    <Row>
                                        <Text px_4 bold>
                                            {deliveryAdd
                                                ? deliveryAdd.street.split(
                                                      ', '
                                                  )[0]
                                                : 'Getting address'}
                                        </Text>
                                        <FontAwesome
                                            name="chevron-down"
                                            size={12}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </Row>
                                </TouchableOpacity>
                            </View>
                            <OrderTypeSwitcher />
                        </Row>
                    </MotiView>
                )}
            </AnimatePresence>
            <View
                style={{
                    marginHorizontal: SIZES.base
                }}
            >
                <View style={{ marginTop: 5 }} />
                <Text lobster large center>
                    What are you craving for right now?
                </Text>
                <InputField
                    ref={inputRef}
                    placeholder="Salad, Coffee, Pastelito, Tostones, etc"
                    onChangeText={(text) => handleSearch(text)}
                    contentStyle={{
                        paddingVertical: SIZES.base * 1.5
                    }}
                    value={searchValue}
                    rightIcon={
                        searchValue.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    inputRef.current?.blur();
                                    setSearchValue('');
                                    setBusinesses(businessAvailable);
                                }}
                                style={{ marginRight: 6 }}
                            >
                                <FontAwesome
                                    name="close"
                                    size={18}
                                    color={theme.TEXT_COLOR}
                                />
                            </TouchableOpacity>
                        )
                    }
                />
            </View>

            <FloatingArrowUpButton
                show={show}
                onPress={() => {
                    listRef.current?.scrollToIndex({
                        index: 0,
                        animated: true
                    });
                }}
            />

            {user && (
                <MostRecentOrders
                    businesses={businessAvailable}
                    onPress={(order) => {
                        setOrder(order);
                        setVisible(true);
                    }}
                />
            )}

            {nothingFound && searchValue.length ? (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1
                    }}
                >
                    <Text>No Businesses selling {searchValue}</Text>
                </View>
            ) : (
                <>
                    <Row
                        horizontalAlign="space-between"
                        containerStyle={{ marginVertical: 10 }}
                    >
                        <Text lobster medium px_4>
                            {SIZES.isVerySmall
                                ? 'Stores'
                                : 'Stores / Groceries'}
                        </Text>
                        <AnimatePresence>
                            {orderType === ORDER_TYPE.delivery && (
                                <MotiView
                                    from={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'timing' }}
                                >
                                    <Row horizontalAlign="space-between">
                                        <Text bold px_4>
                                            {showOnlyWithinDeliveryZone &&
                                            deliveryZip
                                                ? `Delivering to ${deliveryZip}`
                                                : 'Showing all stores'}
                                        </Text>
                                        <Switch
                                            value={showOnlyWithinDeliveryZone}
                                            onValueChange={
                                                setShowOnlyWithinDeliveryZone
                                            }
                                            thumbColor={theme.TEXT_COLOR}
                                            trackColor={{
                                                true: theme.ASCENT,
                                                false: theme.TEXT_COLOR
                                            }}
                                        />
                                    </Row>
                                </MotiView>
                            )}
                        </AnimatePresence>
                    </Row>
                    {businesses.length > 0 ? (
                        <FlatList
                            ref={listRef}
                            onScroll={onScroll}
                            bounces={false}
                            alwaysBounceVertical={false}
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={
                                <View style={{ height: 40 }} />
                            }
                            data={[...businesses]}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={renderBusinesses}
                        />
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text bold>No Stores found</Text>
                            <Text py_8 caption>
                                Considering changing your delivery address
                            </Text>
                        </View>
                    )}
                </>
            )}

            {businessAvailable.length > 0 && order && (
                <HomeBusinessOrderDetails
                    businesses={businessAvailable}
                    order={order}
                    visible={visible}
                    setVisible={setVisible}
                />
            )}

            <PickupMap businesses={businessAvailable} />
        </Screen>
    );
};

export default Businesses;
