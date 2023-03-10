import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Text from './Text';

import { MotiView } from 'moti';
import Row from './Row';
import { useAppSelector } from '../redux/store';

type Props = {
    title?: string;
    onPressBack?: () => void;
    iconColor?: string;
    titleColor?: string;
    rightIcon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
};

const Header = ({
    onPressBack,
    title,
    iconColor,
    rightIcon,
    titleColor,
    containerStyle
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <MotiView
            style={containerStyle}
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing' }}
        >
            <Row horizontalAlign="space-between">
                {onPressBack ? (
                    <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={onPressBack}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={26}
                            color={iconColor ? iconColor : theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                ) : (
                    <View />
                )}
                {title ? (
                    <Text
                        style={{ color: titleColor || theme.TEXT_COLOR }}
                        lobster
                        large
                        center
                    >
                        {title}
                    </Text>
                ) : (
                    <View />
                )}
                {rightIcon ? rightIcon : <View />}
            </Row>
        </MotiView>
    );
};

export default Header;
