import { Easing, StyleSheet, View } from 'react-native';
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
import { MotiView, AnimatePresence } from 'moti';
import { Image } from 'react-native-expo-image-cache';

type Props = {
    item: CartItem;
};

const CartListItem = ({ item }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    return (
        <AnimatePresence>
            {item && (
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -20 }}
                    transition={{
                        type: 'timing',
                        duration: 900
                    }}
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.BACKGROUND_COLOR,
                            shadowColor: theme.SHADOW_COLOR
                        }
                    ]}
                >
                    <View
                        style={{
                            width: '100%'
                        }}
                    >
                        <Row horizontalAlign="space-between">
                            <View style={{ width: '30%' }}>
                                <Image
                                    uri={item.image!}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        maxHeight: 100,
                                        resizeMode: 'contain',
                                        overflow: 'hidden',
                                        borderTopLeftRadius: SIZES.base,
                                        borderBottomLeftRadius: SIZES.base
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    paddingHorizontal: 10,
                                    flexGrow: 1,
                                    maxWidth: 500
                                }}
                            >
                                <Row
                                    containerStyle={{ flexGrow: 1 }}
                                    horizontalAlign="space-between"
                                >
                                    {/* <Text px_4 bold>
                                        {item.quantity}
                                    </Text> */}
                                    <Text raleway_italic>
                                        {item.quantity}
                                        {' - '}
                                        <Text raleway_italic>{item.name}</Text>
                                    </Text>
                                    <Text>
                                        {item.size
                                            ? item.size.price
                                            : item.price}{' '}
                                        ea
                                    </Text>
                                </Row>
                                <Row horizontalAlign="space-between">
                                    <Quantifier
                                        containerStyle={{
                                            width: SIZES.width * 0.3,
                                            height: 30
                                        }}
                                        onPressLeft={() => {
                                            dispatch(
                                                removeFromCart({
                                                    ...item,
                                                    quantity: 1
                                                })
                                            );
                                        }}
                                        onPressRight={() => {
                                            dispatch(
                                                addToCart({
                                                    ...item,
                                                    quantity: 1
                                                })
                                            );
                                        }}
                                        quantity={item.quantity}
                                    />
                                    <Text capitalize>
                                        {item.size?.size || ''}
                                    </Text>
                                    <Text bold>
                                        $
                                        {
                                            +(
                                                +(item.size === null
                                                    ? item.price
                                                    : item.size.price) *
                                                item.quantity
                                            ).toFixed(2)
                                        }
                                    </Text>
                                </Row>
                            </View>
                        </Row>
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
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
        maxHeight: 100,
        shadowOpacity: 0.4,
        shadowRadius: 4,
        borderRadius: SIZES.base
    }
});
