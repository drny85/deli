import {
    FlatList,
    ImageBackground,
    ListRenderItem,
    TouchableOpacity,
    View
} from 'react-native';
import React from 'react';

import Text from './Text';

import { SIZES } from '../constants';
import Stack from './Stack';
import { Order, ORDER_STATUS } from '../redux/consumer/ordersSlide';
import { Business } from '../redux/business/businessSlide';
import { useOrders } from '../hooks/useOrders';
import Row from './Row';

type Props = {
    businesses: Business[];
    onPress: (order: Order) => void;
};

const MostRecentOrders = ({ businesses, onPress }: Props) => {
    const { orders } = useOrders();
    const filtered = orders;
    const renderMostRecentOrders: ListRenderItem<Order> = ({ item }) => (
        <TouchableOpacity
            style={{
                height: '100%',
                width: SIZES.width * 0.4,
                borderRadius: SIZES.radius,
                overflow: 'hidden',
                marginHorizontal: SIZES.base
            }}
            onPress={() => onPress(item)}
        >
            <ImageBackground
                source={{ uri: item.items[0].image! }}
                style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                resizeMode="cover"
            >
                <Stack
                    py={4}
                    containerStyle={{
                        backgroundColor: '#21212170',
                        opacity: 0.8,
                        borderRadius: SIZES.radius
                    }}
                    center
                >
                    <Text
                        lightText
                        lobster
                        medium
                        center
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {
                            businesses.find(
                                (b) => b.id === item.items[0].businessId
                            )?.name
                        }
                    </Text>
                    <Row
                        containerStyle={{ width: '100%' }}
                        horizontalAlign="space-evenly"
                    >
                        <Text lightText bold small>
                            {item.items.reduce(
                                (acc, sum) => sum.quantity + acc,
                                0
                            )}{' '}
                            {item.items.reduce(
                                (acc, sum) => sum.quantity + acc,
                                0
                            ) > 1
                                ? 'items'
                                : 'item'}
                        </Text>
                        <Text lightText bold small>
                            ${item.total.toFixed(2)}
                        </Text>
                    </Row>
                </Stack>
            </ImageBackground>
        </TouchableOpacity>
    );
    return (
        <View>
            {filtered.length > 0 && (
                <View style={{ height: 100 }}>
                    <Text lobster medium px_4>
                        Recent Orders
                    </Text>
                    <FlatList
                        horizontal
                        contentContainerStyle={{ padding: SIZES.base }}
                        showsHorizontalScrollIndicator={false}
                        data={filtered}
                        keyExtractor={(item) => item.id!}
                        renderItem={renderMostRecentOrders}
                    />
                </View>
            )}
        </View>
    );
};

export default MostRecentOrders;
