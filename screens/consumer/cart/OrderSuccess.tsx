import { StyleSheet, View } from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerCartStackScreens } from '../../../navigation/consumer/typing';

type Props = NativeStackScreenProps<ConsumerCartStackScreens, 'OrderSuccess'>;

const OrderSuccess = ({
    navigation: nav,
    route: {
        params: { orderId }
    }
}: Props) => {
    //const navigation = useNavigation();
    const state = nav.getState();
    console.log(state);
    // useLayoutEffect(() => {
    //     navigation.dispatch((state) => {
    //         const routes = state.routes.filter(
    //             (r) => r.name === ('OrderSuccess' as any)
    //         );
    //         //RESET ALL NAVIGATION BUT CART SCREEN
    //         return CommonActions.reset({
    //             ...state,
    //             routes: [...routes],
    //             index: 0
    //         });
    //     });
    // }, []);
    useEffect(() => {
        return () => {};
    }, []);
    return (
        <Screen>
            <Header
                title="Congratulations"
                onPressBack={() => {
                    nav.dispatch((state) => {
                        const routes = state.routes.filter(
                            (r) => r.name === ('Cart' as any)
                        );
                        //RESET ALL NAVIGATION BUT CART SCREEN
                        return CommonActions.reset({
                            ...state,
                            routes: [...routes],
                            index: 0
                        });
                    });
                    nav.navigate('OrdersScreen', {
                        screen: 'OrderDetails',
                        params: { orderId }
                    });
                }}
            />
            s<Text>OrderSuccess</Text>
        </Screen>
    );
};

export default OrderSuccess;

const styles = StyleSheet.create({});
