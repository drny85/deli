import { FlatList, ListRenderItem } from 'react-native';
import React from 'react';
import { Category } from '../redux/business/categoriesSlice';
import { Product } from '../redux/business/productsSlice';
import ProductCard from './ProductCard';
import Text from './Text';

type Props = {
    categories: Category[];
    products: Product[];
    onPressProduct: (id: string) => void;
};

const ProductsList = ({ categories, products, onPressProduct }: Props) => {
    const renderProducts: ListRenderItem<Category> = ({ item }) => {
        const productsList = products.filter((p) => p.category?.id === item.id);

        const renderList: ListRenderItem<Product> = ({ item }) => {
            return <ProductCard product={item} onPress={() => {}} />;
        };

        return (
            <>
                {products.findIndex((p) => p.category?.id === item.id) !==
                    -1 && (
                    <Text px_4 large raleway_bold>
                        {item.name} (
                        {
                            products.filter((p) => p.category?.id === item.id)
                                .length
                        }
                        )
                    </Text>
                )}

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    pagingEnabled
                    data={productsList}
                    renderItem={renderList}
                    keyExtractor={(i) => i.id!}
                />
            </>
        );
    };
    return (
        <FlatList
            data={categories}
            renderItem={renderProducts}
            keyExtractor={(item) => item.id!}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default ProductsList;