import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';

import { useAppDispatch, useAppSelector } from '../../../redux/store';

import Loader from '../../../components/Loader';

import CategoriesList from '../../../components/CategoriesList';
import { SIZES } from '../../../constants';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';

import Row from '../../../components/Row';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCategoriesAndProducts } from '../../../hooks/useCategoriesAndProducts';
import ProductsList from '../../../components/ProductsList';

type Props = {};

const Products = ({}: Props) => {
   const theme = useAppSelector((state) => state.theme);
   const navigation = useNavigation();
   const dispatch = useAppDispatch();
   const { categories, products, loading } = useCategoriesAndProducts();

   if (loading) return <Loader />;
   return (
      <Screen>
         <View style={{ padding: SIZES.base }}>
            <Row horizontalAlign="space-between">
               <Text title>Categories ({categories.length})</Text>
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
                        screen: 'AddCategoryScreen'
                     })
                  }
               >
                  <FontAwesome name="plus" color={theme.TEXT_COLOR} size={24} />
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
                        navigation.navigate('BusinessProducts', {
                           screen: 'AddCategoryScreen'
                        });
                     }}
                  />
               </Stack>
            )}
            {/* GO TO ADD PRODUCT SCREEN */}
            <Row horizontalAlign="space-between">
               <Text title>Products ({products.length})</Text>
               <TouchableOpacity
                  style={[
                     styles.rounded,
                     {
                        shadowColor: theme.SHADOW_COLOR,
                        backgroundColor: theme.BACKGROUND_COLOR
                     }
                  ]}
                  onPress={() => {
                     if (!categories.length) {
                        Alert.alert(
                           'No Categories',
                           'Please add at least one category'
                        );
                        return;
                     }
                     navigation.navigate('BusinessProducts', {
                        screen: 'AddProduct'
                     });
                  }}
               >
                  <FontAwesome name="plus" color={theme.TEXT_COLOR} size={20} />
               </TouchableOpacity>
            </Row>
            {products.length === 0 && (
               <View style={{ paddingVertical: 30 }}>
                  <Text large>No products</Text>
               </View>
            )}
         </View>

         <ProductsList
            categories={categories}
            products={products}
            onPressProduct={() => {}}
         />
      </Screen>
   );
};

export default Products;

const styles = StyleSheet.create({
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
