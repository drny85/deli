import { Alert, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import Text from '../../components/Text';
import KeyboardScreen from '../../components/KeyboardScreen';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { isEmailValid } from '../../utils/isEmailValid';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreens } from '../../navigation/auth/typing';
import Header from '../../components/Header';

type Props = NativeStackScreenProps<AuthScreens, 'ForgotPassword'>;

const ForgotPassword = ({ navigation, route: { params } }: Props) => {
    const [email, setEmail] = useState('');
    console.log(email);

    const handleSubmit = async () => {
        try {
            if (!isEmailValid(email)) {
                Alert.alert('Invalid email', 'please enter a valid email');
                return;
            }
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Email Sent',
                `Please check your inbox, junk or spam folder`
            );
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!params?.email) return;
        setEmail(params.email);
    }, [params?.email]);
    return (
        <KeyboardScreen
            containerStyle={{
                flex: 1,

                padding: 30
            }}
        >
            <Header
                title="Reset Password"
                onPressBack={() => navigation.goBack()}
            />
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    marginBottom: 30
                }}
            >
                <InputField
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholder="email address"
                />

                <Button title="Get Email Link" onPress={handleSubmit} />
            </View>
        </KeyboardScreen>
    );
};

export default ForgotPassword;
