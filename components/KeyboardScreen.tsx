import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    extraHeight?: number;
};

const KeyboardScreen = ({ children, containerStyle, extraHeight }: Props) => {
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={containerStyle}
            keyboardShouldPersistTaps="handled"
            extraHeight={extraHeight ? extraHeight : 10}
            keyboardDismissMode="on-drag"
        >
            {children}
        </KeyboardAwareScrollView>
    );
};

export default KeyboardScreen;
