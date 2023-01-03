import { View } from 'react-native';
import React from 'react';

import LottieView from 'lottie-react-native';
import { useAppSelector } from '../redux/store';
import Text from './Text';
import { SIZES } from '../constants';

type Props = {};

const PaymentLoading = ({}: Props): JSX.Element => {
    const theme = useAppSelector((state) => state.theme);

    return (
        <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
            <LottieView
                resizeMode="contain"
                autoPlay
                style={{ flex: 1 }}
                source={
                    theme.mode === 'dark'
                        ? require('../assets/animations/payment_dark.json')
                        : require('../assets/animations/payment_light.json')
                }
            />
            <View
                style={{
                    position: 'absolute',
                    bottom: 80,
                    alignSelf: 'center'
                }}
            >
                <Text
                    medium
                    raleway_italic
                    animation={'fadeInUp'}
                    delay={800}
                    center
                    capitalize
                >
                    Getting payment ready
                </Text>
            </View>
        </View>
    );
};

export default PaymentLoading;
