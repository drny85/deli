import {
    ScrollView,
    TouchableOpacity,
    View,
    ListRenderItem,
    FlatList
} from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import Header from '../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ordersCollection } from '../../firebase';
import { onSnapshot, query, where } from 'firebase/firestore';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import Stack from '../../components/Stack';
import Loader from '../../components/Loader';
import { useAppSelector } from '../../redux/store';
import { CourierStackScreens } from '../../navigation/courier/typing';
import DeliveryCard from '../../components/courier/DeliveryCard';
import { useBusinessAvailable } from '../../hooks/useBusinessAvailable';

type Props = NativeStackScreenProps<CourierStackScreens, 'MyDeliveries'>;

const MyDeliveries = ({ navigation }: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { businessAvailable } = useBusinessAvailable();

    const handleOnPress = (order: Order) => {
        navigation.navigate('DeliveryDetails', { order });
    };

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
                    navigation.navigate('CourierHome');
                }}
                title="My Deliveries"
            />

            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    showsVerticalScrollIndicator={false}
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
        </Screen>
    );
};

export default MyDeliveries;
