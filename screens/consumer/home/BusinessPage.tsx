import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import ProductsList from '../../../components/ProductsList';
import { useCategoriesAndProducts } from '../../../hooks/useCategoriesAndProducts';

import { useAppDispatch, useAppSelector } from '../../../redux/store';

import Loader from '../../../components/Loader';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../../../components/Header';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { setCurrentProduct } from '../../../redux/business/productsSlice';
import { MotiView } from 'moti';
import Row from '../../../components/Row';
import { SIZES } from '../../../constants';

const BusinessPage = () => {
    const {
        categories,
        products,
        loading: loadingCP
    } = useCategoriesAndProducts();

    const theme = useAppSelector((state) => state.theme);
    const { loading, business } = useAppSelector((state) => state.business);
    const { quantity } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    if (loading || loadingCP) return <Loader />;

    return (
        <Screen>
            <Row
                containerStyle={{ marginHorizontal: SIZES.padding }}
                horizontalAlign="space-between"
            >
                <TouchableOpacity
                    style={{ padding: SIZES.base }}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome
                        name="chevron-left"
                        size={24}
                        color={theme.TEXT_COLOR}
                    />
                </TouchableOpacity>
                <Text
                    medium={SIZES.isSmallDevice}
                    large={!SIZES.isSmallDevice}
                    lobster
                >
                    {business?.name}
                </Text>
                <TouchableOpacity
                    style={[
                        styles.rightIcon,
                        {
                            backgroundColor: theme.BACKGROUND_COLOR,
                            shadowColor: theme.SHADOW_COLOR
                        }
                    ]}
                    onPress={() => {
                        navigation.navigate('ConsumerCart', { screen: 'Cart' });
                    }}
                >
                    <FontAwesome
                        name="shopping-cart"
                        size={24}
                        color={theme.TEXT_COLOR}
                    />
                    <MotiView
                        style={[styles.qty, { backgroundColor: theme.ASCENT }]}
                    >
                        <Text lightText bold>
                            {quantity}
                        </Text>
                    </MotiView>
                </TouchableOpacity>
            </Row>
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
const styles = StyleSheet.create({
    rightIcon: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 3, height: 3 },
        elevation: 4,
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    qty: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -2,
        right: -2,
        zIndex: 10
    }
});
