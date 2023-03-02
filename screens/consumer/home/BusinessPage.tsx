import { View } from 'react-native';
import React, { useEffect } from 'react';
import Text from '../../../components/Text';
import ProductsList from '../../../components/ProductsList';
import { useCategoriesAndProducts } from '../../../hooks/useCategoriesAndProducts';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Loader from '../../../components/Loader';
import { useNavigation } from '@react-navigation/native';
import { setCurrentProduct } from '../../../redux/business/productsSlice';
import { SIZES } from '../../../constants';
import BusinessHeader from '../../../components/BusinessHeader';
import MostPopularProducts from '../../../components/MostPopularProducts';
import { AnimatePresence, MotiView } from 'moti';

const BusinessPage = () => {
    const {
        categories,
        products,
        loading: loadingCP
    } = useCategoriesAndProducts();

    const theme = useAppSelector((state) => state.theme);
    const { loading, business } = useAppSelector((state) => state.business);

    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    if (loading || loadingCP || !business) return <Loader />;

    return (
        <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
            <BusinessHeader business={business} />
            <AnimatePresence>
                {products.some((p) => p.unitSold > 0) && (
                    <MotiView
                        from={{ opacity: 0, translateY: -40 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 800 }}
                        style={{ height: SIZES.height * 0.12, width: '100%' }}
                    >
                        <Text
                            animation={'fadeInLeft'}
                            delay={800}
                            px_4
                            lobster
                            large
                        >
                            Most Popular
                        </Text>
                        <MostPopularProducts
                            products={products
                                .filter((p) => p.unitSold > 0)
                                .sort((a, b) =>
                                    a.unitSold < b.unitSold ? 1 : -1
                                )
                                .slice(0, 10)}
                            onPress={(product) => {
                                dispatch(setCurrentProduct(product));
                                navigation.navigate('ConsumerHome', {
                                    screen: 'ProductDetails',
                                    params: { product: product }
                                });
                            }}
                        />
                    </MotiView>
                )}
            </AnimatePresence>
            <Text animation={'fadeInLeft'} delay={800} px_4 lobster large>
                Menu
            </Text>
            <MotiView
                from={{ opacity: 0, translateY: 100 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800 }}
            >
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
            </MotiView>
        </View>
    );
};

export default BusinessPage;
