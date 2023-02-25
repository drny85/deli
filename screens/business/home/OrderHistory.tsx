import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../../redux/store';
import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import Loader from '../../../components/Loader';
import { Order } from '../../../redux/consumer/ordersSlide';
import { Theme } from '../../../types';
import Row from '../../../components/Row';
import { SIZES } from '../../../constants';

type Props = {};

const BusinessOrderListItem = ({
    order,
    theme
}: {
    order: Order;
    theme: Theme;
}) => {
    return (
        <TouchableOpacity
            style={{
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 6,
                elevation: 6,
                shadowColor: theme.SHADOW_COLOR,
                backgroundColor: theme.BACKGROUND_COLOR,
                padding: SIZES.padding
            }}
        >
            <Row horizontalAlign="space-between">
                <View style={{ alignItems: 'flex-start', flexGrow: 1 }}>
                    <Text>
                        Customer : {order.contactPerson.name}{' '}
                        {order.contactPerson.lastName}
                    </Text>
                    <Text left>
                        Address : {order.address?.street.slice(0, -13)}{' '}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-start', flexGrow: 1 }}>
                    <Text left>Total ${order.total}</Text>
                    <Text left>
                        Items {order.items.reduce((a, b) => a + b.quantity, 0)}
                    </Text>
                </View>
            </Row>
        </TouchableOpacity>
    );
};

const OrderHistory = (props: Props) => {
    const navigation = useNavigation();
    const theme = useAppSelector((state) => state.theme);
    const { orders, loading } = useBusinessOrders();

    const renderOrders: ListRenderItem<Order> = ({ item }) => {
        return <BusinessOrderListItem order={item} theme={theme} />;
    };
    if (loading) return <Loader />;
    return (
        <Screen>
            <Header
                onPressBack={() => navigation.goBack()}
                title={'Orders History'}
                rightIcon={
                    <TouchableOpacity style={{ paddingRight: 12 }}>
                        <FontAwesome
                            name="filter"
                            color={theme.TEXT_COLOR}
                            size={24}
                        />
                    </TouchableOpacity>
                }
            />

            <View style={{ flex: 1 }}>
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderOrders}
                />
            </View>
        </Screen>
    );
};

export default OrderHistory;
