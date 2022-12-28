import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import ProductsList from '../../../components/ProductsList';
import { useCategoriesAndProducts } from '../../../hooks/useCategoriesAndProducts';

type Props = {};

const Orders = ({}: Props) => {
    const { categories, products } = useCategoriesAndProducts();
    return (
        <Screen center>
            <Text>Business Orders</Text>
        </Screen>
    );
};

export default Orders;
