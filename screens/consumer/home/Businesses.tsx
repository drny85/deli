import {
    FlatList,
    ListRenderItem,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
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
    Order,
    ORDER_STATUS,
    saveDeliveryAddress
} from '../../../redux/consumer/ordersSlide';

import InputField from '../../../components/InputField';
import { SIZES } from '../../../constants';
import { useAllProducts } from '../../../hooks/useAllProducts';
import OrderTypeSwitcher from '../../../components/OrderTypeSwitcher';
import MostRecentOrders from '../../../components/MostRecentOrders';
import FloatingArrowUpButton from '../../../components/FloatingArrowUpButton';
import Divider from '../../../components/Divider';
import { stripeFee } from '../../../utils/stripeFee';
import Stack from '../../../components/Stack';
import moment from 'moment';
import ProductListItem from '../../../components/ProductListItem';
import Header from '../../../components/Header';
import useNotifications from '../../../hooks/useNotifications';

const Businesses = () => {
    useNotifications();
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const [order, setOrder] = useState<Order>();
    // variables
    const { address, latitude, longitude } = useLocation();
    const navigation = useNavigation();

    const [nothingFound, setNothingFound] = useState(false);
    const { deliveryAdd } = useAppSelector((state) => state.orders);
    const theme = useAppSelector((state) => state.theme);
    const [show, setShow] = useState(true);
    const [searchValue, setSearchValue] = useState('');
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

        if (text.length > 0) {
            const bus = businessAvailable.filter((b) =>
                allProducts.some((p) => {
                    const regex = new RegExp(
                        `${searchValue.toLowerCase()}`,
                        'gi'
                    );
                    console.log(p.name.match(regex), p.businessId === b.id);
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
                addedOn: new Date().toISOString()
            })
        );
    }, [address, latitude, latitude]);

    useEffect(() => {
        const sub = navigation.addListener('focus', async () => {
            const { success, route } = await isTherePreviousRoute();

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

    if (isLoading || !businessAvailable.length || loading) return <Loader />;

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

            <FloatingArrowUpButton
                show={show}
                onPress={() => {
                    listRef.current?.scrollToIndex({
                        index: 0,
                        animated: true
                    });
                }}
            />

            <OrderTypeSwitcher />
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
                    <Text lobster medium px_4>
                        Groceries
                    </Text>
                    <FlatList
                        ref={listRef}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        data={[...businesses]}
                        keyExtractor={(item) => item.id!}
                        renderItem={renderBusinesses}
                    />
                </>
            )}

            {businessAvailable.length && (
                <Modal
                    visible={visible}
                    presentationStyle="pageSheet"
                    animationType="slide"
                    style={{ backgroundColor: theme.BACKGROUND_COLOR }}
                >
                    <View
                        style={[
                            styles.container,
                            { backgroundColor: theme.BACKGROUND_COLOR }
                        ]}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                top: 20,
                                width: '100%',
                                zIndex: 400,
                                backgroundColor: theme.BACKGROUND_COLOR
                            }}
                        >
                            <Header
                                title="Order Details"
                                rightIcon={
                                    <TouchableOpacity
                                        onPress={() => setVisible(false)}
                                        style={{
                                            padding: 10
                                        }}
                                    >
                                        <FontAwesome
                                            name="close"
                                            color={theme.SECONDARY_BUTTON_COLOR}
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                }
                            />
                        </View>

                        <View>
                            <Stack containerStyle={{ marginTop: 30 }}>
                                <Divider bgColor={theme.TEXT_COLOR} />
                                <Text bold>
                                    From{' '}
                                    <Text lobster medium>
                                        {' '}
                                        {
                                            businessAvailable.find(
                                                (b) =>
                                                    b.id === order?.businessId
                                            )?.name
                                        }
                                    </Text>
                                </Text>
                                <Text>
                                    {businessAvailable.find(
                                        (b) => b.id! === order?.businessId!
                                    ) !== undefined
                                        ? businessAvailable
                                              .find(
                                                  (b) =>
                                                      b.id! ===
                                                      order?.businessId!
                                              )
                                              ?.address?.slice(0, -15)
                                        : ''}
                                </Text>
                                <View style={{ height: 10 }} />
                                <Text bold>
                                    To{' '}
                                    <Text lobster medium>
                                        {order?.contactPerson.name}
                                    </Text>
                                </Text>
                                <Text>
                                    {order?.address?.street?.split(', ')[0]}
                                </Text>
                                <Text py_4>
                                    Order Date:{' '}
                                    {moment(order?.orderDate).format('lll')}
                                </Text>
                                {order?.status === ORDER_STATUS.delivered && (
                                    <Text py_4>
                                        Delivered On:{' '}
                                        {moment(order?.deliveredOn).format(
                                            'lll'
                                        )}
                                    </Text>
                                )}
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
                                <ScrollView
                                    contentContainerStyle={{ maxHeight: 200 }}
                                >
                                    {order?.items.map((item, index) => (
                                        <ProductListItem
                                            key={index.toString()}
                                            item={item}
                                            index={index}
                                        />
                                    ))}
                                </ScrollView>

                                <Divider
                                    thickness="medium"
                                    bgColor={theme.TEXT_COLOR}
                                    small
                                />

                                <View style={{ marginTop: 10 }}>
                                    <Row
                                        containerStyle={{ width: '100%' }}
                                        horizontalAlign="space-between"
                                    >
                                        <Text capitalize>Sub Total</Text>
                                        <Text capitalize>
                                            ${order?.total.toFixed(2)}
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
                                            $
                                            {stripeFee(order?.total!).toFixed(
                                                2
                                            )}
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
                                                order?.total! +
                                                stripeFee(order?.total!)
                                            ).toFixed(2)}
                                        </Text>
                                    </Row>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </Screen>
    );
};

export default Businesses;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: SIZES.padding
    }
});
