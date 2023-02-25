import { View } from 'react-native';
import React, { useEffect, useRef } from 'react';

import LottieView from 'lottie-react-native';
import { useAppSelector } from '../../redux/store';
import Text from '../Text';
import { SIZES } from '../../constants';

type Props = {};

const OnBoardingStripeLottiView = ({}: Props): JSX.Element => {
    const theme = useAppSelector((state) => state.theme);

    return (
        <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
            <LottieView
                resizeMode="contain"
                autoPlay
                style={{ flex: 1 }}
                source={
                    theme.mode === 'dark'
                        ? require('../../assets/animations/stripe_loading_dark.json')
                        : require('../../assets/animations/stripe_loading_light.json')
                }
            />
            <View
                style={{
                    alignSelf: 'center',
                    marginTop: SIZES.statusBarHeight
                }}
            >
                <Text py_6 center animation={'fadeInDown'} lobster large>
                    One more step to go
                </Text>
            </View>
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
                >
                    Taking you to setup your payment profile
                </Text>
            </View>
        </View>
    );
};

export default OnBoardingStripeLottiView;
