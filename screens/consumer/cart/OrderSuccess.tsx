import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerCartStackScreens } from '../../../navigation/consumer/typing';
import Loader from '../../../components/Loader';
import { View } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { setOrder } from '../../../redux/consumer/ordersSlide';

type Props = NativeStackScreenProps<ConsumerCartStackScreens, 'OrderSuccess'>;

const OrderSuccess = ({
    navigation: nav,
    route: {
        params: { orderId }
    }
}: Props) => {
    //const navigation = useNavigation();
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();

    const goToOrderDetails = () => {
        nav.dispatch((state) => {
            const routes = [
                {
                    name: 'Orders'
                }
            ];

            return CommonActions.reset({
                routes,
                index: 0
            });
        });
        dispatch(setOrder(null));
        nav.navigate('OrdersScreen', {
            screen: 'Orders',
            params: { orderId: orderId }
        });
    };

    if (!orderId) return <Loader />;
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.BACKGROUND_COLOR
            }}
        >
            <AnimatedLottieView
                style={{ flex: 1 }}
                autoPlay
                loop={false}
                onAnimationFinish={goToOrderDetails}
                resizeMode="contain"
                source={
                    theme.mode === 'dark'
                        ? require('../../../assets/animations/success_dark.json')
                        : require('../../../assets/animations/success_light.json')
                }
            />
        </View>
    );
};

export default OrderSuccess;
