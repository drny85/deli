import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from './Text';
import {
    Order,
    ORDER_STATUS,
    saveDeliveryAddress
} from '../redux/consumer/ordersSlide';
import { IMAGE_PLACEHOLDER, SIZES } from '../constants';
import { useAppDispatch, useAppSelector } from '../redux/store';
import moment from 'moment';
import Row from './Row';

import Button from './Button';

import { stripeFee } from '../utils/stripeFee';

import { useNavigation } from '@react-navigation/native';
import { useBusinessAvailable } from '../hooks/useBusinessAvailable';

import { STATUS_NAME } from '../utils/orderStatus';
import Loader from './Loader';
import { resetCart } from '../utils/saveCart';
import { setCart } from '../redux/consumer/cartSlide';
import { osVersion } from 'expo-device';

type Props = {
    order: Order;
    onPress: () => void;
};

const OrderListItem = ({ order, onPress }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { businessAvailable, isLoading } = useBusinessAvailable();
    const { items } = useAppSelector((state) => state.cart);

    const qty = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const business = businessAvailable.find(
        (business) => business.id === order.businessId
    );

    const reOrder = (order: Order) => {
        if (items.length > 0) {
            Alert.alert(
                'Items In Cart',
                'You have some items in the cart, Do you want to replace them with this order?',
                [
                    { text: 'No', style: 'cancel' },
                    {
                        text: 'Yes, Replace',
                        style: 'destructive',
                        onPress: () => AddNewItemsToCart(order)
                    }
                ]
            );
        } else {
            AddNewItemsToCart(order);
        }
    };

    const AddNewItemsToCart = async (order: Order) => {
        try {
            if (!order) return;
            const { items, total } = order;
            await resetCart();
            dispatch(saveDeliveryAddress({ ...order.address! }));
            dispatch(setCart({ items: items, quantity: qty, total: total }));
            navigation.navigate('ConsumerCart', { screen: 'OrderReview' });
        } catch (error) {
            console.log(error);
        }
    };

    //if (!businessAvailable.length) return <Loader />;
    if (isLoading) return <Loader />;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: theme.BACKGROUND_COLOR,
                    shadowColor: theme.SHADOW_COLOR
                }
            ]}
        >
            <Row
                containerStyle={{ width: '100%' }}
                horizontalAlign="space-between"
            >
                <Image
                    resizeMode="cover"
                    source={{
                        uri: business?.image
                            ? business.image
                            : IMAGE_PLACEHOLDER
                    }}
                    style={{ height: '100%', width: '20%' }}
                />
                <Row
                    containerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: SIZES.base
                    }}
                    horizontalAlign="space-between"
                >
                    <View>
                        <Text py_4 bold numberOfLines={1} ellipsizeMode="tail">
                            {business?.name}
                        </Text>
                        <Text>
                            Items {qty} - $
                            {(order.total + stripeFee(order.total)).toFixed(2)}
                        </Text>
                        <Text capitalize>
                            {moment(order.orderDate).format('MMM DD')} - {''}
                            {STATUS_NAME(order.status)}
                        </Text>
                    </View>
                    <View>
                        <Button
                            small
                            outlined
                            title={
                                order.status === ORDER_STATUS.delivered
                                    ? 'Re-Order'
                                    : 'View'
                            }
                            onPress={() => {
                                if (order.status !== ORDER_STATUS.delivered) {
                                    navigation.navigate('ConsumerOrders', {
                                        screen: 'OrderDetails',
                                        params: { orderId: order.id! }
                                    });
                                } else if (
                                    order.status === ORDER_STATUS.delivered
                                ) {
                                    reOrder(order);
                                }
                            }}
                        />
                    </View>
                </Row>
            </Row>
        </TouchableOpacity>
    );
};

export default OrderListItem;

const styles = StyleSheet.create({
    container: {
        padding: SIZES.base,
        marginVertical: SIZES.base,
        shadowOffset: { width: 3, height: 3 },
        elevation: 4,
        width: '100%',

        shadowOpacity: 0.5,
        shadowRadius: 5
    }
});
