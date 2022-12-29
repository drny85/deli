import { StyleSheet, View } from 'react-native';
import React from 'react';
import Text from './Text';
import {
    addToCart,
    CartItem,
    removeFromCart
} from '../redux/consumer/cartSlide';
import { SIZES } from '../constants';
import { useAppDispatch, useAppSelector } from '../redux/store';
import Row from './Row';
import Quantifier from './Quantifier';
import { MotiView } from 'moti';

type Props = {
    item: CartItem;
};

const CartListItem = ({ item }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    return (
        <MotiView
            from={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, translateX: -100 }}
            transition={{
                type: 'spring',
                stiffness: 500
            }}
            style={[
                styles.container,
                {
                    backgroundColor: theme.BACKGROUND_COLOR,
                    shadowColor: theme.SHADOW_COLOR
                }
            ]}
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
                containerStyle={{ height: 36 }}
                onPressLeft={() => {
                    dispatch(removeFromCart({ ...item, quantity: 1 }));
                }}
                onPressRight={() => {
                    dispatch(addToCart({ ...item, quantity: 1 }));
                }}
                quantity={item.quantity}
            />
        </MotiView>
    );
};

export default CartListItem;
const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: SIZES.base,

        marginVertical: SIZES.base,
        elevation: 4,
        shadowOffset: { width: 3, height: 3 },

        shadowOpacity: 0.4,
        shadowRadius: 4,
        borderRadius: SIZES.base
    }
});
