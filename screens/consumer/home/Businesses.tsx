import {
    FlatList,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';

import Loader from '../../../components/Loader';
import { Business, setBusiness } from '../../../redux/business/businessSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

import { useNavigation } from '@react-navigation/native';
import BusinessCard from '../../../components/BusinessCard';
import { useLocation } from '../../../hooks/useLocation';
import { FontAwesome } from '@expo/vector-icons';
import { isTherePreviousRoute } from '../../../utils/checkForPreviousRoute';
import { AnimatePresence, MotiView } from 'moti';
import Row from '../../../components/Row';
import {
    ORDER_TYPE,
    saveDeliveryAddress
} from '../../../redux/consumer/ordersSlide';

import InputField from '../../../components/InputField';
import { SIZES } from '../../../constants';
import { useAllProducts } from '../../../hooks/useAllProducts';

import Stack from '../../../components/Stack';
import OrderTypeSwitcher from '../../../components/OrderTypeSwitcher';

type Props = {};

const Businesses = ({}: Props) => {
    const dispatch = useAppDispatch();

    const { address, latitude, longitude } = useLocation();
    const navigation = useNavigation();
    const [nothingFound, setNothingFound] = useState(false);
    const { deliveryAdd } = useAppSelector((state) => state.orders);
    const theme = useAppSelector((state) => state.theme);
    const [show, setShow] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [route, setRoute] = useState<string>();
    const listRef = useRef<FlatList>(null);
    const {
        businessAvailable,
        allProducts,
        loading: isLoading
    } = useAllProducts();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setShow(e.nativeEvent.contentOffset.y < 100);
    };
    const { user, loading } = useAppSelector((state) => state.auth);

    const handleSearch = (text: string) => {
        setSearchValue(text.replace(/[^a-z]/gi, ''));

        // console.log('Searching...');
        if (text.length > 0) {
            const bus = businessAvailable.filter((b) =>
                allProducts.some((p) => {
                    const regex = new RegExp(`${searchValue}`, 'gi');
                    console.log(p.name.match(regex), p.businessId === b.id);
                    return p.businessId === b.id && p.name.match(regex);
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
        //if (!businessAvailable.length) return;
        setBusinesses(businessAvailable);
    }, [businessAvailable.length]);

    useEffect(() => {
        if (deliveryAdd) return;
        if (!address || !latitude || !longitude) return;

        const { streetNumber, street, city, subregion, postalCode } = address;
        dispatch(
            saveDeliveryAddress({
                street: `${streetNumber} ${street} , ${city}, ${subregion}, ${postalCode}`,
                coors: { lat: latitude, lng: longitude },
                apt: null
            })
        );
    }, [address, latitude, latitude]);

    useEffect(() => {
        const sub = navigation.addListener('focus', async () => {
            const { success, route } = await isTherePreviousRoute();

            setRoute(route);

            if (user && success) {
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

    if (isLoading || !deliveryAdd || !businessAvailable.length || loading)
        return <Loader />;

    return (
        <Screen>
            <AnimatePresence>
                {show && (
                    <MotiView
                        from={{ height: 0, opacity: 1, translateY: -50 }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                            height: 80
                        }}
                        exit={{ opacity: 0, translateY: -50, height: 0 }}
                        transition={{ type: 'timing' }}
                    >
                        <Row>
                            <View style={{ marginRight: SIZES.base * 1.5 }}>
                                <Text px_4>Deliver Now</Text>

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
                            <View
                                style={{
                                    flexGrow: 1,
                                    marginHorizontal: SIZES.base
                                }}
                            >
                                <InputField
                                    placeholder="What are you creaving right now?"
                                    onChangeText={(text) => handleSearch(text)}
                                    contentStyle={{
                                        paddingVertical: SIZES.base * 1.5
                                    }}
                                    value={searchValue}
                                    rightIcon={
                                        searchValue.length > 0 && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSearchValue('');
                                                    setBusinesses(
                                                        businessAvailable
                                                    );
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
                        </Row>
                    </MotiView>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!show && (
                    <MotiView
                        style={{
                            position: 'absolute',
                            bottom: 30,
                            right: 20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        from={{
                            opacity: 0,
                            height: 0,
                            width: 0,
                            borderRadius: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            backgroundColor: theme.ASCENT,
                            zIndex: 300
                        }}
                        transition={{ type: 'timing' }}
                        exit={{ opacity: 0, width: 0, height: 0 }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                listRef.current?.scrollToIndex({
                                    index: 0,
                                    animated: true
                                })
                            }
                            style={{
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <FontAwesome
                                name="arrow-up"
                                size={22}
                                color={theme.TEXT_COLOR}
                            />
                        </TouchableOpacity>
                    </MotiView>
                )}
            </AnimatePresence>

            <OrderTypeSwitcher />

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
                <FlatList
                    ref={listRef}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    data={[...businesses]}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderBusinesses}
                />
            )}
        </Screen>
    );
};

export default Businesses;
