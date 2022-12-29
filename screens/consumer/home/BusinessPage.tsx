import { View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import ProductsList from '../../../components/ProductsList';
import { useCategoriesAndProducts } from '../../../hooks/useCategoriesAndProducts';

import { useAppDispatch, useAppSelector } from '../../../redux/store';

import Loader from '../../../components/Loader';

import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { setCurrentProduct } from '../../../redux/business/productsSlice';

const BusinessPage = () => {
    const {
        categories,
        products,
        loading: loadingCP
    } = useCategoriesAndProducts();
    const { loading, business } = useAppSelector((state) => state.business);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    if (loading || loadingCP) return <Loader />;
    return (
        <Screen>
            <Header
                title={business?.name}
                onPressBack={() => {
                    navigation.goBack();
                }}
                onPressRight={() => {}}
            />
            <ProductsList
                categories={categories}
                products={products}
                onPressProduct={(product) => {
                    dispatch(setCurrentProduct(product));
                    navigation.navigate('ConsumerHome', {
                        screen: 'ProductDetails',
                        params: { product: product }
                    });
                }}
            />
        </Screen>
    );
};

export default BusinessPage;
