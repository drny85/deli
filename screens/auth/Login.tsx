import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Screen from '../../components/Screen';

import Text from '../../components/Text';
import Button from '../../components/Button';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreens } from '../../navigation/auth/typing';
import InputField from '../../components/InputField';
import { FontAwesome } from '@expo/vector-icons';
import { isEmailValid } from '../../utils/isEmailValid';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { FIREBASE_ERRORS } from '../../utils/errorMesssages';
import Row from '../../components/Row';
import { SIZES } from '../../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { autoLogin } from '../../redux/auth/authActions';
import Loader from '../../components/Loader';
import useNotifications from '../../hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';
import { isTherePreviousRoute } from '../../utils/checkForPreviousRoute';
import Profile from '../consumer/profile/Profile';

type Props = NativeStackScreenProps<AuthScreens, 'Login'>;

const Login = ({ navigation }: Props) => {
    useNotifications();
    const dispatch = useAppDispatch();
    const nav = useNavigation();

    const { loading, user } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme);

    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const isValid = validateInputs();
            if (!isValid) return;
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (!user) {
                return;
            }

            dispatch(
                autoLogin({
                    userId: user.uid,
                    emailVerified: user.emailVerified
                })
            );
            const { success, route } = await isTherePreviousRoute();
            if (success && route && route === 'OrderReview') {
                nav.navigate('ConsumerCart', { screen: 'OrderReview' });
            }
            if (success && route && route === 'Orders') {
                nav.navigate('ConsumerOrders', { screen: 'Orders' });
            }
        } catch (error) {
            const err = error as any;

            console.log('Error =>', err.message);
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message);
        }
    };

    const validateInputs = (): boolean => {
        if (!email || !password) return false;
        if (!email && !password) {
            emailRef.current?.focus();
            Alert.alert('Error', 'both fields are required');
            return false;
        }

        if (!isEmailValid(email)) {
            emailRef.current?.focus();
            Alert.alert('Error', 'Invalid email');
            return false;
        }

        if (!password) {
            passwordRef.current?.focus();
            Alert.alert('Error', 'please type your password');
            return false;
        }

        return true;
    };

    if (loading) return <Loader />;

    if (user && user.type === 'consumer') return <Profile />;

    return (
        <Screen>
            <KeyboardAwareScrollView
                enableAutomaticScroll
                extraHeight={20}
                keyboardDismissMode="interactive"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text animation={'fadeInDown'} lobster large py_4>
                    Login{' '}
                </Text>

                <InputField
                    ref={emailRef}
                    placeholder="Email Address"
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    value={email}
                    rightIcon={
                        isEmailValid(email) && (
                            <FontAwesome
                                name="check-circle"
                                size={20}
                                color={theme.ASCENT}
                            />
                        )
                    }
                />
                <InputField
                    ref={passwordRef}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={!showPassword}
                    rightIcon={
                        <FontAwesome
                            onPress={() => setShowPassword((prev) => !prev)}
                            name={showPassword ? 'eye' : 'eye-slash'}
                            size={20}
                            color={theme.TEXT_COLOR}
                        />
                    }
                />
                <View style={{ width: '100%', maxWidth: 600, opacity: 0.6 }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'flex-end',
                            alignSelf: 'flex-end'
                        }}
                        onPress={() =>
                            navigation.navigate('ForgotPassword', { email })
                        }
                    >
                        <Text right px_6>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>

                <Button
                    containerStyle={{ width: '50%', marginVertical: 20 }}
                    isLoading={loading}
                    title="Login"
                    onPress={handleLogin}
                />

                <View
                    style={{
                        paddingVertical: SIZES.padding,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Row>
                        <Text px_6>Dont have an account?</Text>
                        <TouchableOpacity
                            style={{ padding: SIZES.base }}
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text bold>Sign Up</Text>
                        </TouchableOpacity>
                    </Row>
                </View>
            </KeyboardAwareScrollView>
        </Screen>
    );
};

export default Login;
