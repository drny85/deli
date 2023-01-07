import { FlatList, ListRenderItem, View } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';

import { SIZES } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { useOrders } from '../../../hooks/useOrders';
import Loader from '../../../components/Loader';
import { Order } from '../../../redux/consumer/ordersSlide';
import OrderListItem from '../../../components/OrderListItem';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/Button';

import { getCurrentBusiness } from '../../../redux/business/businessActions';

type Props = {};

const Orders = ({}: Props) => {
    const dispatch = useAppDispatch();
    const { business } = useAppSelector((state) => state.business);
    const { orders, loading } = useOrders();
    const { user } = useAppSelector((state) => state.auth);
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

    useEffect(() => {
        if (!orders.length) return;
        dispatch(getCurrentBusiness(orders[0].businessId));
    }, [orders.length]);

    if (loading || !business) return <Loader />;
    if (!user)
        return (
            <Screen center>
                <Text py_8 animation={'fadeInDown'} lobster medium>
                    Please sign in to see your orders.
                </Text>
                <Button
                    title="Sign In"
                    onPress={() =>
                        navigation.navigate('ConsumerProfile', {
                            screen: 'Auth',
                            params: { screen: 'Login' }
                        })
                    }
                />
            </Screen>
        );
    if (!orders.length)
        return (
            <Screen center>
                <Text py_8 animation={'fadeInDown'} lobster medium>
                    Please sign in to see your orders.
                </Text>
                <Button
                    title="Place First Order"
                    onPress={() =>
                        navigation.navigate('ConsumerHome', {
                            screen: 'Businesses'
                        })
                    }
                />
            </Screen>
        );
    return (
        <Screen>
            <Text center lobster capitalize large py_4>
                My orders ({orders.length})
            </Text>
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
