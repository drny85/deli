import {
    Alert,
    Keyboard,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../components/Screen';

import Text from '../../components/Text';
import Button from '../../components/Button';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { switchTheme } from '../../redux/themeSlide';
import { darkTheme, lightTheme } from '../../Theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreens } from '../../navigation/auth/typing';
import InputField from '../../components/InputField';
import { FontAwesome } from '@expo/vector-icons';
import { isEmailValid } from '../../utils/isEmailValid';

import KeyboardScreen from '../../components/KeyboardScreen';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { FIREBASE_ERRORS } from '../../utils/errorMesssages';
import Row from '../../components/Row';
import { SIZES } from '../../constants';
import { AnimatePresence, MotiView } from 'moti';

type Props = NativeStackScreenProps<AuthScreens, 'Signup'>;

const Signup = ({ navigation }: Props) => {
    const dispatch = useAppDispatch();
    const [notTyping, setNotTyping] = useState(true);
    const theme = useAppSelector((state) => state.theme);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [comfirm, setComfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleSignUp = async () => {
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
            console.log(user);
        } catch (error) {
            const err = error as any;

            console.log('Error =>', err.message);
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message);
        }
    };

    const validateInputs = (): boolean => {
        if (!name || !lastName || !email || !password) return false;
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

    useEffect(() => {
        const sub = Keyboard.addListener('keyboardWillShow', (e) => {
            setNotTyping(false);
        });
        const hide = Keyboard.addListener('keyboardWillHide', () => {
            setNotTyping(true);
        });

        return () => {
            Keyboard.removeSubscription(sub);
            Keyboard.removeSubscription(hide);
        };
    }, []);

    return (
        <Screen>
            <KeyboardScreen>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text py_8 animation={'fadeInDown'} lobster large py_4>
                        Sign Up{' '}
                    </Text>

                    <Row>
                        <InputField
                            label="First Name"
                            mainStyle={{ width: '49%', marginRight: 3 }}
                            placeholder="Ex. John"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                        <InputField
                            label="Last Name"
                            mainStyle={{ width: '49%', marginLeft: 3 }}
                            placeholder="Ex. Smith"
                            value={lastName}
                            onChangeText={setlastName}
                            autoCapitalize="words"
                        />
                    </Row>

                    <InputField
                        label="Email Address"
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
                        label="Password"
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
                    <InputField
                        label="Confirm Password"
                        ref={passwordRef}
                        placeholder="ConfirmPassword"
                        onChangeText={setComfirm}
                        value={comfirm}
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

                    <Button
                        containerStyle={{ width: '50%', marginVertical: 20 }}
                        isLoading={false}
                        title="Sign Up"
                        onPress={handleSignUp}
                    />
                </View>
                <AnimatePresence>
                    {notTyping && (
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'timing' }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <Row
                                containerStyle={{ marginBottom: 20 }}
                                horizontalAlign="center"
                            >
                                <Text px_6>Back to login</Text>

                                <TouchableOpacity
                                    style={{ padding: SIZES.base }}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text bold>Login</Text>
                                </TouchableOpacity>
                            </Row>
                            <Row
                                containerStyle={{ marginBottom: 20 }}
                                horizontalAlign="center"
                            >
                                <Text px_6>Need a business account?</Text>

                                <TouchableOpacity
                                    style={{ padding: SIZES.base }}
                                    onPress={() =>
                                        navigation.navigate('BusinessSignup')
                                    }
                                >
                                    <Text bold>Sign Up</Text>
                                </TouchableOpacity>
                            </Row>
                        </MotiView>
                    )}
                </AnimatePresence>
            </KeyboardScreen>
        </Screen>
    );
};

export default Signup;