import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
    children: React.ReactNode;
};

const KeyboardScreen = ({ children }: Props) => {
    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            extraHeight={10}
            keyboardDismissMode="on-drag"
        >
            {children}
        </KeyboardAwareScrollView>
    );
};

export default KeyboardScreen;
