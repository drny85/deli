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
import { setPreviosRoute } from '../../../redux/consumer/settingSlide';

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
            {items.length > 0 && (
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
                        onPress={handlePress}
                    />
                </View>
            )}
        </Screen>
    );
};

export default Cart;
