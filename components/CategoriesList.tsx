import { ScrollView, TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from './Text';
import { MotiView, MotiScrollView } from 'moti';
import { Category } from '../redux/business/categoriesSlice';
import CategoryTile from './CategoryTile';
import { SIZES } from '../constants';

type Props = {
    categories: Category[];
};

const CategoriesList = ({ categories }: Props) => {
    console.log(categories);
    return (
        <ScrollView
            horizontal
            contentContainerStyle={{
                minHeight: 60,
                height: SIZES.height * 0.1,
                
            }}
        >
            {categories.map((category) => (
                <CategoryTile key={category.id} category={category} />
            ))}
        </ScrollView>
    );
};

export default CategoriesList;
