import {
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform
} from 'react-native';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

const KeyboardScreen = ({ children }: Props) => {
    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={-120}
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <>{children}</>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default KeyboardScreen;
