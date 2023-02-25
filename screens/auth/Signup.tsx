import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../components/Screen';

import Text from '../../components/Text';
import Button from '../../components/Button';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthScreens } from '../../navigation/auth/typing';
import InputField from '../../components/InputField';
import { FontAwesome } from '@expo/vector-icons';
import { isEmailValid } from '../../utils/isEmailValid';

import KeyboardScreen from '../../components/KeyboardScreen';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { FIREBASE_ERRORS } from '../../utils/errorMesssages';
import Row from '../../components/Row';
import { SIZES } from '../../constants';
import { AnimatePresence, MotiView } from 'moti';
import { AppUser } from '../../redux/auth/authSlide';
import { createUser } from '../../redux/auth/authActions';
import { setPreviosRoute } from '../../redux/consumer/settingSlide';
import { useNavigation } from '@react-navigation/native';
import useNotifications from '../../hooks/useNotifications';
import { formatPhone } from '../../utils/formatPhone';
import { isTherePreviousRoute } from '../../utils/checkForPreviousRoute';
import Header from '../../components/Header';

type Props = NativeStackScreenProps<AuthScreens, 'Signup'>;

const Signup = ({ navigation }: Props) => {
    useNotifications();
    const dispatch = useAppDispatch();
    const nav = useNavigation();
    const [notTyping, setNotTyping] = useState(true);
    const { previousRoute } = useAppSelector((state) => state.settings);
    const theme = useAppSelector((state) => state.theme);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [comfirm, setComfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        (async () => {
            const { success, route } = await isTherePreviousRoute();
            console.log(success, route);
        })();
    }, []);

    const handleSignUp = async () => {
        try {
            const isValid = validateInputs();
            if (!isValid) return;
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            if (!user) {
                return;
            }
            const data: AppUser = {
                id: user.uid,
                email,
                emailVerified: user.emailVerified,
                lastName,
                phone,
                name,
                type: 'consumer',
                favoritesStores: [],
                deliveryAddresses: []
            };

            await dispatch(createUser(data));
        } catch (error) {
            const err = error as any;

            console.log('Error =>', err.message);
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message);
        } finally {
            dispatch(setPreviosRoute(null));
        }
    };

    const validateInputs = (): boolean => {
        if (!name || !lastName) {
            Alert.alert('Error', 'Please enter a name and last name');
            return false;
        }
        if (formatPhone(phone).length !== 14) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return false;
        }
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

    return (
        <Screen>
            <KeyboardScreen>
                <View
                    style={{
                        flex: 1,
                        // alignItems: 'center',
                        justifyContent: 'center',
                        maxWidth: 610,
                        alignSelf: 'center'
                    }}
                >
                    <Header
                        containerStyle={{ marginBottom: 15 }}
                        title="Sign Up"
                        onPressBack={() => navigation.goBack()}
                    />

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
                        label="Phone"
                        value={phone}
                        onChangeText={(text) => setPhone(formatPhone(text))}
                        keyboardType="number-pad"
                        placeholder="Ex.(123)-456-7890"
                    />

                    <InputField
                        label="Email Address"
                        ref={emailRef}
                        placeholder="john.smith@email.com"
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

                    <View
                        style={{
                            width: '80%',
                            alignSelf: 'center',
                            marginVertical: 20
                        }}
                    >
                        <Button
                            containerStyle={{
                                width: '100%'
                            }}
                            textStyle={{ width: '100%' }}
                            isLoading={false}
                            title="Sign Up"
                            onPress={handleSignUp}
                        />
                    </View>
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
                            <Row
                                containerStyle={{ marginBottom: 20 }}
                                horizontalAlign="center"
                            >
                                <Text px_6>Sign up to drive?</Text>

                                <TouchableOpacity
                                    style={{ padding: SIZES.base }}
                                    onPress={() =>
                                        navigation.navigate('CourierSignup')
                                    }
                                >
                                    <Text bold>Become a Courier</Text>
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
