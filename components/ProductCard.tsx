import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import React from 'react';
import Text from './Text';
import { Product } from '../redux/business/productsSlice';
import { SIZES } from '../constants';
import { AnimatePresence, MotiView } from 'moti';
import { useAppSelector } from '../redux/store';

import { useNavigation } from '@react-navigation/native';
import Row from './Row';
import Stack from './Stack';

type Props = {
    product: Product;
    disabled?: boolean;
    containerStyle?: ViewStyle;
    onPress: () => void;
};

const ProductCard = ({ product, disabled, onPress, containerStyle }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { productImage } = useAppSelector((state) => state.products);

    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: theme.BACKGROUND_COLOR },
                containerStyle
            ]}
            disabled={disabled}
            onPress={onPress}
        >
            <ImageBackground
                style={[styles.image]}
                resizeMode="cover"
                source={{
                    uri: product.image
                        ? product.image
                        : productImage
                        ? productImage
                        : 'https://returntofreedom.org/store/wp-content/uploads/default-placeholder.png'
                }}
            >
                <AnimatePresence>
                    {product.name && (
                        <MotiView
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)'
                            }}
                        >
                            <Row
                                containerStyle={{
                                    padding: SIZES.base * 2
                                }}
                                horizontalAlign="space-between"
                            >
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    lightText
                                    medium
                                    lobster
                                >
                                    {product.name}
                                </Text>
                                <Stack py={1}>
                                    {product.sizes &&
                                        product.sizes.length > 0 && (
                                            <Text small lightText raleway_bold>
                                                As low as
                                            </Text>
                                        )}
                                    <Text lightText bold>
                                        ${product.price}
                                    </Text>
                                </Stack>
                            </Row>
                        </MotiView>
                    )}
                </AnimatePresence>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default ProductCard;
const styles = StyleSheet.create({
    container: {
        width: SIZES.isSmallDevice ? 240 : 320,
        height: SIZES.height * 0.19,
        maxWidth: 400,
        overflow: 'hidden',
        borderRadius: SIZES.radius,
        marginHorizontal: SIZES.base,
        marginVertical: SIZES.base
    },
    image: {
        borderRadius: SIZES.radius,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    }
});
