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
import Row from '../Row';
import Divider from '../Divider';

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
                    containerStyle={{
                        backgroundColor: theme.CARD_BACKGROUND,
                        width: '100%'
                    }}
                >
                    <Row
                        containerStyle={{ width: '100%' }}
                        horizontalAlign="space-evenly"
                    >
                        <Text bold>
                            {moment(order.orderDate).format('MMM DD, hh:mm a')}
                        </Text>
                        <Text bold>${order.total.toFixed(2)}</Text>
                    </Row>
                    <Divider />
                    <Stack center>
                        <Row horizontalAlign="space-between">
                            <Text px_6>Pick up At </Text>
                            <View>
                                <Text bold py_4>
                                    {business.name}
                                </Text>
                                <Text>{business.address?.split(', ')[0]}</Text>
                            </View>
                        </Row>
                        <Row>
                            <Text px_6>Deliver To</Text>
                            <View>
                                <Text bold py_4>
                                    {business.name}
                                </Text>
                                <Text>
                                    {order.address?.street.split(', ')[0]}
                                </Text>
                            </View>
                        </Row>
                    </Stack>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        <Text center py_6 bold>
                            {STATUS_NAME(order.status)}
                        </Text>
                    </View>
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
        borderRadius: SIZES.padding,
        marginVertical: SIZES.base
    }
});
