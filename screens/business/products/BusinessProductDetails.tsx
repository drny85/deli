import {
    Alert,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useState } from 'react';

import Text from '../../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { LinearGradient } from 'expo-linear-gradient';
import { SIZES } from '../../../constants';
import Row from '../../../components/Row';
import { FontAwesome } from '@expo/vector-icons';
import RadioButton from '../../../components/RadioButton';
import { P_Size } from '../../../utils/sizes';
import Button from '../../../components/Button';

import Stack from '../../../components/Stack';

import KeyboardScreen from '../../../components/KeyboardScreen';
import { BusinessProductsStackScreens } from '../../../navigation/business/typing';

import Loader from '../../../components/Loader';

import Divider from '../../../components/Divider';
import { useBusinessOrders } from '../../../hooks/useBusinessOrders';
import moment from 'moment';
import { deleteProduct } from '../../../redux/business/productsActions';
import { useProduct } from '../../../hooks/useProduct';

type Props = NativeStackScreenProps<
    BusinessProductsStackScreens,
    'BusinessProductDetails'
>;

const BusinessProductDetails = ({
    navigation,
    route: {
        params: { productId }
    }
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { loading, orders } = useBusinessOrders();
    const [lastOrdered, setLastOrdered] = useState('');
    const { product } = useProduct(productId);

    const dispatch = useAppDispatch();

    const [selected, setSelected] = React.useState<P_Size | null>(null);

    useEffect(() => {
        if (loading || !orders.length) return;
        const found = orders
            .filter((order) => order.items.some((o) => o.id === productId))
            .sort((a, b) => (a.orderDate > b.orderDate ? -1 : 1));
        if (found.length) {
            setLastOrdered(found[0].orderDate);
        }
    }, [loading, orders.length]);

    if (!product || loading) return <Loader />;

    return (
        <KeyboardScreen containerStyle={{ flex: 1 }} extraHeight={30}>
            <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
                <ImageBackground
                    source={{ uri: product.image! }}
                    resizeMode="cover"
                    style={[styles.image]}
                >
                    <Row
                        containerStyle={{
                            zIndex: 200,
                            marginTop: SIZES.statusBarHeight,
                            paddingHorizontal: SIZES.padding
                        }}
                        horizontalAlign="space-between"
                    >
                        <LinearGradient
                            colors={[
                                'rgba(0,0,0,0.1)',
                                'rgba(0,0,0,0.3)',
                                'rgba(0,0,0,0.7)'
                            ]}
                            start={{ x: 0, y: 0.3 }}
                            end={{ x: 1, y: 0.8 }}
                            style={[styles.back]}
                        >
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <FontAwesome
                                    name="chevron-left"
                                    size={24}
                                    color={theme.WHITE_COLOR}
                                />
                            </TouchableOpacity>
                        </LinearGradient>

                        <TouchableOpacity
                            style={{ paddingRight: SIZES.padding }}
                            onPress={() => {
                                Alert.alert(
                                    'Delete Product',
                                    'Are you sure you want to delete this product?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Yes, Delete it',
                                            style: 'destructive',
                                            onPress: async () => {
                                                await dispatch(
                                                    deleteProduct(product)
                                                );
                                                navigation.goBack();
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <FontAwesome
                                name="trash-o"
                                size={36}
                                color={'red'}
                            />
                        </TouchableOpacity>
                    </Row>
                    <LinearGradient
                        colors={[
                            'rgba(0,0,0,0.1)',
                            'rgba(0,0,0,0.4)',
                            'rgba(0,0,0,0.8)'
                        ]}
                        start={{ x: 0, y: 0.3 }}
                        end={{ x: 1, y: 0.6 }}
                        style={[styles.name]}
                    >
                        <Row horizontalAlign="space-between">
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                lightText
                                large
                                lobster
                            >
                                {product.name}
                            </Text>
                            <View>
                                {product.sizes.length > 0 && !selected && (
                                    <Text center lightText>
                                        from
                                    </Text>
                                )}
                                <Text bold large lightText>
                                    $
                                    {selected
                                        ? selected.price
                                        : product.sizes.length > 0
                                        ? `${product.sizes[0].price} - ${
                                              product.sizes[
                                                  product.sizes.length - 1
                                              ].price
                                          }`
                                        : product.price}
                                </Text>
                            </View>
                        </Row>
                    </LinearGradient>
                </ImageBackground>

                <View>
                    <Stack
                        containerStyle={{
                            backgroundColor: theme.SECONDARY_BUTTON_COLOR
                        }}
                        center
                    >
                        <Text bold medium>
                            Product Description
                        </Text>
                        <Text medium py_6 raleway_italic>
                            {product.description}
                        </Text>
                    </Stack>
                    <Divider />
                    <Stack
                        containerStyle={{
                            backgroundColor: theme.SECONDARY_BUTTON_COLOR
                        }}
                        center
                    >
                        <Text bold medium>
                            Product Sales Info
                        </Text>
                        <Row>
                            <Text bold py_4>
                                Units Sold: <Text>{product.unitSold}</Text>
                            </Text>
                            <Text bold px_6>
                                Last Ordered{' '}
                                <Text>
                                    {lastOrdered
                                        ? moment(lastOrdered).format('ll')
                                        : 'None'}{' '}
                                </Text>
                            </Text>
                        </Row>
                    </Stack>
                    {product.sizes && product.sizes.length > 0 && (
                        <View>
                            <Text bold medium center>
                                Variations
                            </Text>
                            <Row
                                horizontalAlign="space-evenly"
                                containerStyle={{ paddingVertical: 30 }}
                            >
                                {product.sizes &&
                                    product.sizes.length > 0 &&
                                    product.sizes.map((size, index) => (
                                        <TouchableOpacity
                                            style={{
                                                borderRadius: 35,
                                                borderWidth:
                                                    size === selected
                                                        ? 0.5
                                                        : undefined,
                                                shadowColor: theme.SHADOW_COLOR,
                                                padding: SIZES.base,
                                                backgroundColor:
                                                    theme.BACKGROUND_COLOR,
                                                shadowOffset: {
                                                    width: 1,
                                                    height: 1
                                                },
                                                shadowOpacity: 0.4
                                            }}
                                            onPress={() => {
                                                setSelected(size);
                                            }}
                                            key={size.id}
                                        >
                                            <Row>
                                                <Text
                                                    bold={selected === size}
                                                    capitalize
                                                    raleway
                                                    px_4
                                                >
                                                    {size.size}
                                                </Text>
                                                <RadioButton
                                                    // status={size}

                                                    selected={selected === size}
                                                    onPress={() => {
                                                        setSelected(size);
                                                    }}
                                                />
                                            </Row>
                                        </TouchableOpacity>
                                    ))}
                            </Row>
                        </View>
                    )}
                </View>
                <View
                    style={{ width: '60%', alignSelf: 'center', marginTop: 50 }}
                >
                    <Button
                        leftIcon={
                            <FontAwesome
                                name="edit"
                                size={24}
                                color={theme.WHITE_COLOR}
                            />
                        }
                        title="Edit Product"
                        onPress={() => {
                            navigation.navigate('AddProduct', { product });
                        }}
                    />
                </View>
            </View>
        </KeyboardScreen>
    );
};

export default BusinessProductDetails;
const styles = StyleSheet.create({
    name: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.padding
    },
    back: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: SIZES.height * 0.4
    },
    btn: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: '80%'
    }
});
