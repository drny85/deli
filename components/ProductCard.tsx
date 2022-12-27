import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React from 'react';
import Text from './Text';
import { Product } from '../redux/business/productsSlice';
import { SIZES } from '../constants';
import { AnimatePresence, MotiView } from 'moti';
import { useAppSelector } from '../redux/store';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';
import Row from './Row';

type Props = {
    product: Product;
    disabled?: boolean;

    onPress: () => void;
};

const ProductCard = ({ product, disabled, onPress }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { productImage } = useAppSelector((state) => state.products);
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: theme.BACKGROUND_COLOR }
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
                                    large
                                    lobster
                                >
                                    {product.name}
                                </Text>
                                <Text lightText bold>
                                    ${product.price}
                                </Text>
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
        width: '100%',
        height: SIZES.height * 0.25,
        marginBottom: 20,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35
    },
    image: {
        borderRadius: SIZES.radius * 2,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    }
});
