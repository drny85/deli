import { Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useImage } from '../../../hooks/useImage';
import InputField from '../../../components/InputField';
import { useAppSelector } from '../../../redux/store';
import { Product } from '../../../redux/business/productsSlice';
import Row from '../../../components/Row';
import { SIZES } from '../../../constants';
import ProductCard from '../../../components/ProductCard';
import { AnimatePresence, MotiView } from 'moti';
import categoriesSlice from '../../../redux/business/categoriesSlice';
import { useCategories } from '../../../hooks/useCategories';
import CategoryTile from '../../../components/CategoryTile';
import KeyboardScreen from '../../../components/KeyboardScreen';
import Button from '../../../components/Button';
import { useSaveImage } from '../../../utils/saveImage';

type Props = {};

const AddProduct = ({}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const { productImage } = useAppSelector((state) => state.products);
    const navigation = useNavigation();
    const { sucesss } = useSaveImage();
    console.log('sucesss', sucesss);
    const [showCategoryModal, setShowCategoryModal] = React.useState(false);
    const { categories } = useCategories();

    const [product, setProduct] = React.useState<Product>({
        name: '',
        image: productImage,
        price: '',
        category: null,
        description: ''
    });

    const { pickImage } = useImage();

    const handleAddProduct = async () => {
        try {
            const isValid = validateProduct(product);

            console.log(isValid, product);
        } catch (error) {
            console.log(error);
        }
    };
    console.log('product', product);

    const validateProduct = (product: Product): boolean => {
        if (!productImage || !sucesss) {
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
    return (
        <KeyboardScreen>
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
            <View style={{ maxWidth: 600, alignSelf: 'center', width: '100%' }}>
                <ProductCard product={product} onPress={pickImage} />
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
                        setProduct({ ...product!, price: text })
                    }
                />
                <Row containerStyle={{ marginVertical: SIZES.padding }}>
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
                <InputField
                    value={product.description!}
                    multiline
                    containerStyle={{ minHeight: 80 }}
                    placeholder="Ex. a delicious coffee with milk and cream"
                    label="Product's Description"
                    onChangeText={(text) => {
                        setProduct({ ...product!, description: text });
                    }}
                />
            </View>

            <Button
                containerStyle={{ margin: 40 }}
                title="Add Product"
                onPress={handleAddProduct}
            />
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
        </KeyboardScreen>
    );
};

export default AddProduct;
