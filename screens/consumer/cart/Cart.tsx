import {
    Alert,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    View
} from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { CartItem, setCart } from '../../../redux/consumer/cartSlide';

import CartListItem from '../../../components/CartListItem';
import Header from '../../../components/Header';
import { resetCart } from '../../../utils/saveCart';
import Button from '../../../components/Button';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type Props = {};

const Cart = ({}: Props) => {
    const { items, quantity, total } = useAppSelector((state) => state.cart);
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const naviagation = useNavigation();

    const renderCartItems: ListRenderItem<CartItem> = ({ item, index }) => {
        return <CartListItem item={item} />;
    };
    console.log(total);

    const handleDeleteCart = () => {
        dispatch(setCart({ quantity: 0, items: [], total: 0 }));
        resetCart();
    };
    return (
        <Screen>
            <Header
                title="Cart"
                rightIcon={
                    total > 0 ? (
                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() => {
                                Alert.alert('Deleting Cart', 'Are you sure?', [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Yes, Delete',
                                        onPress: handleDeleteCart,
                                        style: 'destructive'
                                    }
                                ]);
                            }}
                        >
                            <FontAwesome
                                name="trash-o"
                                size={26}
                                color={theme.TEXT_COLOR}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ paddingRight: 12 }} />
                    )
                }
            />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => item.id! + index}
                    renderItem={renderCartItems}
                />
            </View>
            {quantity > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        alignSelf: 'center',
                        width: '70%'
                    }}
                >
                    <Button
                        title={`View Order $${total.toFixed(2)}`}
                        onPress={() => {
                            naviagation.navigate('ConsumerCart', {
                                screen: 'OrderReview'
                            });
                        }}
                    />
                </View>
            )}
        </Screen>
    );
};

export default Cart;
