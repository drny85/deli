import { TouchableOpacity, View } from 'react-native';
import React from 'react';

import { MotiView } from 'moti';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import { Category } from '../redux/business/categoriesSlice';
import Text from './Text';
type Props = {
    category: Category;
    onPress?: (category: Category) => void;
};

const CategoryTile = ({ category, onPress }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <MotiView
            style={{
                height: 36,
                borderRadius: SIZES.radius * 2,
                backgroundColor: theme.BACKGROUND_COLOR,
                paddingVertical: SIZES.base,
                paddingHorizontal: SIZES.padding,
                shadowOffset: { width: 3, height: 3 },
                borderWidth: 0.2,
                borderColor: theme.SHADOW_COLOR,
                margin: SIZES.base,
                elevation: 4,
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowColor: theme.SHADOW_COLOR
            }}
            from={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            transition={{ type: 'timing' }}
        >
            <TouchableOpacity
                onPress={() => {
                    if (category && onPress) {
                        onPress(category);
                    }
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text capitalize>{category.name}</Text>
            </TouchableOpacity>
        </MotiView>
    );
};

export default CategoryTile;
