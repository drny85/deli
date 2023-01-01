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

import KeyboardScreen from '../../components/KeyboardScreen';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification
} from 'firebase/auth';
import { auth } from '../../firebase';
import { FIREBASE_ERRORS } from '../../utils/errorMesssages';
import Row from '../../components/Row';
import { SIZES } from '../../constants';
import { createBusiness } from '../../redux/business/businessActions';
import { Business } from '../../redux/business/businessSlide';

import { AppUser } from '../../redux/auth/authSlide';
import Loader from '../../components/Loader';
import { createUser } from '../../redux/auth/authActions';

type Props = NativeStackScreenProps<AuthScreens, 'BusinessSignup'>;

const BusinessSignUp = ({ navigation }: Props) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);
    const emailRef = useRef<TextInput>(null);
    const businessNameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const [businessName, setBusinessName] = useState('');

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
            setLoading(true);
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            if (!user) {
                return;
            }
            await sendEmailVerification(user);

            const business: Business = {
                name: businessName,
                owner: { name, lastName },
                stripeAccount: null,
                email,
                isActive: true,
                userId: user.uid,
                profileCompleted: false,
                address: null,
                coors: null,
                hasItems: false,
                minimumDelivery: null,
                phone: null,
                hours: null,
                image: null,
                charges_enabled: false,
                milesRadius: null
            };
            const userData: AppUser = {
                id: user.uid,
                name,
                lastName,
                email,
                emailVerified: user.emailVerified,
                type: 'business'
            };
            console.log('BUS =>', business);
            await dispatch(createBusiness(business));
            await dispatch(createUser(userData));

            navigation.navigate('Login');
        } catch (error) {
            const err = error as any;

            console.log('Error @signup fro business =>', err.message);
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message);
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = (): boolean => {
        if (!businessName) {
            Alert.alert('Please enter a name for your business');
            businessNameRef.current?.focus();
            return false;
        }
        if (!name || !lastName || !email || !password) return false;
        if (!email && !password) {
            Alert.alert('Error', 'both fields are required');
            emailRef.current?.focus();
            return false;
        }

        if (!isEmailValid(email)) {
            Alert.alert('Error', 'Invalid email');
            emailRef.current?.focus();
            return false;
        }

        if (!password) {
            Alert.alert('Error', 'please type your password');
            passwordRef.current?.focus();
            return false;
        }
        if (!comfirm) {
            Alert.alert('Error', 'please type your password');

            return false;
        }

        if (password !== comfirm) {
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
                        alignItems: 'center',
                        justifyContent: 'center',
                        maxWidth: 610,
                        alignSelf: 'center'
                    }}
                >
                    <Text py_8 animation={'fadeInDown'} lobster large py_4>
                        Sign Up for Business{' '}
                    </Text>

                    <InputField
                        ref={businessNameRef}
                        label="Business' Name"
                        placeholder="Ex. John's Store"
                        value={businessName}
                        onChangeText={setBusinessName}
                        autoCapitalize="words"
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
                            isLoading={loading}
                            disabled={loading}
                            title="Sign Up"
                            onPress={handleSignUp}
                        />
                    </View>
                </View>
                <View>
                    <Row
                        containerStyle={{ marginBottom: 20 }}
                        horizontalAlign="center"
                    >
                        <Text px_6>Back to login</Text>

                        <TouchableOpacity
                            style={{ padding: SIZES.base }}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text bold>Login</Text>
                        </TouchableOpacity>
                    </Row>
                    <Row
                        containerStyle={{ marginBottom: 20 }}
                        horizontalAlign="center"
                    >
                        <Text px_6>Need a consumer account?</Text>

                        <TouchableOpacity
                            style={{ padding: SIZES.base }}
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text bold>Sign Up</Text>
                        </TouchableOpacity>
                    </Row>
                </View>
            </KeyboardScreen>
        </Screen>
    );
};

export default BusinessSignUp;
