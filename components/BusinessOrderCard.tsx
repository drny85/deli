import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Text from './Text';
import { Order, ORDER_TYPE } from '../redux/consumer/ordersSlide';
import Stack from './Stack';
import { useAppSelector } from '../redux/store';
import Row from './Row';
import { SIZES } from '../constants';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import { STATUS_NAME } from '../utils/orderStatus';
import { useBusinessOrders } from '../hooks/useBusinessOrders';

type Props = {
    order: Order;
    onPress: () => void;
    orders: Order[];
};

const BusinessOrderCard = ({ order, onPress, orders }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const qty = order.items.reduce((a, b) => a + b.quantity, 0);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    shadowColor: theme.SHADOW_COLOR,
                    backgroundColor: theme.BACKGROUND_COLOR,
                    width: SIZES.isSmallDevice
                        ? '98%'
                        : orders.length === 1
                        ? '98%'
                        : orders.length === 2
                        ? '48%'
                        : '30%'
                }
            ]}
            onPress={onPress}
        >
            <Stack containerStyle={{ width: '100%' }}>
                <Row
                    containerStyle={{
                        width: '100%'
                    }}
                    horizontalAlign="space-between"
                >
                    {order.orderNumber && <Text># {order.orderNumber}</Text>}
                    <Text bold>{qty} Items</Text>
                    <Text bold>${order.total.toFixed(2)}</Text>
                </Row>
                <View>
                    <Text py_4>To: {order.address?.street.split(', ')[0]}</Text>
                    <Text>{moment(order.orderDate).format('lll')}</Text>
                    <Text center bold py_4>
                        {STATUS_NAME(order.status)}
                    </Text>
                </View>
            </Stack>
        </TouchableOpacity>
    );
};

export default BusinessOrderCard;

const styles = StyleSheet.create({
    container: {
        elevation: 4,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        borderRadius: SIZES.base,
        margin: SIZES.base
    }
});
