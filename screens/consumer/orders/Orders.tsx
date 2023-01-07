import { FlatList, ListRenderItem, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';

import { SIZES } from '../../../constants';
import { useAppSelector } from '../../../redux/store';
import { useOrders } from '../../../hooks/useOrders';
import Loader from '../../../components/Loader';
import { Order } from '../../../redux/consumer/ordersSlide';
import OrderListItem from '../../../components/OrderListItem';
import { useNavigation } from '@react-navigation/native';

type Props = {};

const Orders = ({}: Props) => {
    const { business } = useAppSelector((state) => state.business);
    const { orders, loading } = useOrders();
    const navigation = useNavigation();

    const renderOrders: ListRenderItem<Order> = ({ item }) => {
        return (
            <OrderListItem
                order={item}
                onPress={() => {
                    navigation.navigate('ConsumerOrders', {
                        screen: 'OrderDetails',
                        params: { orderId: item.id! }
                    });
                }}
            />
        );
    };

    if (loading) return <Loader />;
    return (
        <Screen center>
            <FlatList
                contentContainerStyle={{ width: '100%' }}
                data={orders}
                keyExtractor={(item) => item.id!}
                renderItem={renderOrders}
            />
        </Screen>
    );
};

export default Orders;
