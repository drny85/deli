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
            behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
            contentContainerStyle={{ height: '100%', width: '100%' }}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <>{children}</>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default KeyboardScreen;
