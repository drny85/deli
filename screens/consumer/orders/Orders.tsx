import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';

import { SIZES } from '../../../constants';
import { useAppSelector } from '../../../redux/store';

type Props = {};

const Orders = ({}: Props) => {
    const { business } = useAppSelector((state) => state.business);

    return (
        <Screen center>
            <Text>Orders</Text>
        </Screen>
    );
};

export default Orders;
