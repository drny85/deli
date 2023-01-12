import { Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOrdersStackScreens } from '../../../navigation/business/typing';
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
import { Order, ORDER_STATUS } from '../../../redux/consumer/ordersSlide';
import { FontAwesome } from '@expo/vector-icons';
import RadioButton from '../../../components/RadioButton';
import { updateOrder } from '../../../redux/consumer/ordersActions';
import { AnimatePresence, MotiView } from 'moti';
import Communications from 'react-native-communications';

type Props = NativeStackScreenProps<
    BusinessOrdersStackScreens,
    'BusinessOrderDetails'
>;

const BusinessOrderDetails = ({
    navigation,
    route: {
        params: { orderId }
    }
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const [visible, setVisible] = React.useState(false);
    const { loading, order } = useOrder(orderId);
    const [updating, setUpdating] = React.useState(false);
    const [newStatus, setNewStatus] = React.useState<ORDER_STATUS>();
    const qty = order?.items?.reduce((acc, item) => acc + item.quantity, 0);

    const makeCall = async (phone: string) => {
        try {
            Communications.phonecall(phone.replace(/-/g, ''), true);
        } catch (error) {
            console.log(error);
        }
    };

    const confirmStatusChange = async () => {
        try {
            if (order?.status === newStatus) return;
            Alert.alert(
                'Status Change',
                `New Status is ${STATUS_NAME(newStatus!)}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Confirm', onPress: handleUpdateOrderStatus }
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
                status: newStatus ? newStatus : order?.status
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
                    <View>
                        <Text bold>Delivery Address</Text>
                        <Text>{order?.address?.street}</Text>
                        {order.address?.apt && (
                            <Text>APT: {order.address.apt}</Text>
                        )}
                        {order?.deliveryInstructions && (
                            <>
                                <Text py_4 bold>
                                    Delivery Intructions
                                </Text>
                                <Text>{order.deliveryInstructions}</Text>
                            </>
                        )}
                    </View>
                </Row>
            </Stack>
            <AnimatePresence>
                {order.courier && (
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                    >
                        <Stack>
                            <Text bold>Courier</Text>
                            <Text py_4>
                                {order.courier.name} {order.courier.lastName}
                            </Text>
                            <TouchableOpacity
                                onPress={() => makeCall(order.courier?.phone!)}
                            >
                                <Text style={{ color: 'blue' }}>
                                    {order.courier.phone}
                                </Text>
                            </TouchableOpacity>
                        </Stack>
                    </MotiView>
                )}
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
                <Button
                    isLoading={updating}
                    disabled={updating}
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
                        themeTextColor
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
                    <Text darkText capitalize>
                        Sub Total
                    </Text>
                    <Text darkText capitalize>
                        ${order.total.toFixed(2)}
                    </Text>
                </Row>

                <Divider small />
                <Row
                    containerStyle={{ width: '100%' }}
                    horizontalAlign="space-between"
                >
                    <Text py_4 darkText bold large capitalize>
                        Total
                    </Text>
                    <Text darkText bold large capitalize>
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
                            {Object.values(ORDER_STATUS).map((status) => {
                                if (
                                    status === ORDER_STATUS.new ||
                                    status === ORDER_STATUS.all ||
                                    status ===
                                        ORDER_STATUS.accepted_by_driver ||
                                    status === ORDER_STATUS.picked_up_by_driver
                                )
                                    return;
                                return (
                                    <Row key={status}>
                                        <RadioButton
                                            selected={newStatus === status}
                                            onPress={() => {
                                                setNewStatus(status);
                                            }}
                                        />
                                        <Text bold={status === newStatus} px_4>
                                            {STATUS_NAME(status)}
                                        </Text>
                                    </Row>
                                );
                            })}
                        </Stack>
                    </View>
                </View>
            </Modal>
        </Screen>
    );
};

export default BusinessOrderDetails;