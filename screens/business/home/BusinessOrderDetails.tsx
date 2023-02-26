import { Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessHomeStackScreens } from '../../../navigation/business/typing';
import Header from '../../../components/Header';
import Stack from '../../../components/Stack';
import Loader from '../../../components/Loader';
import { useOrder } from '../../../hooks/useOrder';
import Row from '../../../components/Row';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { SIZES } from '../../../constants';
import ProductListItem from '../../../components/ProductListItem';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import { STATUS_NAME } from '../../../utils/orderStatus';
import {
    Order,
    ORDER_STATUS,
    ORDER_TYPE
} from '../../../redux/consumer/ordersSlide';
import { FontAwesome } from '@expo/vector-icons';
import RadioButton from '../../../components/RadioButton';
import { updateOrder } from '../../../redux/consumer/ordersActions';
import { AnimatePresence, MotiView } from 'moti';

import { createRefund } from '../../../firebase';
import moment from 'moment';

import CourierCard from '../../../components/courier/CourierCard';
import { Courier } from '../../../types';

type Props = NativeStackScreenProps<
    BusinessHomeStackScreens,
    'BusinessOrderDetails'
>;

const BusinessOrderDetails = ({
    navigation,
    route: {
        params: { orderId }
    }
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [visible, setVisible] = React.useState(false);
    const { loading, order } = useOrder(orderId);
    const [updating, setUpdating] = React.useState(false);
    const [newStatus, setNewStatus] = React.useState<ORDER_STATUS>();
    const qty = order?.items?.reduce((acc, item) => acc + item.quantity, 0);

    const confirmStatusChange = async () => {
        try {
            if (order?.status === newStatus) return;

            if (
                order?.status === ORDER_STATUS.accepted_by_driver ||
                order?.status === ORDER_STATUS.marked_ready_for_delivery ||
                order?.status === ORDER_STATUS.marked_ready_for_pickup ||
                order?.status === ORDER_STATUS.picked_up_by_driver
            ) {
                if (newStatus === ORDER_STATUS.cancelled) {
                    Alert.alert('Error', 'Order cannot be cancelled');
                    return;
                }
            }
            Alert.alert(
                'Status Change',
                `New Status is ${STATUS_NAME(newStatus!)}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Confirm',
                        onPress:
                            newStatus !== ORDER_STATUS.cancelled
                                ? handleUpdateOrderStatus
                                : handleRefund
                    }
                ]
            );
        } catch (error) {
            console.log('Error changing order status', error);
        }
    };

    const handleUpdateOrderStatus = async () => {
        try {
            if (!order) return;
            const newOrder: Order = {
                ...order,
                status: newStatus ? newStatus : order?.status,
                pickedUpOn:
                    newStatus === ORDER_STATUS.picked_up_by_client
                        ? new Date().toISOString()
                        : null,
                deliveredBy:
                    newStatus === ORDER_STATUS.delivered
                        ? (user as Courier)
                        : null
            };
            setUpdating(true);
            const { payload } = await dispatch(updateOrder(newOrder));
            if (payload) {
                setVisible(false);
            }
        } catch (error) {
            console.log('Error changing order status', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleRefund = async () => {
        try {
            console.log(order?.paymentIntent, order?.transferId, order?.id);
            if (!order?.paymentIntent || !order.transferId) return;

            const func = createRefund('createRefund');
            const respond = await func({
                payment_intent: order.paymentIntent,
                transferId: order.transferId
            });

            if (respond.data.success) {
                const newOrder: Order = {
                    ...order,
                    status: ORDER_STATUS.cancelled
                };
                await dispatch(updateOrder(newOrder));

                setVisible(false);
            }
        } catch (error) {
            const err = error as any;
            console.log(err.message);
        }
    };

    useEffect(() => {
        if (!order) return;
        setNewStatus(order.status);
    }, [order]);
    if (loading || !order) return <Loader />;
    return (
        <Screen>
            <Header
                title="Order Details"
                onPressBack={() => {
                    navigation.goBack();
                }}
            />
            <Stack
                center
                containerStyle={{
                    width: '100%',
                    shadowOffset: { width: 3, height: 3 },
                    shadowColor: theme.SHADOW_COLOR,
                    shadowOpacity: 0.6,
                    shadowRadius: 3,
                    backgroundColor: theme.CARD_BACKGROUND,
                    borderRadius: SIZES.base
                }}
            >
                <Text pb_6 center bold medium>
                    Order Date {moment(order.orderDate).format('lll')}
                </Text>
                <Row
                    containerStyle={{ width: '100%' }}
                    horizontalAlign="space-between"
                    verticalAlign="flex-start"
                >
                    <View>
                        <Text bold>Customer</Text>
                        <Text>
                            {order?.contactPerson.name}{' '}
                            {order?.contactPerson.lastName}
                        </Text>
                        <Text>Phone: {order?.contactPerson.phone}</Text>
                    </View>
                    {order.orderType === ORDER_TYPE.delivery ? (
                        <View>
                            <Text bold>Delivery Address</Text>
                            <Text>{order?.address?.street.slice(0, -7)}</Text>
                            {order.address?.apt && (
                                <Text>APT: {order.address.apt}</Text>
                            )}
                            {order?.deliveryInstructions && (
                                <>
                                    <Text py_4 bold>
                                        Delivery Instructions
                                    </Text>
                                    <Text>{order.deliveryInstructions}</Text>
                                </>
                            )}
                        </View>
                    ) : (
                        <View>
                            <Text bold>Pick Up Order</Text>
                            <Text caption py_4>
                                Order was already paid
                            </Text>
                            <Text bold>DO NOT charge the customer again</Text>
                        </View>
                    )}
                </Row>
            </Stack>
            <AnimatePresence>
                {order.courier && order.status !== ORDER_STATUS.delivered ? (
                    <MotiView
                        style={{
                            width: SIZES.width * 0.5,
                            alignSelf: 'center'
                        }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                    >
                        <Stack center>
                            <Text center raleway_bold>
                                Courier
                            </Text>
                            <CourierCard
                                courier={order.courier}
                                phone={order.courier.phone!}
                            />
                        </Stack>
                    </MotiView>
                ) : order.deliveredBy ? (
                    <MotiView
                        style={{
                            width: SIZES.width * 0.5,
                            alignSelf: 'center'
                        }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                    >
                        <Stack center>
                            <Text center raleway_bold>
                                Courier
                            </Text>
                            <CourierCard
                                courier={order.deliveredBy as Courier}
                                phone={order.deliveredBy.phone!}
                            />
                        </Stack>
                    </MotiView>
                ) : null}
            </AnimatePresence>
            <View
                style={{
                    alignSelf: 'center',
                    width: '50%',
                    marginVertical: SIZES.padding
                }}
            >
                <Text center bold py_4>
                    STATUS : {STATUS_NAME(order.status)}
                </Text>
                {order.status === ORDER_STATUS.delivered && (
                    <Text center caption py_2>
                        Delivered on {moment(order.deliveredOn).format('lll')}
                    </Text>
                )}
                <Button
                    isLoading={updating}
                    disabled={
                        updating ||
                        order.status === ORDER_STATUS.delivered ||
                        order.status === ORDER_STATUS.picked_up_by_client ||
                        order.status === ORDER_STATUS.cancelled
                    }
                    title="Update Status"
                    onPress={() => {
                        setVisible(true);
                    }}
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: SIZES.padding }}
            >
                <Row
                    horizontalAlign="space-around"
                    containerStyle={{ alignSelf: 'center', width: '70%' }}
                >
                    <Text bold>Order # {order.orderNumber}</Text>
                    <Text medium bold>
                        Items ({qty})
                    </Text>
                </Row>
                <Divider small />
                {order.items.map((item, index) => (
                    <ProductListItem
                        key={index.toString()}
                        item={item}
                        index={index}
                    />
                ))}
            </ScrollView>
            <Stack>
                <Row
                    containerStyle={{ width: '100%' }}
                    horizontalAlign="space-between"
                >
                    <Text capitalize>Sub Total</Text>
                    <Text capitalize>${order.total.toFixed(2)}</Text>
                </Row>
                {order.orderType === ORDER_TYPE.delivery && (
                    <Row
                        containerStyle={{ width: '100%' }}
                        horizontalAlign="space-between"
                    >
                        <Text py_4 capitalize>
                            Tip for Courier
                        </Text>
                        <Text capitalize>${order.tip?.amount.toFixed(2)}</Text>
                    </Row>
                )}

                <Divider small />
                <Row
                    containerStyle={{ width: '100%' }}
                    horizontalAlign="space-between"
                >
                    <Text py_4 bold large capitalize>
                        Total
                    </Text>
                    <Text bold large capitalize>
                        ${order.total.toFixed(2)}
                    </Text>
                </Row>
            </Stack>
            <Modal visible={visible} presentationStyle="formSheet">
                <View
                    style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}
                >
                    <Header
                        title="Change Status"
                        onPressBack={() => setVisible(false)}
                        rightIcon={
                            <View>
                                <TouchableOpacity
                                    onPress={confirmStatusChange}
                                    style={{
                                        paddingHorizontal: SIZES.padding,
                                        paddingVertical: SIZES.base,
                                        margin: SIZES.base,
                                        borderRadius: SIZES.base,
                                        borderWidth: 0.5,
                                        borderColor: theme.ASCENT
                                    }}
                                >
                                    <Row>
                                        <Text px_4 bold>
                                            SAVE
                                        </Text>
                                        <FontAwesome
                                            name="save"
                                            size={24}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </Row>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',

                            flexGrow: 1
                        }}
                    >
                        <Text bold medium>
                            Status : {STATUS_NAME(order.status)}
                        </Text>
                        <Stack>
                            {Object.values(ORDER_STATUS).map(
                                (status, index) => {
                                    if (
                                        order.orderType === ORDER_TYPE.delivery
                                    ) {
                                        if (
                                            status === ORDER_STATUS.new ||
                                            status === ORDER_STATUS.all ||
                                            status ===
                                                ORDER_STATUS.marked_ready_for_pickup ||
                                            status ===
                                                ORDER_STATUS.accepted_by_driver ||
                                            status ===
                                                ORDER_STATUS.picked_up_by_driver ||
                                            status ===
                                                ORDER_STATUS.picked_up_by_client ||
                                            status === ORDER_STATUS.delivered
                                        )
                                            return;
                                    }

                                    if (order.orderType === ORDER_TYPE.pickup) {
                                        if (
                                            status === ORDER_STATUS.delivered ||
                                            status === ORDER_STATUS.new ||
                                            status === ORDER_STATUS.all ||
                                            status ===
                                                ORDER_STATUS.picked_up_by_driver ||
                                            status ===
                                                ORDER_STATUS.accepted_by_driver ||
                                            status ===
                                                ORDER_STATUS.marked_ready_for_delivery
                                        )
                                            return;
                                    }
                                    return (
                                        <RadioButton
                                            key={index}
                                            status={status}
                                            selected={newStatus === status}
                                            onPress={() => {
                                                setNewStatus(status);
                                            }}
                                        />
                                    );
                                }
                            )}
                        </Stack>
                    </View>
                </View>
            </Modal>
        </Screen>
    );
};

export default BusinessOrderDetails;
