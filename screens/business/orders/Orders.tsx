import { FlatList, ListRenderItem, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import ProductsList from '../../../components/ProductsList';
import { useCategoriesAndProducts } from '../../../hooks/useCategoriesAndProducts';
import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import Loader from '../../../components/Loader';
import { Order } from '../../../redux/consumer/ordersSlide';
import moment from 'moment';
import { SIZES } from '../../../constants';

type Props = {};

const Orders = ({}: Props) => {
    const { categories, products } = useCategoriesAndProducts();
    const { loading, orders } = useBusinessOrders();
    const [from, setFrom] = useState<string>(new Date().toISOString());
    const [filteredOrders, setFilteredOrders] = React.useState<Order[]>([]);

    const renderOrders: ListRenderItem<Order> = ({ item, index }) => {
        return (
            <View>
                <Text>{item.total}</Text>
                <Text>{moment(item.orderDate).format('lll')}</Text>
            </View>
        );
    };

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders.length]);

    if (loading) return <Loader />;
    return (
        <Screen>
            <Text title center>
                Orders {filteredOrders.length}
            </Text>
            <FlatList
                numColumns={SIZES.isSmallDevice ? 1 : 3}
                data={filteredOrders}
                keyExtractor={(item) => item.id!}
                renderItem={renderOrders}
            />
        </Screen>
    );
};

export default Orders;
