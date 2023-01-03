import React, { FC } from 'react';
import {
    View,
    TextInput,
    StyleProp,
    TextStyle,
    ViewStyle,
    TextInputProps,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    Animated,
    TextInputFocusEventData
} from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import Text from './Text';

interface Props extends TextInputProps {
    label?: string;
    nogap?: boolean;
    ref?: any;
    placeholder: string;
    centerLabel?: boolean;
    value: string;
    smallLabel?: boolean;
    onChangeText: (value: string) => void;
    leftIcon?: React.ReactNode | undefined;
    rightIcon?: React.ReactNode | undefined;
    errorMessage?: string | React.ReactNode | undefined;
    contentStyle?: StyleProp<TextStyle>;
    keyboardType?: TextInput['props']['keyboardType'];
    maxLenght?: number;
    containerStyle?: StyleProp<ViewStyle>;
    errorStyle?: StyleProp<TextStyle>;
    multiline?: boolean;
    upper?: boolean;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    mainStyle?: StyleProp<ViewStyle>;
    onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
    secureTextEntry?: boolean;
    returnKeyLabel?: string;
    textTheme?: 'light' | 'dark';
    p_y?: number;
    textContainerStyle?: StyleProp<TextStyle>;
    returnKeyType?: TextInputProps['returnKeyType'];
    autoCapitalize?: TextInput['props']['autoCapitalize'];
}

const InputField: FC<Props> = React.forwardRef(
    (
        {
            label,
            placeholder,
            value,
            onChangeText,
            contentStyle,
            leftIcon,
            rightIcon,
            centerLabel,
            keyboardType,
            containerStyle,
            errorMessage,
            multiline,
            autoCapitalize,
            onFocus,
            returnKeyLabel,
            mainStyle,
            onKeyPress,
            returnKeyType,
            maxLenght,
            smallLabel,
            secureTextEntry,
            nogap,
            p_y,
            errorStyle,
            textContainerStyle,
            upper,
            textTheme
        },
        ref
    ) => {
        const theme = useAppSelector((state) => state.theme);

        return (
            <View style={[{ maxWidth: 600 }, mainStyle]}>
                {/* LABEL */}
                {label && (
                    <View>
                        <Text
                            style={textContainerStyle}
                            capitalize={!upper}
                            lightText={textTheme === 'light'}
                            darkText={textTheme === 'dark'}
                            uppercase={upper}
                            center={centerLabel}
                            bold
                            small={smallLabel}
                        >
                            {label}
                        </Text>
                    </View>
                )}

                {/* INPUT */}
                <Animated.View
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: theme.BACKGROUND_COLOR,
                            paddingHorizontal: SIZES.base,
                            paddingVertical: 2,
                            borderRadius: SIZES.radius * 2,
                            //marginHorizontal: 10,
                            shadowOffset: { width: -4, height: -4 },
                            shadowColor: theme.SHADOW_COLOR,
                            borderBottomWidth: 0.3,
                            borderBottomColor: theme.SHADOW_COLOR,

                            shadowOpacity: 0.4,
                            shadowRadius: 3,
                            elevation: 5,
                            marginVertical: nogap ? 2 : SIZES.padding,

                            width: '100%'
                        },
                        containerStyle
                    ]}
                >
                    {leftIcon}

                    <TextInput
                        ref={ref as any}
                        style={[
                            {
                                flex: 1,
                                paddingHorizontal: SIZES.base,
                                fontSize: 14,
                                fontFamily: 'montserrat',
                                paddingVertical: p_y ? p_y : 14,
                                color:
                                    theme.mode === 'dark'
                                        ? '#ffffff'
                                        : '#212121'
                            },
                            contentStyle
                        ]}
                        value={value}
                        placeholderTextColor={
                            theme.mode === 'dark' ? '#f7f2f2ab' : '#21212173'
                        }
                        multiline={multiline}
                        keyboardType={keyboardType}
                        autoCorrect={false}
                        onFocus={onFocus}
                        maxLength={maxLenght}
                        onKeyPress={onKeyPress}
                        //autoCompleteType='off'
                        returnKeyLabel={returnKeyLabel}
                        returnKeyType={returnKeyType}
                        autoCapitalize={autoCapitalize || 'none'}
                        secureTextEntry={secureTextEntry || false}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                    />
                    <AnimatePresence>
                        {rightIcon && (
                            <MotiView
                                from={{ opacity: 0, scale: 0 }}
                                animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                                transition={{ type: 'timing' }}
                                exit={{ opacity: 0, scale: 0 }}
                            >
                                {rightIcon}
                            </MotiView>
                        )}
                    </AnimatePresence>
                </Animated.View>
                {/* ERROR */}
                {errorMessage && (
                    <View>
                        <Text
                            style={[
                                {
                                    color: '#d16f6f',
                                    textAlign: 'right',
                                    marginRight: SIZES.padding,
                                    paddingTop: 5
                                },
                                errorStyle
                            ]}
                        >
                            {errorMessage}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
);

export default InputField;
