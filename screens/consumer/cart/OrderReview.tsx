import { useNavigation } from '@react-navigation/native';
import React from 'react';
import Header from '../../../components/Header';
import Screen from '../../../components/Screen';
import Stack from '../../../components/Stack';
import Text from '../../../components/Text';
import { useAppSelector } from '../../../redux/store';

type Props = {};

const OrderReview = ({}: Props) => {
    const navigation = useNavigation();
    const { items, quantity, total } = useAppSelector((state) => state.cart);
    const { business } = useAppSelector((state) => state.business);
    return (
        <Screen>
            <Header
                onPressBack={() => navigation.goBack()}
                title="Order Review"
            />
            <Stack>
                <Text>Business</Text>
                <Text>{business?.name}</Text>
            </Stack>
        </Screen>
    );
};

export default OrderReview;
