import {
    FlatList,
    ListRenderItem,
    Pressable,
    TouchableOpacity,
    View
} from 'react-native';
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
import BusinessOrderCard from '../../../components/business/BusinessOrderCard';
import { useNavigation } from '@react-navigation/native';
import { STATUS_NAME } from '../../../utils/orderStatus';
import Row from '../../../components/Row';
import { MotiView } from 'moti';
import { useAppSelector } from '../../../redux/store';
import Stack from '../../../components/Stack';
import { FontAwesome } from '@expo/vector-icons';

type Props = {};

const Orders = ({}: Props) => {
    const navigation = useNavigation();
    const { loading, orders } = useBusinessOrders();
    const theme = useAppSelector((state) => state.theme);
    const [status, setStatus] = useState<ORDER_STATUS>(ORDER_STATUS.all);
    const [from, setFrom] = useState(moment().format('ll'));
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
        if (status === ORDER_STATUS.all) {
            setFilteredOrders(
                orders.filter((o) =>
                    moment(o.orderDate)
                        .startOf('day')
                        .isSame(moment(from).startOf('day'))
                )
            );

            return;
        }
        setFilteredOrders(
            orders.filter(
                (o) =>
                    moment(o.orderDate)
                        .startOf('day')
                        .isSame(moment(from).startOf('day')) &&
                    o.status === status
            )
        );
    }, [orders, from, status]);

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
                            s == ORDER_STATUS.accepted_by_driver ||
                            s == ORDER_STATUS.picked_up_by_client
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
                                            orders.filter(
                                                (o) =>
                                                    o.status === s &&
                                                    moment(o.orderDate)
                                                        .startOf('day')
                                                        .isSame(
                                                            moment(
                                                                from
                                                            ).startOf('day')
                                                        )
                                            )
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
            <Stack center>
                <Row
                    containerStyle={{ width: '50%' }}
                    horizontalAlign="space-between"
                >
                    <TouchableOpacity
                        onPress={() => {
                            setFrom(
                                moment(from).subtract(1, 'day').toISOString()
                            );
                        }}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={24}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFrom(moment().toISOString())}
                    >
                        <Text
                            bold={moment(from)
                                .startOf('day')
                                .isSame(moment().startOf('day'))}
                        >
                            {moment(from)
                                .startOf('day')
                                .isSame(moment().startOf('day'))
                                ? 'Today'
                                : moment(from).format('ll')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setFrom((prev) => {
                                if (
                                    moment(prev)
                                        .startOf('day')
                                        .isSame(moment().startOf('day'))
                                )
                                    return moment().toISOString();
                                return moment(from).add(1, 'day').toISOString();
                            });
                        }}
                    >
                        <FontAwesome
                            name="chevron-right"
                            size={24}
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                </Row>
            </Stack>
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
