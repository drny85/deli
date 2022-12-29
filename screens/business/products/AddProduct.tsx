import {
    Alert,
    Modal,
    ScrollView,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useState } from 'react';

import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useImage } from '../../../hooks/useImage';
import InputField from '../../../components/InputField';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
    Product,
    setProductImage
} from '../../../redux/business/productsSlice';
import Row from '../../../components/Row';
import { SIZES } from '../../../constants';
import ProductCard from '../../../components/ProductCard';
import { AnimatePresence, MotiView } from 'moti';
import Slider from '@react-native-community/slider';
import CategoryTile from '../../../components/CategoryTile';

import Button from '../../../components/Button';
import { useSaveImage } from '../../../utils/saveImage';
import { addProduct } from '../../../redux/business/productsActions';
import { PRODUCT_SIZES, P_Size } from '../../../utils/sizes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {};

const AddProduct = ({}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const [sizes, setSizes] = useState<P_Size[]>([]);
    const [increase, setIncrease] = useState(0.1);
    const dispatch = useAppDispatch();
    const [comeInSizes, setComeInSizes] = useState(false);
    const { productImage } = useAppSelector((state) => state.products);
    const { categories } = useAppSelector((state) => state.categories);
    const navigation = useNavigation();
    useSaveImage();

    const [showCategoryModal, setShowCategoryModal] = React.useState(false);

    const [product, setProduct] = React.useState<Product>({
        name: '',
        image: productImage,
        price: '',
        category: null,
        description: '',
        sizes:
            sizes.length > 0
                ? sizes.sort((a, b) => (a.id > b.id ? 1 : -1)).reverse()
                : [],
        priceMultiplier: sizes.length > 0 ? increase : null
    });

    const { pickImage } = useImage();

    const handleAddProduct = async () => {
        try {
            const isValid = validateProduct(product);
            if (!isValid) return;

            const newProduct: Product = {
                ...product,
                sizes,
                priceMultiplier: increase
            };
            const { payload } = await dispatch(addProduct(newProduct));
            if (payload) {
                resetProduct();
            }
            console.log(newProduct);
        } catch (error) {
            console.log(error);
        }
    };

    const resetProduct = () => {
        dispatch(setProductImage(null));
        setProduct({
            name: '',
            image: productImage,
            price: '',
            category: null,
            description: '',
            sizes: [],
            priceMultiplier: null
        });
        navigation.goBack();
    };

    const validateProduct = (product: Product): boolean => {
        if (!product.image) {
            Alert.alert('Error', 'Please upload a product image');
            pickImage();
            return false;
        } else {
            setProduct({ ...product, image: productImage });
        }
        if (product.name === '') {
            Alert.alert('Error', 'Please enter a product name');
            return false;
        }
        if (product.price === '') {
            Alert.alert('Error', 'Please enter a product name');
            return false;
        }

        if (product.image === null) {
            return false;
        }

        if (product.category === null) {
            Alert.alert('Error', 'Please select a category');
            setShowCategoryModal(true);

            return false;
        }
        if (comeInSizes) {
            if (sizes.length === 0) {
                Alert.alert('Error', 'Please select at least one size');
                return false;
            }
        }
        if (product.description === '') {
            Alert.alert('Error', 'Please enter a product description');
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (productImage) {
            setProduct({ ...product, image: productImage });
        }
        if (!comeInSizes) {
            setSizes([]);
        } else {
            setSizes(sizes);
        }
    }, [productImage, comeInSizes]);
    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ flex: 1 }}
        >
            <View
                style={{
                    position: 'absolute',
                    top: SIZES.statusBarHeight,
                    left: 0,
                    right: 0,
                    zIndex: 212
                }}
            >
                <Header
                    iconColor={
                        productImage ? theme.WHITE_COLOR : theme.TEXT_COLOR
                    }
                    onPressRight={() => {}}
                    onPressBack={() => navigation.goBack()}
                />
            </View>
            <View
                style={{
                    maxWidth: 600,
                    alignSelf: 'center',
                    width: '100%',
                    flex: 1
                }}
            >
                <ProductCard
                    containerStyle={{ alignSelf: 'center', width: '100%' }}
                    product={product}
                    onPress={pickImage}
                />

                <InputField
                    value={product?.name}
                    autoCapitalize="words"
                    placeholder="Ex. Orange Juice"
                    label="Product's Name"
                    onChangeText={(text) =>
                        setProduct({ ...product!, name: text })
                    }
                />
                <InputField
                    keyboardType="numeric"
                    value={product.price}
                    maxLenght={5}
                    placeholder="Ex. 2.99"
                    label="Product's Price"
                    onChangeText={(text) =>
                        setProduct({ ...product!, price: +text })
                    }
                />
                <AnimatePresence>
                    {product.image && product.price && product.name && (
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'timing' }}
                            exit={{ opacity: 0, scale: 0 }}
                        >
                            <Row
                                containerStyle={{
                                    marginVertical: SIZES.padding
                                }}
                            >
                                <Text px_4 bold>
                                    Category
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowCategoryModal(true)}
                                    style={{
                                        paddingVertical: SIZES.base,
                                        paddingHorizontal: SIZES.padding,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 20,
                                        borderRadius: 35,
                                        backgroundColor: theme.BACKGROUND_COLOR,
                                        borderColor: theme.ASCENT,
                                        borderWidth: 0.5
                                    }}
                                >
                                    <Text bold capitalize>
                                        {product.category
                                            ? product.category.name
                                            : 'Pick One'}
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                            <Row
                                containerStyle={{
                                    marginVertical: SIZES.padding
                                }}
                            >
                                <Text bold px_4>
                                    Come In Sizes?
                                </Text>
                                <Switch
                                    trackColor={{
                                        true: theme.SHADOW_COLOR,
                                        false: theme.SHADOW_COLOR
                                    }}
                                    value={comeInSizes}
                                    onValueChange={() =>
                                        setComeInSizes((prev) => !prev)
                                    }
                                    thumbColor={theme.ASCENT}
                                />
                            </Row>
                            <AnimatePresence>
                                {comeInSizes && (
                                    <MotiView
                                        style={{
                                            backgroundColor:
                                                theme.BACKGROUND_COLOR,
                                            shadowOffset: {
                                                width: 2,
                                                height: 2
                                            },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 3,
                                            shadowColor: theme.SHADOW_COLOR,
                                            borderRadius: SIZES.radius,
                                            padding: SIZES.base,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                        from={{ opacity: 0, translateY: -10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{
                                            type: 'timing'
                                        }}
                                        exit={{ opacity: 0, translateY: -10 }}
                                    >
                                        <Text center>
                                            Increase price per size by:{' '}
                                            {(increase * 100).toFixed(0)}%
                                        </Text>
                                        <Slider
                                            style={{
                                                width: SIZES.width * 0.6,
                                                maxWidth: 500,
                                                height: 30,
                                                marginVertical: SIZES.base * 1.5
                                            }}
                                            minimumValue={0.1}
                                            maximumValue={1}
                                            value={increase}
                                            minimumTrackTintColor={theme.ASCENT}
                                            maximumTrackTintColor={
                                                theme.SHADOW_COLOR
                                            }
                                            step={0.1}
                                            thumbTintColor={theme.ASCENT}
                                            onValueChange={(value) => {
                                                setIncrease(value);
                                            }}
                                        />
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-evenly'
                                            }}
                                        >
                                            {PRODUCT_SIZES.map(
                                                (size, index) => (
                                                    <View key={size.id}>
                                                        <Row>
                                                            <Text
                                                                capitalize
                                                                bold
                                                                px_4
                                                            >
                                                                {size.size ===
                                                                'xlarge'
                                                                    ? size.size.substring(
                                                                          0,
                                                                          2
                                                                      )
                                                                    : size
                                                                          .size[0]}
                                                            </Text>
                                                            <Switch
                                                                thumbColor={
                                                                    theme.ASCENT
                                                                }
                                                                trackColor={{
                                                                    true: theme.SHADOW_COLOR,
                                                                    false: theme.SHADOW_COLOR
                                                                }}
                                                                value={
                                                                    sizes.findIndex(
                                                                        (s) =>
                                                                            s.size ===
                                                                            size.size
                                                                    ) !== -1
                                                                }
                                                                onValueChange={(
                                                                    e
                                                                ) => {
                                                                    setSizes(
                                                                        (
                                                                            prev
                                                                        ) => {
                                                                            if (
                                                                                e
                                                                            ) {
                                                                                return [
                                                                                    ...prev,
                                                                                    {
                                                                                        ...size,
                                                                                        price:
                                                                                            index ===
                                                                                            0
                                                                                                ? +(+product.price).toFixed(
                                                                                                      2
                                                                                                  )
                                                                                                : +(
                                                                                                      +product.price *
                                                                                                          increase *
                                                                                                          index +
                                                                                                      +product.price
                                                                                                  ).toFixed(
                                                                                                      2
                                                                                                  )
                                                                                    }
                                                                                ];
                                                                            } else {
                                                                                return prev.filter(
                                                                                    (
                                                                                        s
                                                                                    ) =>
                                                                                        s.size !==
                                                                                        size.size
                                                                                );
                                                                            }
                                                                        }
                                                                    );
                                                                }}
                                                            />
                                                        </Row>
                                                        {product.price && (
                                                            <Text py_4 center>
                                                                $
                                                                {(index === 0
                                                                    ? +product.price
                                                                    : +product.price *
                                                                          increase *
                                                                          index +
                                                                      +product.price
                                                                ).toFixed(2)}
                                                            </Text>
                                                        )}
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    </MotiView>
                                )}
                            </AnimatePresence>
                            <InputField
                                value={product.description!}
                                multiline
                                containerStyle={{ minHeight: 80 }}
                                placeholder="Ex. a delicious coffee with milk and cream"
                                label="Product's Description"
                                onChangeText={(text) => {
                                    setProduct({
                                        ...product!,
                                        description: text
                                    });
                                }}
                            />
                        </MotiView>
                    )}
                </AnimatePresence>
                <View
                    style={{
                        position: 'absolute',
                        bottom: 60,
                        alignSelf: 'center'
                    }}
                >
                    <Button
                        containerStyle={{
                            marginTop: SIZES.isSmallDevice ? 40 : 60,
                            maxWidth: 600,
                            alignSelf: 'center',
                            marginHorizontal: 20,
                            width: '80%'
                        }}
                        title="Add Product"
                        onPress={handleAddProduct}
                    />
                </View>
            </View>

            <Modal
                visible={showCategoryModal}
                presentationStyle="overFullScreen"
                animationType="slide"
            >
                <View
                    style={{
                        padding: SIZES.padding,
                        flex: 1,
                        marginTop: SIZES.statusBarHeight
                    }}
                >
                    <Header
                        title="Select A Category"
                        onPressBack={() => setShowCategoryModal(false)}
                    />
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        {categories.map((category, index) => (
                            <CategoryTile
                                key={index}
                                category={category}
                                onPress={(c) => {
                                    setProduct({ ...product, category: c });
                                    setShowCategoryModal(false);
                                }}
                            />
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </KeyboardAwareScrollView>
    );
};

export default AddProduct;
