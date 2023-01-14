import { FlatList, ListRenderItem } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';

import { PREVIOUS_ROUTE } from '../../../constants';
import { useAppSelector } from '../../../redux/store';
import { useOrders } from '../../../hooks/useOrders';
import Loader from '../../../components/Loader';
import { Order } from '../../../redux/consumer/ordersSlide';
import OrderListItem from '../../../components/OrderListItem';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/Button';

import moment from 'moment';
import { isTherePreviousRoute } from '../../../utils/checkForPreviousRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerOrdersStackScreens } from '../../../navigation/consumer/typing';

type Props = NativeStackScreenProps<ConsumerOrdersStackScreens, 'Orders'>;

const Orders = ({ route: { params } }: Props) => {
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

    const isPrevious = async () => {
        try {
            const { success } = await isTherePreviousRoute();
            if (!success) return;
            await AsyncStorage.removeItem(PREVIOUS_ROUTE);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!params) return;
        if (params.orderId) {
            navigation.navigate('ConsumerOrders', {
                screen: 'OrderDetails',
                params: { orderId: params.orderId }
            });
        }
    }, [params]);

    useEffect(() => {
        isPrevious();
    }, []);

    if (!user)
        return (
            <Screen center>
                <Text py_8 animation={'fadeInDown'} lobster medium>
                    Please sign in to see your orders.
                </Text>
                <Button
                    title="Sign In"
                    onPress={async () => {
                        await AsyncStorage.setItem(PREVIOUS_ROUTE, 'Orders');
                        navigation.navigate('ConsumerProfile', {
                            screen: 'Auth',
                            params: { screen: 'Login' }
                        });
                    }}
                />
            </Screen>
        );
    if (orders.length === 0 && !loading)
        return (
            <Screen center>
                <Text py_8 animation={'fadeInDown'} lobster medium>
                    You dont have any orders yet.
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

    if (loading) return <Loader />;

    return (
        <Screen>
            <Text center lobster capitalize large py_4>
                My orders ({orders.length})
            </Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ width: '100%' }}
                data={orders.sort((a, b) =>
                    moment(a.orderDate).isBefore(b.orderDate) ? 1 : -1
                )}
                keyExtractor={(item) => item.id!}
                renderItem={renderOrders}
            />
        </Screen>
    );
};

export default Orders;
