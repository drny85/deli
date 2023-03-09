import {
    Alert,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView
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
import { AnimatePresence, Image } from 'moti';
import {
    addToCart,
    CartItem,
    setCart
} from '../../../redux/consumer/cartSlide';
import InputField from '../../../components/InputField';
import Stack from '../../../components/Stack';

import KeyboardScreen from '../../../components/KeyboardScreen';
import Screen from '../../../components/Screen';
const PIC_DIMENSIONS = SIZES.height * 0.4;

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
        <KeyboardScreen containerStyle={{ flex: 1 }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.BACKGROUND_COLOR,
                    justifyContent: 'space-between'
                }}
            >
                <View style={{ flex: 0.3 }}>
                    <ImageBackground
                        source={{ uri: product.image! }}
                        resizeMode="cover"
                        style={[styles.image]}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                height: (PIC_DIMENSIONS * 1.1) / 2,
                                width: (PIC_DIMENSIONS * 1.1) / 2,
                                borderRadius: (PIC_DIMENSIONS * 1.1) / 4,
                                alignSelf: 'center',
                                bottom: (-PIC_DIMENSIONS * 1.1) / 4,
                                backgroundColor: theme.BACKGROUND_COLOR
                            }}
                        />
                        <Image
                            from={{ rotate: '0deg' }}
                            animate={{ rotate: '360deg' }}
                            transition={{ type: 'timing', duration: 800 }}
                            resizeMode="cover"
                            source={{ uri: product.image! }}
                            style={{
                                position: 'absolute',
                                height: PIC_DIMENSIONS / 2,
                                width: PIC_DIMENSIONS / 2,
                                borderRadius: PIC_DIMENSIONS / 4,
                                alignSelf: 'center',
                                bottom: -PIC_DIMENSIONS / 4
                            }}
                        />
                        <AnimatePresence>
                            {product.sizes && product.sizes.length === 0 && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: PIC_DIMENSIONS * 0.6,
                                        alignSelf: 'center'
                                    }}
                                >
                                    <Text py_4 bold center lightText>
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
                                </View>
                            )}
                        </AnimatePresence>

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
                    </ImageBackground>
                </View>
                <View style={{ flex: 0.5 }}>
                    <ScrollView>
                        <View
                            style={{
                                marginTop: PIC_DIMENSIONS * 0.1,
                                height: '100%'
                            }}
                        >
                            <Stack center>
                                <Text large raleway_bold py_6>
                                    {product.name}
                                </Text>
                            </Stack>
                            {product.sizes && product.sizes.length > 0 && (
                                <View>
                                    <Text bold center>
                                        Pick One{' '}
                                        <Text textColor={theme.DANGER} small>
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
                                                        elevation: 6,
                                                        borderRadius:
                                                            SIZES.radius * 3,
                                                        borderWidth:
                                                            size === selected
                                                                ? 0.5
                                                                : undefined,
                                                        shadowColor:
                                                            theme.ASCENT,
                                                        padding: SIZES.base,
                                                        backgroundColor:
                                                            theme.BACKGROUND_COLOR,
                                                        shadowOffset: {
                                                            width: 4,
                                                            height: 4
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
                                                            bold={
                                                                selected ===
                                                                size
                                                            }
                                                            capitalize
                                                            raleway
                                                            px_4
                                                        >
                                                            {size.size}
                                                        </Text>
                                                        <RadioButton
                                                            selected={
                                                                selected ===
                                                                size
                                                            }
                                                            onPress={() => {
                                                                setSelected(
                                                                    size
                                                                );
                                                            }}
                                                        />
                                                    </Row>
                                                </TouchableOpacity>
                                            ))}
                                    </Row>
                                </View>
                            )}
                            <Stack center>
                                <Text py_6>{product.description}</Text>
                            </Stack>
                            <Stack center>
                                <InputField
                                    value={instructions}
                                    textContainerStyle={{
                                        color: theme.SHADOW_COLOR
                                    }}
                                    label={'Special instructions'}
                                    containerStyle={{
                                        borderRadius: SIZES.base
                                    }}
                                    multiline
                                    onChangeText={setInstructions}
                                    placeholder="Dressing on the side"
                                />
                            </Stack>
                        </View>
                    </ScrollView>
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
        height: '100%'
    },
    btn: {
        flex: 0.1,
        bottom: SIZES.isVerySmall ? SIZES.base : SIZES.padding * 2,
        alignSelf: 'center',
        width: '100%',
        justifyContent: 'flex-end'
    }
});
