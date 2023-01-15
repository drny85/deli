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

type Props = {
    businesses: Business[];
    onPress: (order: Order) => void;
};

const MostRecentOrders = ({ businesses, onPress }: Props) => {
    const { orders } = useOrders();
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
                >
                    <Text
                        lightText
                        bold
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
                </Stack>
            </ImageBackground>
        </TouchableOpacity>
    );
    return (
        <View>
            {orders.filter(
                (o) =>
                    o.status === ORDER_STATUS.delivered ||
                    o.status === ORDER_STATUS.picked_up_by_client
            ).length > 0 && (
                <View style={{ height: 100 }}>
                    <Text lobster medium px_4>
                        Recent Orders
                    </Text>
                    <FlatList
                        horizontal
                        contentContainerStyle={{ padding: SIZES.base }}
                        showsHorizontalScrollIndicator={false}
                        data={orders.filter(
                            (o) => o.status === ORDER_STATUS.delivered
                        )}
                        keyExtractor={(item) => item.id!}
                        renderItem={renderMostRecentOrders}
                    />
                </View>
            )}
        </View>
    );
};

export default MostRecentOrders;
