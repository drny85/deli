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
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props extends TextInputProps {
    label?: string;
    ref?: any;
    placeholder: string;
    value: string;
    onChangeText: (value: string) => void;
    leftIcon?: React.ReactNode | undefined;
    rightIcon?: React.ReactNode | undefined;
    errorMessage?: string | React.ReactNode | undefined;
    contentStyle?: StyleProp<TextStyle>;
    keyboardType?: TextInput['props']['keyboardType'];
    maxLenght?: number;
    containerStyle?: ViewStyle;
    errorStyle?: StyleProp<TextStyle>;
    multiline?: boolean;
    upper?: boolean;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    mainStyle?: ViewStyle;
    onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
    secureTextEntry?: boolean;
    returnKeyLabel?: string;
    textTheme?: 'light' | 'dark';
    p_y?: number;
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
            secureTextEntry,
            p_y,
            errorStyle,
            upper,
            textTheme
        },
        ref
    ) => {
        const theme = useAppSelector((state) => state.theme);

        return (
            <View style={[{ maxWidth: 600 }, mainStyle]}>
                {/* LABEL */}
                <View>
                    <Text
                        capitalize={!upper}
                        lightText={textTheme === 'light'}
                        darkText={textTheme === 'dark'}
                        uppercase={upper}
                        bold
                        px_4
                    >
                        {label}
                    </Text>
                </View>
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

                            shadowOpacity: 0.4,
                            shadowRadius: 3,
                            elevation: 5,

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
                                fontSize: SIZES.font,
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
            </View>
        );
    }
);

export default InputField;
