import {
    FlatList,
    ImageBackground,
    ListRenderItem,
    TouchableOpacity
} from 'react-native';
import React from 'react';

import Text from './Text';
import { Product } from '../redux/business/productsSlice';
import { SIZES } from '../constants';
import Stack from './Stack';

type Props = {
    products: Product[];
    onPress: (product: Product) => void;
};

const MostPopularProducts = ({ products, onPress }: Props) => {
    const renderMostPopularProducts: ListRenderItem<Product> = ({ item }) => (
        <TouchableOpacity
            style={{
                height: '100%',
                width: SIZES.width * 0.4,
                borderRadius: SIZES.radius,
                overflow: 'hidden',
                marginHorizontal: SIZES.base
            }}
            onPress={() => onPress(item)}
        >
            <ImageBackground
                source={{ uri: item.image! }}
                style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                resizeMode="cover"
            >
                <Stack
                    py={4}
                    containerStyle={{
                        backgroundColor: '#21212170',
                        opacity: 0.8,
                        borderRadius: SIZES.radius
                    }}
                >
                    <Text
                        lightText
                        bold
                        center
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.name}
                    </Text>
                </Stack>
            </ImageBackground>
        </TouchableOpacity>
    );
    return (
        <FlatList
            horizontal
            contentContainerStyle={{ padding: SIZES.base }}
            showsHorizontalScrollIndicator={false}
            data={products}
            keyExtractor={(item) => item.id!}
            renderItem={renderMostPopularProducts}
        />
    );
};

export default MostPopularProducts;
