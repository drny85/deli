import { Pressable, View } from 'react-native';
import React from 'react';

import Text from './Text';
import { ORDER_TYPE, switchOrderType } from '../redux/consumer/ordersSlide';
import { SIZES } from '../constants';
import Row from './Row';
import { Image, MotiView } from 'moti';
import { useAppDispatch, useAppSelector } from '../redux/store';

const WIDTH = 240;

const OrderTypeSwitcher = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);
    const { orderType } = useAppSelector((state) => state.orders);
    return (
        <View
            style={{
                height: 40,
                marginVertical: SIZES.base,
                position: 'relative',
                width: WIDTH,
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: 20
            }}
        >
            <Row
                containerStyle={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.SHADOW_COLOR,
                    overflow: 'hidden',
                    borderRadius: 20
                }}
                horizontalAlign="center"
            >
                <Pressable
                    style={{ width: WIDTH / 2 }}
                    onPress={() =>
                        dispatch(switchOrderType(ORDER_TYPE.delivery))
                    }
                >
                    <MotiView
                        style={{
                            padding: 10,

                            borderTopLeftRadius: 20,
                            borderBottomLeftRadius: 20
                        }}
                    >
                        <Text center>Delivery</Text>
                    </MotiView>
                </Pressable>
                <Pressable
                    style={{ width: WIDTH / 2 }}
                    onPress={() => dispatch(switchOrderType(ORDER_TYPE.pickup))}
                >
                    <MotiView
                        style={{
                            padding: 10,
                            borderTopRightRadius: 20,
                            borderBottomRightRadius: 20,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text center>Pick Up</Text>
                    </MotiView>
                </Pressable>
            </Row>
            <MotiView
                style={{
                    position: 'absolute',
                    width: WIDTH / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    zIndex: 300
                }}
                from={{
                    width: WIDTH / 2,
                    left: orderType === ORDER_TYPE.delivery ? 0 : undefined,
                    right: orderType === ORDER_TYPE.pickup ? 0 : undefined,
                    top: 0,
                    bottom: 0,
                    backgroundColor: theme.SHADOW_COLOR
                }}
                animate={{
                    backgroundColor: theme.ASCENT,
                    width: WIDTH / 2,
                    left: orderType === ORDER_TYPE.delivery ? 0 : undefined,
                    right: orderType === ORDER_TYPE.delivery ? 0 : undefined,
                    top: 0,
                    bottom: 0,
                    borderTopLeftRadius:
                        orderType === ORDER_TYPE.delivery ? 20 : 0,
                    borderBottomLeftRadius:
                        orderType === ORDER_TYPE.delivery ? 20 : 0,
                    borderBottomRightRadius:
                        orderType === ORDER_TYPE.delivery ? 0 : 20,
                    borderTopRightRadius:
                        orderType === ORDER_TYPE.delivery ? 0 : 20,
                    translateX:
                        orderType === ORDER_TYPE.delivery ? 0 : WIDTH / 2
                }}
                transition={{ type: 'timing' }}
            >
                <Row>
                    <Image
                        animate={{ translateX: [1, -1] }}
                        transition={{ type: 'timing', repeat: 5 }}
                        source={
                            orderType === ORDER_TYPE.pickup
                                ? require('../assets/images/walking.png')
                                : require('../assets/images/delivery.png')
                        }
                        resizeMode="contain"
                        style={{ width: 34, height: 34, tintColor: 'white' }}
                    />
                    <Text lightText bold>
                        {orderType === ORDER_TYPE.delivery
                            ? 'Delivery'
                            : 'Pick Up'}
                    </Text>
                </Row>
            </MotiView>
        </View>
    );
};

export default OrderTypeSwitcher;
