import {
    FlatList,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useBusinessAvailable } from '../../../hooks/useBusinessAvailable';
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
import { saveDeliveryAddress } from '../../../redux/consumer/ordersSlide';

import InputField from '../../../components/InputField';
import { SIZES } from '../../../constants';
import { useProducts } from '../../../hooks/useProducts';

type Props = {};

const Businesses = ({}: Props) => {
    const dispatch = useAppDispatch();
    const { address, latitude, longitude } = useLocation();
    const navigation = useNavigation();
    const { deliveryAdd } = useAppSelector((state) => state.orders);
    const theme = useAppSelector((state) => state.theme);
    const [scrollY, setScrollY] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [route, setRoute] = useState<string>();
    const { businessAvailable, isLoading } = useBusinessAvailable();
    const [businesses, setBusinesses] = useState<Business[]>([]);

    const { user } = useAppSelector((state) => state.auth);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrollY(e.nativeEvent.contentOffset.y);
    };

    const handleSearch = (text: string) => {
        setSearchValue(text);
        if (text.length > 0) {
            const bus = businesses.filter((b) => {
                const regex = new RegExp(`${text}`, 'gi');
            });
        } else {
            setBusinesses(businessAvailable);
        }
    };

    useEffect(() => {
        if (!businessAvailable.length) return;
        setBusinesses(businessAvailable);
    }, [businessAvailable.length]);

    useEffect(() => {
        if (deliveryAdd) return;
        if (!address || !latitude || !longitude) return;
        console.log(address);

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

    if (isLoading) return <Loader />;

    return (
        <Screen>
            <AnimatePresence>
                {scrollY < 100 && (
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
                                        searchValue.length > 1 && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setSearchValue('')
                                                }
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
            <FlatList
                onScroll={onScroll}
                showsVerticalScrollIndicator={false}
                data={businesses}
                keyExtractor={(item) => item.id!}
                renderItem={renderBusinesses}
            />
        </Screen>
    );
};

export default Businesses;
