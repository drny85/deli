import { ScrollView } from 'react-native';
import React from 'react';

import { Category } from '../redux/business/categoriesSlice';
import CategoryTile from './CategoryTile';
import { SIZES } from '../constants';

type Props = {
    categories: Category[];
};

const CategoriesList = ({ categories }: Props) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                minHeight: 60,
                height: SIZES.height * 0.1
            }}
        >
            {categories
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((category) => (
                    <CategoryTile key={category.id} category={category} />
                ))}
        </ScrollView>
    );
};

export default CategoriesList;
