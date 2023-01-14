import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { CommonActions } from '@react-navigation/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerCartStackScreens } from '../../../navigation/consumer/typing';
import Loader from '../../../components/Loader';
import Button from '../../../components/Button';
import { View } from 'react-native';

type Props = NativeStackScreenProps<ConsumerCartStackScreens, 'OrderSuccess'>;

const OrderSuccess = ({
    navigation: nav,
    route: {
        params: { orderId }
    }
}: Props) => {
    //const navigation = useNavigation();
    const state = nav.getState();

    useEffect(() => {
        if (!orderId) return;
        setTimeout(() => {
            nav.dispatch(
                (state) => {
                    const routes = state.routes.filter(
                        (r) => r.name === 'Cart'
                    );
                    return CommonActions.reset({
                        ...state,
                        routes,
                        index: 0
                    });
                }
                //nav.navigate('OrderSuccess', { orderId: orderId });
            );
            console.log('HERE');
            nav.navigate('OrdersScreen', {
                screen: 'OrderDetails',
                params: { orderId: orderId }
            });
        }, 300);
    }, [orderId, nav]);

    if (!orderId) return <Loader />;
    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Text py_8 lobster large>
                Congratulations
            </Text>
        </View>
    );
};

export default OrderSuccess;
