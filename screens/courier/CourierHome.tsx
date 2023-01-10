import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { onSnapshot, query, where } from 'firebase/firestore';
import { ordersCollection } from '../../firebase';
import { Order, ORDER_STATUS } from '../../redux/consumer/ordersSlide';

import Stack from '../../components/Stack';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Loader from '../../components/Loader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import useNotifications from '../../hooks/useNotifications';
import DeliveryCard from '../../components/courier/DeliveryCard';
import { useBusinessAvailable } from '../../hooks/useBusinessAvailable';
import { CourierStackScreens } from '../../navigation/courier/typing';

import { Theme } from '../../types';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Header from '../../components/Header';
import { SIZES } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../../components/Button';
import Row from '../../components/Row';
import { logoutUser } from '../../redux/auth/authActions';

type Props = NativeStackScreenProps<CourierStackScreens, 'CourierHome'>;

const CourierHome = ({ navigation }: Props) => {
    useNotifications();
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);
    const [show, setShow] = useState(false);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const { businessAvailable, isLoading } = useBusinessAvailable();
    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = React.useState(true);

    const snapPoints = useMemo(() => ['1%', '20%', '50%', '86%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleSheetChange = useCallback((index: number) => {
        console.log('handleSheetChange', index);
        setIsOpen(index > 0);
        if (index === 0) {
            bottomSheetRef.current?.close();
        }
    }, []);
    console.log(isOpen);

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

    useFocusEffect(() => {
        if (bottomSheetRef.current) {
            if (!isOpen) {
                bottomSheetRef.current.close();
            }
        }
    });

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
            <Header
                title={`Orders For Delivery (${orders.length})`}
                rightIcon={
                    <FloatingMenu
                        onPress={() => {
                            if (isOpen) {
                                bottomSheetRef.current?.close();
                            } else {
                                console.log('HE');

                                bottomSheetRef.current?.snapToIndex(1);
                            }
                        }}
                        theme={theme}
                    />
                }
            />
            <View style={{ flex: 1 }}>
                {/* <Text center lobster large py_4>
                    Orders For Delivery ({orders.length})
                </Text> */}
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

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
                index={0}
            >
                <BottomSheetScrollView
                    style={{
                        flex: 1,
                        backgroundColor:
                            theme.mode === 'light'
                                ? '#edede9'
                                : theme.BACKGROUND_COLOR,
                        borderRadius: SIZES.radius * 2
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <View style={{ flexGrow: 1 }}>
                            <Stack containerStyle={{ height: '100%' }}>
                                <Row
                                    horizontalAlign="space-evenly"
                                    containerStyle={{ width: '100%' }}
                                >
                                    <Button
                                        notRounded
                                        title="My Deliveries"
                                        outlined
                                        onPress={() => {
                                            bottomSheetRef.current?.close();
                                            navigation.navigate('MyDeliveries');
                                        }}
                                    />
                                    <Button
                                        title="My Deliveries"
                                        notRounded
                                        outlined
                                        onPress={() =>
                                            navigation.navigate('MyDeliveries')
                                        }
                                    />
                                </Row>
                            </Stack>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            style={{ padding: 20 }}
                            onPress={() => {
                                dispatch(logoutUser());
                            }}
                        >
                            <Text bold>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </Screen>
    );
};

export default CourierHome;

export const FloatingMenu = ({
    onPress,
    theme
}: {
    onPress: () => void;
    theme: Theme;
}) => {
    return (
        <TouchableOpacity
            style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: theme.BACKGROUND_COLOR,
                shadowOpacity: 0.6,
                shadowRadius: 8,
                shadowColor: theme.SHADOW_COLOR,
                elevation: 8,
                shadowOffset: { width: 3, height: 3 },
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: SIZES.base,
                zIndex: 300
            }}
            onPress={onPress}
        >
            <Ionicons name="menu-sharp" size={30} color={theme.TEXT_COLOR} />
        </TouchableOpacity>
    );
};
