import { FlatList, ListRenderItem, View } from 'react-native';
import React from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
    addToCart,
    CartItem,
    removeFromCart
} from '../../../redux/consumer/cartSlide';
import Row from '../../../components/Row';
import { SIZES } from '../../../constants';
import Quantifier from '../../../components/Quantifier';

type Props = {};

const Cart = ({}: Props) => {
    const { items, quantity, total } = useAppSelector((state) => state.cart);
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const renderCartItems: ListRenderItem<CartItem> = ({ item, index }) => {
        return (
            <View
                style={{
                    width: '100%',
                    padding: SIZES.base,
                    backgroundColor: theme.BACKGROUND_COLOR,
                    marginVertical: SIZES.base,
                    elevation: 4,
                    shadowOffset: { width: 3, height: 3 },
                    shadowColor: theme.SHADOW_COLOR,
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    borderRadius: SIZES.base
                }}
            >
                <Row horizontalAlign="space-between">
                    <Row
                        containerStyle={{
                            flexGrow: 1,
                            width: '45%'
                        }}
                        horizontalAlign="flex-start"
                    >
                        <Text left>{item.quantity}</Text>
                        <Text px_4>{item.name}</Text>
                    </Row>
                    <Row
                        containerStyle={{
                            flexGrow: 1,
                            width: '45%'
                        }}
                        horizontalAlign="space-between"
                    >
                        <Text left px_4>
                            {item.size === null ? item.price : item.size.price}
                            ea
                        </Text>
                        <Text>
                            {
                                +(
                                    +(item.size === null
                                        ? item.price
                                        : item.size.price) * item.quantity
                                ).toFixed(2)
                            }
                        </Text>
                    </Row>
                </Row>
                <Quantifier
                    onPressLeft={() => {
                        console.log('removing');
                        dispatch(removeFromCart({ ...item, quantity: 1 }));
                    }}
                    onPressRight={() => {
                        console.log('Adding');
                        dispatch(addToCart({ ...item, quantity: 1 }));
                    }}
                    quantity={item.quantity}
                />
            </View>
        );
    };
    return (
        <Screen>
            <Text title center>
                Cart{' '}
            </Text>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => item.id! + index}
                    renderItem={renderCartItems}
                />
            </View>
        </Screen>
    );
};

export default Cart;
