import {
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
    View,
    ActivityIndicator
} from 'react-native';
import React from 'react';
import Text from './Text';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
    primary?: boolean;
    secondary?: boolean;
    small?: boolean;
    outlined?: boolean;
    large?: boolean;
    isLoading?: boolean;
    notRounded?: boolean;
    title: string;
    py_4?: boolean;
    py_6?: boolean;
    onPress: () => void;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;

    textStyle?: StyleProp<TextStyle>;
    leftIcon?: React.ReactElement;
}

const Button = ({
    title,
    secondary,
    small,
    notRounded,
    isLoading,
    outlined,
    primary,
    onPress,
    disabled,
    py_4,
    py_6,
    textStyle,
    containerStyle,
    leftIcon
}: Props) => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <TouchableOpacity
            style={[
                styles.btn,
                {
                    backgroundColor: primary
                        ? theme.PRIMARY_BUTTON_COLOR
                        : secondary
                        ? theme.SECONDARY_BUTTON_COLOR
                        : outlined
                        ? theme.BACKGROUND_COLOR
                        : theme.ASCENT,
                    marginVertical: py_4 ? 8 : py_6 ? 12 : 2,
                    borderRadius: notRounded ? SIZES.radius : 35,
                    maxWidth: small ? SIZES.width * 0.33 : undefined,
                    minWidth: SIZES.width * 0.2,
                    opacity: disabled ? 0.5 : 1,
                    borderColor:
                        outlined && theme.mode === 'light'
                            ? theme.ASCENT
                            : outlined && theme.mode === 'dark'
                            ? theme.SHADOW_COLOR
                            : undefined,
                    borderWidth: outlined ? 0.5 : undefined
                },
                containerStyle
            ]}
            disabled={disabled || isLoading}
            onPress={onPress}
        >
            {leftIcon && (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10
                    }}
                >
                    {leftIcon}
                </View>
            )}
            {isLoading ? (
                <ActivityIndicator color={theme.CARD_BACKGROUND} size="small" />
            ) : (
                <Text
                    lightText={!outlined}
                    center
                    bold
                    style={[styles.text, textStyle]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 0.5,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowOffset: {
            height: 3,
            width: 3
        },
        elevation: 4,
        shadowOpacity: 0.6,
        shadowRadius: 3
    },
    text: {
        textAlign: 'center'
    }
});
