import {
    Alert,
    FlatList,
    ListRenderItem,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { CartItem, setCart } from '../../../redux/consumer/cartSlide';

import CartListItem from '../../../components/CartListItem';
import Header from '../../../components/Header';
import { resetCart } from '../../../utils/saveCart';
import Button from '../../../components/Button';
import { FontAwesome } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { setPreviosRoute } from '../../../redux/consumer/settingSlide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREVIOUS_ROUTE } from '../../../constants';
import {
    BottomSheetModalProvider,
    BottomSheetModal
} from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

type Props = {};

const Cart = ({}: Props) => {
    const { items, total } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    const navigation = useNavigation();
    const { business } = useAppSelector((state) => state.business);
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    const naviagation = useNavigation();

    const renderCartItems: ListRenderItem<CartItem> = ({ item, index }) => {
        return <CartListItem item={item} />;
    };
    const handlePress = async () => {
        try {
            if (
                business?.minimumDelivery &&
                business?.minimumDelivery > total
            ) {
                Alert.alert(
                    'Minimum Delivery Required',
                    ` Please add $${(business.minimumDelivery - total).toFixed(
                        2
                    )} to continue.   `
                );
                return;
            }
            if (!user) {
                dispatch(setPreviosRoute('OrderReview'));
                await AsyncStorage.setItem(PREVIOUS_ROUTE, 'OrderReview');

                navigation.navigate('ConsumerProfile', {
                    screen: 'Auth',
                    params: { screen: 'Login' }
                });
                return;
            } else {
                if (
                    business?.minimumDelivery &&
                    business?.minimumDelivery > total
                ) {
                    Alert.alert(
                        'Minimum Delivery Required',
                        ` Please add $${(
                            business.minimumDelivery - total
                        ).toFixed(2)} to continue.   `
                    );
                    return;
                }
                //payment sucess to true
                goToOrderReview();
            }
        } catch (error) {
            console.log('error D', error);
        }
    };

    const goToOrderReview = async () => {
        try {
            //bottomSheetModalRef.current?.present();
            naviagation.navigate('ConsumerCart', {
                screen: 'OrderReview'
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteCart = () => {
        dispatch(setCart({ quantity: 0, items: [], total: 0 }));
        resetCart();
        naviagation.dispatch((state) => {
            const routes = state.routes.filter(
                (r) => r.name === ('Cart' as string)
            );
            return CommonActions.reset({
                ...state,
                routes,
                index: 0
            });
        });
    };
    return (
        <Screen>
            <Header
                title="Cart"
                rightIcon={
                    items.length > 0 ? (
                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() => {
                                Alert.alert('Deleting Cart', 'Are you sure?', [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel'
                                    },
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
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 0.8 }}>
                    <FlatList
                        data={items}
                        contentContainerStyle={{ flex: 1 }}
                        keyExtractor={(item, index) => item.id! + index}
                        renderItem={renderCartItems}
                    />
                </View>

                <View style={{ flex: 0.1 }}>
                    {items.length > 0 ? (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                alignSelf: 'center',
                                width: '70%',
                                zIndex: 100
                            }}
                        >
                            <Button
                                outlined
                                notRounded
                                title={`View Order $${total.toFixed(2)}`}
                                onPress={handlePress}
                            />
                        </View>
                    ) : (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                alignSelf: 'center',
                                width: '70%',
                                zIndex: 100
                            }}
                        >
                            <Button
                                title={'Start Shopping'}
                                onPress={() =>
                                    naviagation.navigate('ConsumerHome', {
                                        screen: 'Businesses'
                                    })
                                }
                            />
                        </View>
                    )}
                </View>
            </View>
        </Screen>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        zIndex: 100000,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    }
});
