import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
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
import { getMilesBetweenLatLon } from '../../../utils/getMilesBetwwen';
import { isTherePreviousRoute } from '../../../utils/checkForPreviousRoute';

type Props = {};

const Businesses = ({}: Props) => {
    useLocation();
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const [route, setRoute] = useState<string>();
    const { businessAvailable, isLoading } = useBusinessAvailable();

    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const sub = navigation.addListener('focus', async () => {
            const { success, route } = await isTherePreviousRoute();

            setRoute(route);
            console.log('focus', route);

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
            <FlatList
                showsVerticalScrollIndicator={false}
                data={businessAvailable}
                keyExtractor={(item) => item.id!}
                renderItem={renderBusinesses}
            />
        </Screen>
    );
};

export default Businesses;
