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
import { businessCollection, ordersCollection } from '../../firebase';
import { onSnapshot, query, where } from 'firebase/firestore';
import { useLocation } from '../../hooks/useLocation';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import Stack from '../../components/Stack';
import { updateOrder } from '../../redux/consumer/ordersActions';
import Loader from '../../components/Loader';
import * as Location from 'expo-location';
import { Business } from '../../redux/business/businessSlide';
import DeliveryCard from '../../components/courier/DeliveryCard';
import { useBusinessAvailable } from '../../hooks/useBusinessAvailable';
import { CourierStackScreens } from '../../navigation/courier/typing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../../components/Header';

type Props = NativeStackScreenProps<CourierStackScreens, 'CourierDeliveries'>;
const CourierDeliveries = ({ navigation }: Props) => {
    const { location } = useLocation();
    const { user } = useAppSelector((state) => state.auth);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [businesss, setBusinesses] = React.useState<Business[]>([]);
    const dispatch = useAppDispatch();

    const { businessAvailable, isLoading } = useBusinessAvailable();

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
            navigation.navigate('DeliveryView', { orderId: order.id! });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const q = query(
            ordersCollection,
            where('status', 'in', [
                ORDER_STATUS.accepted_by_driver,
                ORDER_STATUS.picked_up_by_driver
            ]),
            where('courier.id', '==', user?.id)
        );
        const sub = onSnapshot(q, (snap) => {
            setOrders(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });

        return sub;
    }, []);

    if (!location || isLoading) return <Loader />;
    return (
        <Screen>
            <Header
                title="Pending Orders"
                onPressBack={() => {
                    navigation.navigate('CourierHome');
                }}
            />
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id!}
                renderItem={renderOrders}
            />
        </Screen>
    );
};

export default CourierDeliveries;
