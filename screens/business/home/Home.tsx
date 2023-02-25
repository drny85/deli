import { StyleSheet, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useBusiness } from '../../../hooks/useBusiness';
import { useAppSelector } from '../../../redux/store';
import Loader from '../../../components/Loader';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';
import useNotifications from '../../../hooks/useNotifications';
import styled from '../../../styled-components';
import Row from '../../../components/Row';
import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import { SIZES } from '../../../constants';

import { businessProperty } from '../../../utils/businessProperty';
import moment from 'moment';
import Divider from '../../../components/Divider';
import { ORDER_STATUS } from '../../../redux/consumer/ordersSlide';
import { STATUS_NAME } from '../../../utils/orderStatus';

type Props = {};

const Home = ({}: Props) => {
    useNotifications();
    const { user } = useAppSelector((state) => state.auth);
    const { business } = useBusiness(user?.id!);
    const { orders, loading } = useBusinessOrders();
    const navigation = useNavigation();

    const couriers = businessProperty({ orders, property: 'deliveredBy' });

    if (!business || loading) return <Loader />;
    return (
        <Screen>
            {!business.profileCompleted ||
            business.stripeAccount === null ||
            !business.isActive ? (
                <View
                    style={[
                        styles.container,
                        { justifyContent: 'center', alignItems: 'center' }
                    ]}
                >
                    <Text py_8>
                        Your business is not ready yet. You must add some
                        products to sell
                    </Text>
                    <Button
                        title="Manage Products"
                        onPress={() => {
                            navigation.navigate('BusinessProducts', {
                                screen: 'Products'
                            });
                        }}
                    />
                </View>
            ) : (
                <View style={styles.container}>
                    <Text lobster large>
                        {moment().format('dddd, MMMM D, YYYY')}
                    </Text>
                    <View
                        style={{
                            flexWrap: 'wrap',

                            height: '60%',
                            flexDirection: 'row'
                        }}
                    >
                        {Object.values(ORDER_STATUS).map((s) => {
                            return (
                                <Square
                                    key={s}
                                    onPress={() =>
                                        navigation.navigate('BusinessHome', {
                                            screen: 'BusinessOrders',
                                            params: { status: s }
                                        })
                                    }
                                    style={{
                                        shadowOffset: { width: 4, height: 4 },
                                        elevation: 6,
                                        shadowOpacity: 0.6,
                                        shadowRadius: 6,
                                        flexGrow: 1,
                                        width: SIZES.width * 0.3
                                    }}
                                >
                                    <Text center lightText bold medium>
                                        {STATUS_NAME(s)}
                                    </Text>
                                    <Text bold center lightText medium py_6>
                                        {
                                            businessProperty({
                                                orders,
                                                property:
                                                    s as keyof typeof ORDER_STATUS,
                                                fromTodayOnly: true
                                            }).length
                                        }
                                    </Text>
                                </Square>
                            );
                        })}
                    </View>
                    <Divider thickness="large" />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',

                            flexGrow: 1,
                            width: '100%'
                        }}
                    >
                        <Square
                            onPress={() =>
                                navigation.navigate('BusinessHome', {
                                    screen: 'OrderHistory'
                                })
                            }
                            style={{
                                shadowOffset: { width: 4, height: 4 },
                                elevation: 6,
                                shadowOpacity: 0.6,
                                shadowRadius: 6,
                                flexGrow: 1,
                                width: SIZES.width * 0.3,
                                height: '30%'
                            }}
                        >
                            <Text center lightText bold large>
                                Orders History
                            </Text>
                            <Text bold center lightText medium py_6>
                                {orders.length}
                            </Text>
                        </Square>
                        <Square
                            style={{
                                shadowOffset: { width: 4, height: 4 },
                                elevation: 6,
                                shadowOpacity: 0.6,
                                shadowRadius: 6,
                                flexGrow: 1,
                                width: SIZES.width * 0.3,
                                height: '30%'
                            }}
                        >
                            <Text center lightText bold medium>
                                All Cancelled Orders
                            </Text>
                            <Text bold center lightText medium py_6>
                                {
                                    businessProperty({
                                        orders,
                                        property: 'cancelled'
                                    }).length
                                }
                            </Text>
                        </Square>
                        <Square
                            disabled={!couriers.length}
                            onPress={() =>
                                navigation.navigate('BusinessHome', {
                                    screen: 'AllCouriers'
                                })
                            }
                            style={{
                                shadowOffset: { width: 4, height: 4 },
                                elevation: 6,
                                shadowOpacity: 0.6,
                                shadowRadius: 6,
                                flexGrow: 1,
                                width: SIZES.width * 0.3,
                                height: '30%'
                            }}
                        >
                            <Text center lightText bold medium>
                                Couriers
                            </Text>
                            <Text bold center lightText medium py_6>
                                {couriers.length}
                            </Text>
                        </Square>
                    </View>
                </View>
            )}
        </Screen>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center'
    }
});

const Square = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.ASCENT};
    padding: 20px;
    shadow-color: ${({ theme }) => theme.SHADOW_COLOR};
    border-radius: 12px;
    margin: 10px;
    height: 15%;, 
`;
