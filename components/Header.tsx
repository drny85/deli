import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Text from './Text';

import { MotiView } from 'moti';
import Row from './Row';
import { useAppSelector } from '../redux/store';

type Props = {
    title?: string;
    onPressBack?: () => void;
    onPressRight?: () => void;
};

const Header = ({ onPressBack, onPressRight, title }: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <MotiView
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
                            color={theme.TEXT_COLOR}
                        />
                    </TouchableOpacity>
                ) : (
                    <View />
                )}
                {title ? (
                    <Text lobster large center>
                        {title}
                    </Text>
                ) : (
                    <View />
                )}
                {onPressRight ? (
                    <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={onPressRight}
                    ></TouchableOpacity>
                ) : (
                    <View />
                )}
            </Row>
        </MotiView>
    );
};

export default Header;