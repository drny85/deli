import { View } from 'react-native';
import React from 'react';

import LottieView from 'lottie-react-native';
import { useAppSelector } from '../../redux/store';
import Text from '../Text';

type Props = {};

const CreatingStripeAccountLoading = ({}: Props): JSX.Element => {
    const theme = useAppSelector((state) => state.theme);

    return (
        <View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
            <LottieView
                resizeMode="contain"
                autoPlay
                style={{ flex: 1 }}
                source={
                    theme.mode === 'dark'
                        ? require('../../assets/animations/creating_dark.json')
                        : require('../../assets/animations/creating_light.json')
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

                <Text py_8 animation={'fadeInLeft'} delay={3000}>
                    Please be patient, this might take some time
                </Text>
            </View>
        </View>
    );
};

export default CreatingStripeAccountLoading;
