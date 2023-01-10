import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from '../../components/Text';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import { Business } from '../../redux/business/businessSlide';
import { businessCollection } from '../../firebase';
import { useAppSelector } from '../../redux/store';
import Stack from '../Stack';
import { SIZES } from '../../constants';
import { MotiView } from 'moti';
import { STATUS_NAME } from '../../utils/orderStatus';
import moment from 'moment';

type Props = {
    order: Order;
    business: Business;
    onPress: () => void;
};

const DeliveryCard = ({ order, business, onPress }: Props) => {
    const theme = useAppSelector((state) => state.theme);

    return (
        <TouchableOpacity
            style={[
                styles.view,
                {
                    backgroundColor: theme.BACKGROUND_COLOR,
                    shadowColor: theme.SHADOW_COLOR
                }
            ]}
            onPress={onPress}
        >
            <MotiView
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                    type: 'timing',
                    loop:
                        order.status === ORDER_STATUS.marked_ready_for_delivery
                            ? true
                            : false
                }}
            >
                <Stack
                    containerStyle={{ backgroundColor: theme.CARD_BACKGROUND }}
                    center
                >
                    <Text>
                        {moment(order.orderDate).format('MMM DD, hh:mm a')}
                    </Text>
                    <Text bold medium py_4>
                        {business.name}
                    </Text>
                    <Text>{business.address?.split(', ')[0]}</Text>
                    <Text py_4 bold medium>
                        To: {order.address?.street.split(', ')[0]}
                    </Text>
                    <Text>{STATUS_NAME(order.status)}</Text>
                </Stack>
            </MotiView>
        </TouchableOpacity>
    );
};

export default DeliveryCard;

const styles = StyleSheet.create({
    view: {
        shadowOffset: { width: 3, height: 3 },
        elevation: 10,
        shadowOpacity: 0.5,
        overflow: 'hidden',
        shadowRadius: 8,
        borderRadius: SIZES.padding
    }
});
