import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from './Text';
import { Order } from '../redux/consumer/ordersSlide';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import moment from 'moment';

type Props = {
    order: Order;
    onPress: () => void;
};

const OrderListItem = ({ order, onPress }: Props) => {
    const theme = useAppSelector((state) => state.theme);
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
            <Text small>
                Placed On: {moment(order.orderDate).format('lll')}
            </Text>
            <Text>{order.total}</Text>
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
