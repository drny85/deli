import { FlatList, ListRenderItem, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppSelector } from '../../../redux/store';

import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import CourierCard from '../../../components/courier/CourierCard';
import { Courier } from '../../../types';
import { SIZES } from '../../../constants';
import { businessProperty } from '../../../utils/businessProperty';

const AllCouriers = () => {
    const { orders } = useAppSelector((state) => state.orders);
    const couriers = businessProperty({ orders, property: 'deliveredBy' });
    const navigation = useNavigation();

    const renderCouriers: ListRenderItem<Courier> = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginVertical: SIZES.base }}>
                <CourierCard courier={item} phone={item.phone!} />
            </TouchableOpacity>
        );
    };

    return (
        <Screen>
            <Header onPressBack={() => navigation.goBack()} title="Couriers" />
            <FlatList
                data={couriers as Courier[]}
                keyExtractor={(item) => item.id!}
                renderItem={renderCouriers}
            />
        </Screen>
    );
};

export default AllCouriers;
