import {
    Alert,
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';

import { useAppDispatch, useAppSelector } from '../../../redux/store';

import Loader from '../../../components/Loader';
import { onSnapshot } from 'firebase/firestore';
import { categoriessCollection, productsCollection } from '../../../firebase';
import { Product } from '../../../redux/business/productsSlice';
import { Category } from '../../../redux/business/categoriesSlice';
import ProductCard from '../../../components/ProductCard';
import CategoriesList from '../../../components/CategoriesList';
import { SIZES } from '../../../constants';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';
import { AnimatePresence, MotiView } from 'moti';
import InputField from '../../../components/InputField';
import { FontAwesome } from '@expo/vector-icons';
import Row from '../../../components/Row';
import Divider from '../../../components/Divider';
import { addCategory } from '../../../redux/business/categoriesActions';
import { useNavigation } from '@react-navigation/native';
type Props = {};

const Products = ({}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { business, loading } = useAppSelector((state) => state.business);
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    // const { categories, loading: loadingCaterogies } = useCategories(user?.id!);
    const renderProducts: ListRenderItem<Product> = ({ item }) => {
        return <ProductCard product={item} />;
    };

    const handleAddCategory = async () => {
        if (!category.length) return;
        const exits = categories.find(
            (c) => c.name.toLowerCase() === category.toLowerCase()
        );
        if (exits !== undefined) {
            Alert.alert('Error', `Category ${category} already exists`);
            return;
        }

        try {
            const newCategory = {
                name: category
            };
            await dispatch(addCategory(newCategory));
            setShowAddCategory(false);
            setCategory('');
        } catch (error) {
            console.log(error);
        }
    };

    console.log(showAddCategory);
    useEffect(() => {
        if (!business?.id) return;

        const sub = onSnapshot(productsCollection(business.id), (snap) => {
            if (snap.empty) return;
            setProducts(
                snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
        const catSub = onSnapshot(
            categoriessCollection(business.id),
            (snap) => {
                if (snap.empty) return;
                setCategories(
                    snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
            }
        );
        return () => {
            sub();
            //catSub();
        };
    }, [business]);
    if (loading) return <Loader />;
    return (
        <Screen>
            <AnimatePresence>
                {showAddCategory && (
                    <MotiView
                        from={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            zIndex: 10
                        }}
                        style={styles.backdrop}
                        transition={{ type: 'timing' }}
                        exit={{
                            opacity: 0,
                            translateY: -SIZES.height * 0.5,
                            scale: 0
                        }}
                    >
                        <MotiView
                            from={{
                                opacity: 0,
                                translateY: -SIZES.height * 0.5
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                                height: SIZES.height * 0.5,
                                zIndex: 100
                            }}
                            transition={{ type: 'timing' }}
                            exit={{
                                opacity: 0,
                                translateY: -SIZES.height * 0.5,
                                scale: 0
                            }}
                            style={[
                                styles.categoryModal,
                                {
                                    backgroundColor:
                                        theme.SECONDARY_BUTTON_COLOR,
                                    marginTop: SIZES.statusBarHeight
                                }
                            ]}
                        >
                            <Row
                                containerStyle={{
                                    maxWidth: 600,
                                    width: '100%',
                                    alignSelf: 'center'
                                }}
                                horizontalAlign="space-between"
                            >
                                <Text py_6 title lightText>
                                    Add Category
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowAddCategory(false)}
                                    style={[
                                        styles.rounded,
                                        {
                                            shadowColor: theme.SHADOW_COLOR,
                                            backgroundColor:
                                                theme.BACKGROUND_COLOR
                                        }
                                    ]}
                                >
                                    <FontAwesome
                                        name="close"
                                        color={theme.TEXT_COLOR}
                                        size={24}
                                    />
                                </TouchableOpacity>
                            </Row>
                            <Divider />
                            <InputField
                                textTheme="light"
                                autoCapitalize="words"
                                value={category}
                                onChangeText={setCategory}
                                placeholder="Ex. Juices, Coffee"
                                label="Catefory's Name"
                                rightIcon={
                                    category.length > 0 && (
                                        <TouchableOpacity
                                            onPress={() => setCategory('')}
                                        >
                                            <FontAwesome
                                                style={{
                                                    paddingHorizontal:
                                                        SIZES.base
                                                }}
                                                name="close"
                                                size={16}
                                                color={theme.TEXT_COLOR}
                                            />
                                        </TouchableOpacity>
                                    )
                                }
                            />
                            <Button
                                title="Add Category"
                                onPress={handleAddCategory}
                            />
                        </MotiView>
                    </MotiView>
                )}
            </AnimatePresence>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id!}
                renderItem={renderProducts}
                ListHeaderComponent={
                    <View style={{ padding: SIZES.base }}>
                        <Row horizontalAlign="space-between">
                            <Text title>Categories</Text>
                            <TouchableOpacity
                                style={[
                                    styles.rounded,
                                    {
                                        shadowColor: theme.SHADOW_COLOR,
                                        backgroundColor: theme.BACKGROUND_COLOR
                                    }
                                ]}
                                onPress={() => setShowAddCategory(true)}
                            >
                                <FontAwesome
                                    name="plus"
                                    color={theme.TEXT_COLOR}
                                    size={24}
                                />
                            </TouchableOpacity>
                        </Row>
                        {/* RENDERS CATEGORIES IF ANY */}
                        {categories.length > 0 && (
                            <CategoriesList categories={categories} />
                        )}
                        {/* RENDER ADD CATEGORY BUTTON IF THERE IS NONE */}
                        {categories.length === 0 && (
                            <Stack>
                                <Text py_4>No categories</Text>
                                <Button
                                    title="Add Category"
                                    onPress={() => {
                                        setShowAddCategory(true);
                                    }}
                                />
                            </Stack>
                        )}
                        {/* GO TO ADD PRODUCT SCREEN */}
                        <Row horizontalAlign="space-between">
                            <Text title>Products</Text>
                            <TouchableOpacity
                                style={[
                                    styles.rounded,
                                    {
                                        shadowColor: theme.SHADOW_COLOR,
                                        backgroundColor: theme.BACKGROUND_COLOR
                                    }
                                ]}
                                onPress={() =>
                                    navigation.navigate('BusinessProducts', {
                                        screen: 'AddProduct'
                                    })
                                }
                            >
                                <FontAwesome
                                    name="plus"
                                    color={theme.TEXT_COLOR}
                                    size={20}
                                />
                            </TouchableOpacity>
                        </Row>
                        {products.length === 0 && (
                            <View style={{ paddingVertical: 30 }}>
                                <Text large>No products</Text>
                            </View>
                        )}
                    </View>
                }
            />
        </Screen>
    );
};

export default Products;

const styles = StyleSheet.create({
    categoryModal: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
        zIndex: 100,
        borderRadius: SIZES.radius
    },
    backdrop: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    rounded: {
        height: 40,
        width: 40,

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 3
    }
});
