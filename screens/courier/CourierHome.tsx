import { ScrollView, TouchableOpacity, View } from 'react-native';
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
import { CourierHomeStackScreens } from '../../navigation/courier/typing';
import Button from '../../components/Button';

type Props = NativeStackScreenProps<CourierHomeStackScreens, 'CourierHome'>;

const CourierHome = ({ navigation }: Props) => {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [acceptedOrders, setAcceptedOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);
    const dispatch = useAppDispatch();

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
            where('status', '==', ORDER_STATUS.picked_up_by_driver)
        );
        const sub = onSnapshot(q, (snap) => {
            setAcceptedOrders(
                snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        });
        setLoading(false);

        return sub;
    }, []);

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

    if (loading) return <Loader />;
    return (
        <Screen>
            <Stack>
                <Button
                    title="My Deliveries"
                    onPress={() => navigation.navigate('MyDeliveries')}
                />
            </Stack>
            <View style={{ height: '45%' }}>
                <ScrollView>
                    {acceptedOrders.map((order) => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleOnPress(order)}
                                key={order.id}
                            >
                                <Stack>
                                    <Text>{order.total}</Text>
                                </Stack>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            <View style={{ height: '45%' }}>
                <ScrollView>
                    {orders.map((order) => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleOnPress(order)}
                                key={order.id}
                            >
                                <Stack>
                                    <Text>{order.total}</Text>
                                </Stack>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </Screen>
    );
};

export default CourierHome;
