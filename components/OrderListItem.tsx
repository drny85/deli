import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from './Text';
import { Order, ORDER_STATUS } from '../redux/consumer/ordersSlide';
import { IMAGE_PLACEHOLDER, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import moment from 'moment';
import Row from './Row';

import { Business } from '../redux/business/businessSlide';
import Button from './Button';
import Stack from './Stack';
import { stripeFee } from '../utils/stripeFee';

type Props = {
    order: Order;

    onPress: () => void;
};

const OrderListItem = ({ order, onPress }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { business } = useAppSelector((state) => state.business);
    const qty = order.items.reduce((sum, item) => sum + item.quantity, 0);

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
                <View>
                    <Text py_4 bold numberOfLines={1} ellipsizeMode="tail">
                        {business?.name}
                    </Text>
                    <Text>
                        Items {qty} - $
                        {(order.total + stripeFee(order.total)).toFixed(2)}
                    </Text>
                    <Text capitalize>
                        {moment(order.orderDate).format('MMM d')}-{' '}
                        {order.status}
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
                        onPress={() => {}}
                    />
                </View>
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
