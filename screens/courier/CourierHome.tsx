import {
    FlatList,
    ListRenderItem,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { onSnapshot, query, where } from 'firebase/firestore';
import { ordersCollection } from '../../firebase';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import { useLocation } from '../../hooks/useLocation';
import Stack from '../../components/Stack';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { updateOrder } from '../../redux/consumer/ordersActions';
import Loader from '../../components/Loader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/Button';
import useNotifications from '../../hooks/useNotifications';
import DeliveryCard from '../../components/courier/DeliveryCard';
import { useBusinessAvailable } from '../../hooks/useBusinessAvailable';
import { CourierStackScreens } from '../../navigation/courier/typing';

type Props = NativeStackScreenProps<CourierStackScreens, 'CourierHome'>;

const CourierHome = ({ navigation }: Props) => {
    useNotifications();
    const { user } = useAppSelector((state) => state.auth);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const { businessAvailable, isLoading } = useBusinessAvailable();

    const [loading, setLoading] = React.useState(true);
    const dispatch = useAppDispatch();
    console.log(orders.length);

    const renderOrders: ListRenderItem<Order> = ({ item }) => {
        return (
            <DeliveryCard
                order={item}
                business={
                    businessAvailable.find((b) => b.id === item.businessId)!
                }
                onPress={() => handleOnPress(item)}
            />
        );
    };

    const handleOnPress = async (order: Order) => {
        try {
            navigation.navigate('DeliveryView', {
                orderId: order.id!
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        const q = query(
            ordersCollection,
            where('status', '==', ORDER_STATUS.marked_ready_for_delivery)
        );
        const sub = onSnapshot(q, (snap) => {
            setOrders(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        setLoading(false);

        return sub;
    }, []);

    if (loading || isLoading) return <Loader />;
    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <Text center lobster large py_4>
                    Orders For Delivery ({orders.length})
                </Text>
                {orders.length > 0 ? (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id!}
                        renderItem={renderOrders}
                    />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20
                        }}
                    >
                        <Stack center>
                            <Text bold>No Orders Available</Text>
                        </Stack>
                    </View>
                )}
            </View>
        </Screen>
    );
};

export default CourierHome;
