import {
    Alert,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React from 'react';

import Text from '../../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerHomeStackScreens } from '../../../navigation/consumer/typing';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { LinearGradient } from 'expo-linear-gradient';
import { SIZES } from '../../../constants';
import Row from '../../../components/Row';
import { FontAwesome } from '@expo/vector-icons';
import RadioButton from '../../../components/RadioButton';
import { P_Size } from '../../../utils/sizes';
import Button from '../../../components/Button';
import Quantifier from '../../../components/Quantifier';
import { AnimatePresence } from 'moti';
import {
    addToCart,
    CartItem,
    setCart
} from '../../../redux/consumer/cartSlide';
import InputField from '../../../components/InputField';
import Stack from '../../../components/Stack';

import KeyboardScreen from '../../../components/KeyboardScreen';

type Props = NativeStackScreenProps<ConsumerHomeStackScreens, 'ProductDetails'>;

const ProductDetails = ({
    navigation,
    route: {
        params: { product }
    }
}: Props) => {
    const theme = useAppSelector((state) => state.theme);

    const dispatch = useAppDispatch();
    const { items } = useAppSelector((state) => state.cart);
    const [selected, setSelected] = React.useState<P_Size | null>(null);
    const [quantity, setQuatity] = React.useState<number>(1);
    const [instructions, setInstructions] = React.useState<string>('');

    const emptyCartAndAddNewProduct = async () => {
        try {
            dispatch(setCart({ quantity: 0, items: [], total: 0 }));
            const item: CartItem = {
                ...product,
                quantity: quantity,
                size: selected,
                instructions: instructions
            };
            dispatch(addToCart(item));
            navigation.pop();
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddToCart = React.useCallback(
        async (
            isSelected: P_Size | null,
            quantity: number,
            instructions: string
        ) => {
            try {
                const item: CartItem = {
                    ...product,
                    quantity: quantity,
                    size: isSelected,
                    instructions: instructions
                };

                dispatch(addToCart({ ...item }));
                navigation.pop();
            } catch (error) {
                console.log(error);
            }
        },
        [selected]
    );

    const checkIfItemIfFromCurrentStore = React.useCallback(async () => {
        if (items.length > 0) {
            if (items[0].businessId !== product.businessId) {
                Alert.alert(
                    'Items in Cart',
                    'You are already shopping from another business, Switch business?',
                    [
                        {
                            text: 'Stay Here',
                            style: 'cancel'
                        },
                        {
                            text: 'Switch',
                            onPress: emptyCartAndAddNewProduct,
                            style: 'destructive'
                        }
                    ]
                );
                return false;
            } else {
                await handleAddToCart(selected, quantity, instructions);
            }
        } else {
            await handleAddToCart(selected, quantity, instructions);
        }
    }, [selected, quantity, instructions]);

    return (
        <KeyboardScreen containerStyle={{ flex: 1 }} extraHeight={30}>
            <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
                <ImageBackground
                    source={{ uri: product.image! }}
                    resizeMode="cover"
                    style={[styles.image]}
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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FontAwesome
                                name="chevron-left"
                                size={24}
                                color={theme.WHITE_COLOR}
                            />
                        </TouchableOpacity>
                    </LinearGradient>
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
                <AnimatePresence>
                    {product.sizes && product.sizes.length === 0 && (
                        <>
                            <Text py_4 bold center>
                                Qty
                            </Text>
                            <Quantifier
                                onPressLeft={() => {
                                    setQuatity((prev) => {
                                        if (prev > 1) return prev - 1;
                                        return 1;
                                    });
                                }}
                                onPressRight={() => {
                                    setQuatity((prev) => {
                                        return prev + 1;
                                    });
                                }}
                                quantity={quantity}
                            />
                        </>
                    )}
                </AnimatePresence>
                <View>
                    <Stack center>
                        <Text medium py_6 raleway_italic>
                            {product.description}
                        </Text>
                    </Stack>
                    {product.sizes && product.sizes.length > 0 && (
                        <View>
                            <Text raleway_bold medium center>
                                Pick One{' '}
                                <Text textColor={theme.ASCENT} small>
                                    (required)
                                </Text>
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
                    <Stack center>
                        <InputField
                            value={instructions}
                            textContainerStyle={{ color: theme.SHADOW_COLOR }}
                            label={'Special instructions'}
                            containerStyle={{ borderRadius: SIZES.base }}
                            multiline
                            onChangeText={setInstructions}
                            placeholder="Dressing on the side"
                        />
                    </Stack>
                </View>
            </View>
            <View style={[styles.btn]}>
                <Row horizontalAlign="space-evenly">
                    <View
                        style={{
                            shadowOffset: { width: 3, height: 3 },
                            shadowColor: theme.SHADOW_COLOR,
                            shadowOpacity: 0.5,
                            backgroundColor: theme.BACKGROUND_COLOR,
                            paddingVertical: SIZES.base * 1.5,
                            paddingHorizontal: SIZES.padding * 1.5,
                            borderRadius: SIZES.radius,
                            elevation: 4,
                            borderWidth: 0.3,
                            borderColor: theme.SHADOW_COLOR
                        }}
                    >
                        <Text bold medium>
                            $
                            {(selected ? +selected.price : +product.price) *
                                quantity}
                        </Text>
                    </View>
                    <Button
                        disabled={
                            product.sizes &&
                            product.sizes.length > 0 &&
                            selected === null
                        }
                        containerStyle={{
                            paddingVertical: SIZES.padding * 0.8
                        }}
                        title={`Add to Cart`}
                        onPress={checkIfItemIfFromCurrentStore}
                    />
                </Row>
            </View>
        </KeyboardScreen>
    );
};

export default ProductDetails;
const styles = StyleSheet.create({
    name: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.padding
    },
    back: {
        position: 'absolute',
        top: SIZES.statusBarHeight,
        left: 20,
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
