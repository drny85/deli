import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import Header from '../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CourierHomeStackScreens } from '../../navigation/courier/typing';
import { ordersCollection } from '../../firebase';
import { onSnapshot, query, where } from 'firebase/firestore';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import Stack from '../../components/Stack';
import Loader from '../../components/Loader';
import { useAppSelector } from '../../redux/store';

type Props = NativeStackScreenProps<CourierHomeStackScreens, 'MyDeliveries'>;

const MyDeliveries = ({ navigation }: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);
    useEffect(() => {
        const q = query(
            ordersCollection,
            // where('status', '==', ORDER_STATUS.marked_ready_for_delivery),
            where('status', '==', ORDER_STATUS.delivered),
            where('deliveredBy.id', '==', user?.id)
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
            <Header
                onPressBack={() => {
                    navigation.goBack();
                }}
                title="My Deliveries"
            />

            <ScrollView>
                {orders.map((order) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('DeliveryView', {
                                    orderId: order.id!
                                });
                            }}
                            key={order.id}
                        >
                            <Stack>
                                <Text>{order.total}</Text>
                            </Stack>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </Screen>
    );
};

export default MyDeliveries;
