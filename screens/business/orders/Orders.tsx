import { FlatList, ListRenderItem, Pressable, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import ProductsList from '../../../components/ProductsList';
import { useCategoriesAndProducts } from '../../../hooks/useCategoriesAndProducts';
import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import Loader from '../../../components/Loader';
import { Order, ORDER_STATUS } from '../../../redux/consumer/ordersSlide';
import moment from 'moment';
import { SIZES } from '../../../constants';
import BusinessOrderCard from '../../../components/BusinessOrderCard';
import { useNavigation } from '@react-navigation/native';
import { STATUS_NAME } from '../../../utils/orderStatus';
import Row from '../../../components/Row';
import { MotiView } from 'moti';
import { useAppSelector } from '../../../redux/store';

type Props = {};

const Orders = ({}: Props) => {
    const navigation = useNavigation();
    const { loading, orders } = useBusinessOrders();
    const theme = useAppSelector((state) => state.theme);
    const [status, setStatus] = useState<ORDER_STATUS>(ORDER_STATUS.all);
    const [from, setFrom] = useState<string>(new Date().toISOString());
    const [filteredOrders, setFilteredOrders] = React.useState<Order[]>([]);

    const renderOrders: ListRenderItem<Order> = ({ item, index }) => {
        return (
            <BusinessOrderCard
                orders={filteredOrders}
                order={item}
                onPress={() => {
                    navigation.navigate('BusinessOrders', {
                        screen: 'BusinessOrderDetails',
                        params: { orderId: item.id! }
                    });
                }}
            />
        );
    };

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders.length]);

    if (loading) return <Loader />;
    return (
        <Screen>
            <View style={{ padding: 10 }}>
                <Row horizontalAlign="space-evenly">
                    {Object.values(ORDER_STATUS).map((s) => {
                        if (
                            s === ORDER_STATUS.marked_ready_for_pickup ||
                            s === ORDER_STATUS.cancelled ||
                            s === ORDER_STATUS.picked_up_by_driver ||
                            s == ORDER_STATUS.accepted_by_driver
                        )
                            return;
                        return (
                            <Pressable
                                key={s}
                                onPress={() => {
                                    setStatus(s);
                                    if (s === ORDER_STATUS.all) {
                                        setFilteredOrders(orders);
                                    } else {
                                        setFilteredOrders(
                                            orders.filter((o) => o.status === s)
                                        );
                                    }
                                }}
                            >
                                <MotiView
                                    style={{
                                        borderWidth: 0,
                                        minWidth: 80,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderBottomWidth: 2,
                                        paddingVertical: SIZES.base
                                    }}
                                    from={{ borderColor: theme.SHADOW_COLOR }}
                                    animate={{
                                        borderWidth: 0,
                                        borderBottomWidth: status === s ? 4 : 2,
                                        borderColor:
                                            status === s
                                                ? theme.ASCENT
                                                : theme.SHADOW_COLOR
                                    }}
                                >
                                    <Text capitalize bold={s === status}>
                                        {STATUS_NAME(s)}
                                    </Text>
                                </MotiView>
                            </Pressable>
                        );
                    })}
                </Row>
            </View>
            <Text title center py_6>
                Orders {filteredOrders.length}
            </Text>
            <FlatList
                contentContainerStyle={{
                    width: '100%'
                }}
                showsVerticalScrollIndicator={false}
                numColumns={SIZES.isSmallDevice ? 1 : 3}
                data={filteredOrders.sort((a, b) =>
                    b.orderDate.localeCompare(a.orderDate)
                )}
                keyExtractor={(item) => item.id!}
                renderItem={renderOrders}
            />
        </Screen>
    );
};

export default Orders;
