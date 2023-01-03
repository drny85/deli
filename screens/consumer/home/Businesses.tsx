import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useBusinessAvailable } from '../../../hooks/useBusinessAvailable';
import Loader from '../../../components/Loader';
import { Business, setBusiness } from '../../../redux/business/businessSlide';
import { useAppDispatch } from '../../../redux/store';

import { useNavigation } from '@react-navigation/native';
import BusinessCard from '../../../components/BusinessCard';
import { useLocation } from '../../../hooks/useLocation';
import { getMilesBetweenLatLon } from '../../../utils/getMilesBetwwen';

type Props = {};

const Businesses = ({}: Props) => {
    const { businessAvailable, isLoading } = useBusinessAvailable();
    const { location } = useLocation();
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

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
