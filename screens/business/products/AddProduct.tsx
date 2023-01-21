import {
    Alert,
    Modal,
    ScrollView,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

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
import {
    addProduct,
    deleteProduct,
    updateProduct
} from '../../../redux/business/productsActions';
import { PRODUCT_SIZES, P_Size } from '../../../utils/sizes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loader from '../../../components/Loader';
import { FontAwesome } from '@expo/vector-icons';
import VariantionSelector from '../../../components/business/VariantionSelector';
import KeyboardScreen from '../../../components/KeyboardScreen';
import Stack from '../../../components/Stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessProductsStackScreens } from '../../../navigation/business/typing';

type Props = NativeStackScreenProps<BusinessProductsStackScreens, 'AddProduct'>;

const AddProduct = ({ route: { params } }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { business } = useAppSelector((state) => state.business);
    const navigation = useNavigation();
    const [variationQuantity, setVatientionQuantity] = useState<number>(1);
    const dispatch = useAppDispatch();
    const [comeInSizes, setComeInSizes] = useState(false);
    const [variations, setVariations] = useState<P_Size[]>([]);
    const [showVariationModal, setShowVariationModal] = useState(false);
    const { productImage } = useAppSelector((state) => state.products);
    const { categories } = useAppSelector((state) => state.categories);
    const [showCategoryModal, setShowCategoryModal] = React.useState(false);
    const [variationValidated, setVariationValidated] = useState(
        variations.some((v) => v.price !== '')
    );

    useSaveImage();
    const { pickImage } = useImage();

    const onVariantionChange = useCallback(
        (value: 'minus' | 'plus') => {
            if (value === 'minus') {
                if (variationQuantity === 2) {
                    setComeInSizes(false);
                    setVariations([]);
                    setVatientionQuantity(1);
                    //return;
                } else {
                    setVatientionQuantity((prev) => prev - 1);
                }
            } else if (value === 'plus') {
                if (variationQuantity >= 6) return;
                setVatientionQuantity((prev) => prev + 1);
            }
        },
        [variationQuantity]
    );

    useEffect(() => {
        if (variationQuantity === 1) {
            setComeInSizes(false);
        } else if (variationQuantity >= 2) {
            let vars: P_Size[] = [];
            if (params?.product) {
                vars = product.sizes;
            } else {
                vars = [...Array(variationQuantity)].map((_) => ({
                    id: '',
                    size: '',
                    price: ''
                }));
            }

            setVariations(vars);
        } else {
            console.log('HEE');
        }
    }, [variationQuantity]);

    const [product, setProduct] = React.useState<Product>({
        name: '',
        image: productImage,
        price: '',
        category: null,
        description: '',
        businessId: business?.id!,
        unitSold: 0,
        sizes: variations
    });

    const handleAddProduct = async () => {
        try {
            const isValid = validateProduct(product);
            if (!isValid) return;

            const newProduct: Product = {
                ...product,
                sizes: comeInSizes ? variations : [],
                businessId: business?.id!
            };
            if (params?.product) {
                const { payload } = await dispatch(updateProduct(newProduct));
                if (payload) {
                    navigation.goBack();
                }
            } else {
                const { payload } = await dispatch(addProduct(newProduct));
                if (payload) {
                    resetProduct();
                }
            }
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
            businessId: business?.id!,
            unitSold: 0
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
            if (variations.length === 0 || !variationValidated) {
                Alert.alert('Error', 'Please fill out the variations');
                setShowVariationModal(true);
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
    }, [productImage]);

    useEffect(() => {
        if (!params?.product) return;
        const { product } = params;

        setProduct({ ...product, price: product.price as string });

        if (product.sizes.length > 0) {
            setVatientionQuantity(product.sizes.length);
            setVariationValidated(product.sizes.some((s) => s.price !== ''));

            setComeInSizes(true);
            setProduct({ ...product, price: product.sizes[0].price });

            setVariations(
                product.sizes.map((s) => ({
                    id: s.id,
                    size: s.size,
                    price: s.price as string
                }))
            );
        }
    }, [params?.product]);

    if (!business) return <Loader />;
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
                    onPressBack={() => navigation.goBack()}
                />
            </View>
            <View
                style={{
                    maxWidth: 600,
                    alignSelf: 'center',
                    width: '100%',
                    flex: 1,
                    paddingHorizontal: 10
                }}
            >
                <View style={{ height: SIZES.height * 0.2, marginBottom: 16 }}>
                    <ProductCard
                        containerStyle={{
                            alignSelf: 'center',
                            width: '100%',
                            height: '100%'
                        }}
                        product={product}
                        onPress={pickImage}
                    />
                </View>
                <ScrollView contentContainerStyle={{ flex: 1 }}>
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
                        leftIcon={
                            <FontAwesome
                                style={{ paddingLeft: SIZES.base }}
                                name="dollar"
                                size={16}
                                color={theme.TEXT_COLOR}
                            />
                        }
                        keyboardType="numeric"
                        value={product.price.toString()}
                        maxLenght={5}
                        placeholder="Ex. 2.99"
                        label="Product's Price"
                        onChangeText={(text) =>
                            setProduct({ ...product!, price: +text })
                        }
                    />
                    <AnimatePresence>
                        {product.price && product.name && (
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
                                    <Text bold py_6>
                                        Category
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowCategoryModal(true)
                                        }
                                        style={{
                                            paddingVertical: SIZES.base,
                                            paddingHorizontal: SIZES.padding,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 20,
                                            borderRadius: 35,
                                            backgroundColor:
                                                theme.BACKGROUND_COLOR,
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
                                        marginBottom: SIZES.padding * 1.5
                                    }}
                                >
                                    <Text bold>Come In Variation?</Text>
                                    <Switch
                                        style={{ marginLeft: 6 }}
                                        trackColor={{
                                            true: theme.SHADOW_COLOR,
                                            false: theme.SHADOW_COLOR
                                        }}
                                        value={comeInSizes}
                                        onValueChange={() =>
                                            setComeInSizes((prev) => {
                                                if (prev) {
                                                    setVatientionQuantity(1);
                                                } else {
                                                    setVatientionQuantity(2);
                                                }
                                                return !prev;
                                            })
                                        }
                                        thumbColor={theme.ASCENT}
                                    />
                                </Row>

                                <VariantionSelector
                                    show={comeInSizes}
                                    onPressDone={() => {
                                        setShowVariationModal(true);
                                    }}
                                    onPressVariation={onVariantionChange}
                                    variationQuantity={variationQuantity}
                                />

                                <AnimatePresence>
                                    {variationValidated &&
                                        variations.length > 0 && (
                                            <MotiView
                                                from={{
                                                    opacity: 0,
                                                    translateY: -20
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    translateY: 0
                                                }}
                                            >
                                                <Stack
                                                    containerStyle={{
                                                        marginBottom: 12,
                                                        width: '100%',
                                                        shadowColor:
                                                            theme.SHADOW_COLOR,
                                                        shadowOffset: {
                                                            width: 4,
                                                            height: 4
                                                        },
                                                        elevation: 6,
                                                        shadowOpacity: 0.5,
                                                        shadowRadius: 6,
                                                        borderRadius:
                                                            SIZES.radius,
                                                        backgroundColor:
                                                            theme.BACKGROUND_COLOR
                                                    }}
                                                    center
                                                >
                                                    <Row
                                                        containerStyle={{
                                                            width: '80%'
                                                        }}
                                                        horizontalAlign="space-evenly"
                                                    >
                                                        {variations.map((v) => {
                                                            if (v.id === '')
                                                                return;
                                                            return (
                                                                <View
                                                                    key={
                                                                        v.id.toString() +
                                                                        v.size
                                                                    }
                                                                >
                                                                    <Text
                                                                        capitalize
                                                                        bold
                                                                    >
                                                                        {v.size}
                                                                    </Text>
                                                                    <Text
                                                                        center
                                                                    >
                                                                        $
                                                                        {
                                                                            v.price
                                                                        }
                                                                    </Text>
                                                                </View>
                                                            );
                                                        })}
                                                    </Row>
                                                </Stack>
                                            </MotiView>
                                        )}
                                </AnimatePresence>

                                <InputField
                                    value={product.description!}
                                    multiline
                                    containerStyle={{
                                        minHeight: 80
                                    }}
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
                            title={
                                params?.product
                                    ? 'Update Product'
                                    : 'Add Product'
                            }
                            onPress={handleAddProduct}
                        />
                    </View>
                </ScrollView>
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
            <Modal
                visible={showVariationModal}
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
                        title="Fill Out Variations"
                        onPressBack={() => setShowVariationModal(false)}
                        rightIcon={
                            <View>
                                <Row>
                                    <Text px_6>Add More</Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            onVariantionChange('plus')
                                        }
                                    >
                                        <FontAwesome
                                            name="plus-circle"
                                            size={32}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </TouchableOpacity>
                                </Row>
                            </View>
                        }
                    />
                    <KeyboardScreen>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                width: '100%'
                            }}
                        >
                            {variations.map((v, index) => (
                                <Row
                                    containerStyle={{
                                        width: '100%',
                                        maxWidth: 600
                                    }}
                                    key={index.toString() + v.size + v.price}
                                >
                                    <InputField
                                        mainStyle={{ width: '50%' }}
                                        value={v.size}
                                        autoCapitalize="words"
                                        placeholder="Variation Name"
                                        onChangeText={(text) => {
                                            variations[index].size = text;
                                            variations[index].id = index;
                                            setVariations([...variations]);
                                        }}
                                    />
                                    <InputField
                                        mainStyle={{ width: '70%' }}
                                        leftIcon={
                                            <FontAwesome
                                                style={{
                                                    paddingLeft: SIZES.base
                                                }}
                                                name="dollar"
                                                size={16}
                                                color={theme.TEXT_COLOR}
                                            />
                                        }
                                        keyboardType="numeric"
                                        value={`${v.price}`}
                                        placeholder="Price"
                                        onChangeText={(text) => {
                                            //console.log(text);
                                            variations[index].price = text;

                                            setVariations([...variations]);
                                        }}
                                    />
                                </Row>
                            ))}

                            <Button
                                title="Done"
                                onPress={() => setShowVariationModal(false)}
                            />
                        </View>
                    </KeyboardScreen>
                </View>
            </Modal>
        </KeyboardAwareScrollView>
    );
};

export default AddProduct;
