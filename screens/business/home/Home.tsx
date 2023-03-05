import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useBusiness } from '../../../hooks/useBusiness';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Loader from '../../../components/Loader';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';
import useNotifications from '../../../hooks/useNotifications';
import styled from '../../../styled-components';

import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import { SIZES } from '../../../constants';

import { businessProperty } from '../../../utils/businessProperty';
import moment from 'moment';
import Divider from '../../../components/Divider';
import { ORDER_STATUS } from '../../../redux/consumer/ordersSlide';
import { STATUS_NAME } from '../../../utils/orderStatus';
import * as Location from 'expo-location';
import { updateBusiness } from '../../../redux/business/businessActions';

type Props = {};

const Home = ({}: Props) => {
    useNotifications();

    const { user } = useAppSelector((state) => state.auth);
    const { business } = useBusiness(user?.id!);
    const { orders, loading } = useBusinessOrders();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const couriers = businessProperty({ orders, property: 'deliveredBy' });

    useEffect(() => {
        if (!business) return;
        if (business?.coors?.lat) return;

        Location.geocodeAsync(business?.address!)
            .then((res) => {
                if (res && res.length > 0) {
                    const location = res[0];
                    dispatch(
                        updateBusiness({
                            ...business!,
                            coors: {
                                lat: location.latitude,
                                lng: location.longitude
                            }
                        })
                    );
                }
            })
            .catch((e) => console.log(e));
    }, [business]);

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
                    <Text
                        lobster
                        xlarge
                        animation={'fadeInDown'}
                        duration={800}
                    >
                        Congratulations
                    </Text>
                    <Text py_8 animation={'fadeInLeft'} delay={800}>
                        We are almost there, You just need one more step
                    </Text>
                    <Text py_8>
                        Your business is not ready yet. You must add some
                        products to sell
                    </Text>
                    <Button
                        title="Manage Products"
                        containerStyle={{ marginTop: SIZES.padding }}
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
                                        width: SIZES.width * 0.3,
                                        height: SIZES.height * 0.1
                                    }}
                                >
                                    <Text capitalize center bold>
                                        {STATUS_NAME(s)}
                                    </Text>
                                    <Text bold center medium py_6>
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
                            disabled={orders.length === 0}
                            style={{
                                shadowOffset: { width: 4, height: 4 },
                                elevation: 6,
                                shadowOpacity: 0.6,
                                shadowRadius: 6,
                                flexGrow: 1,
                                width: SIZES.width * 0.3,
                                height: SIZES.height * 0.1
                            }}
                        >
                            <Text center bold medium>
                                Orders History
                            </Text>
                            <Text bold center medium py_6>
                                {orders.length}
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
                                height: SIZES.height * 0.1
                            }}
                        >
                            <Text center bold medium>
                                Couriers
                            </Text>
                            <Text bold center medium py_6>
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
    background-color: ${({ theme }) => theme.CARD_BACKGROUND};
    padding: 20px;
    shadow-color: ${({ theme }) => theme.SHADOW_COLOR};
    border-radius: 12px;
    margin: 10px;
    height: 15%;, 
`;
