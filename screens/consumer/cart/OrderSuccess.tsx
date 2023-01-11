import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { CommonActions } from '@react-navigation/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerCartStackScreens } from '../../../navigation/consumer/typing';
import Loader from '../../../components/Loader';

type Props = NativeStackScreenProps<ConsumerCartStackScreens, 'OrderSuccess'>;

const OrderSuccess = ({
    navigation: nav,
    route: {
        params: { orderId }
    }
}: Props) => {
    //const navigation = useNavigation();

    useEffect(() => {
        if (!orderId) return;
        nav.dispatch((state) => {
            const routes = state.routes.filter(
                (r) => r.name === ('Cart' as any)
            );
            //RESET ALL NAVIGATION BUT CART SCREEN
            return CommonActions.reset({
                ...state,
                routes: [...routes],
                index: 0
            });
        });
        nav.navigate('OrdersScreen', {
            screen: 'OrderDetails',
            params: { orderId }
        });
    }, [orderId]);

    if (!orderId) return <Loader />;
    return (
        <Screen center>
            <Text lobster large>
                Congratulations!
            </Text>
        </Screen>
    );
};

export default OrderSuccess;
