import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Row from '../../../components/Row';
import { SIZES } from '../../../constants';
import Divider from '../../../components/Divider';
import InputField from '../../../components/InputField';
import { FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { addCategory } from '../../../redux/business/categoriesActions';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/Button';

type Props = {};

const AddCategoryScreen = ({}: Props) => {
    const navigation = useNavigation();
    const [category, setCategory] = useState('');
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const { categories } = useAppSelector((state) => state.categories);
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

            setCategory('');
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <MotiView
            from={{
                opacity: 0,
                translateY: -20
            }}
            animate={{
                opacity: 1,
                translateY: 0
            }}
            transition={{ type: 'timing' }}
            exit={{
                opacity: 0,
                translateY: -20,
                scale: 0
            }}
            style={[
                styles.categoryModal,
                {
                    backgroundColor: theme.SECONDARY_BUTTON_COLOR,
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
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.rounded,
                        {
                            shadowColor: theme.SHADOW_COLOR,
                            backgroundColor: theme.BACKGROUND_COLOR
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
                        <TouchableOpacity onPress={() => setCategory('')}>
                            <FontAwesome
                                style={{
                                    paddingHorizontal: SIZES.base
                                }}
                                name="close"
                                size={16}
                                color={theme.TEXT_COLOR}
                            />
                        </TouchableOpacity>
                    )
                }
            />
            <Button title="Add Category" onPress={handleAddCategory} />
        </MotiView>
    );
};

export default AddCategoryScreen;

const styles = StyleSheet.create({
    categoryModal: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
        flex: 1,
        borderRadius: SIZES.radius
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
