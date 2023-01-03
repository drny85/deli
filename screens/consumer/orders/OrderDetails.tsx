import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';

type Props = {};

const OrderDetails = ({}: Props) => {
    const navigation = useNavigation();

    const goToOrder = () => {
        navigation.navigate('ConsumerOrders', { screen: 'Orders' });
    };
    return (
        <Screen center>
            <Text py_8>OrderDetails </Text>
            <Button title="View Orders" onPress={goToOrder} />
        </Screen>
    );
};

export default OrderDetails;
