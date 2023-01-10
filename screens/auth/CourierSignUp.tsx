import { Alert, Modal, TextInput, TouchableOpacity, View } from 'react-native';
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
import { createUser } from '../../redux/auth/authActions';
import useNotifications from '../../hooks/useNotifications';
import { formatPhone } from '../../utils/formatPhone';
import { Courier } from '../../types';
import { AnimatePresence, MotiView } from 'moti';
import Header from '../../components/Header';
import Stack from '../../components/Stack';

type Props = NativeStackScreenProps<AuthScreens, 'CourierSignup'>;

const CourierSignUp = ({ navigation }: Props) => {
    useNotifications();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);
    const emailRef = useRef<TextInput>(null);

    const passwordRef = useRef<TextInput>(null);
    const [transportation, setTransportation] =
        useState<Courier['transportation']>();
    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [comfirm, setComfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showTransportation, setShowTransportation] = useState(false);
    const handleSignUp = async () => {
        try {
            const isValid = validateInputs();
            if (!isValid) {
                Alert.alert("Error, 'Please fill in all required fields");
                return;
            }
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

            const userData: Courier = {
                id: user.uid,
                name,
                lastName,
                email,
                phone,
                emailVerified: user.emailVerified,
                type: 'courier',
                transportation: transportation
            };

            await dispatch(createUser(userData));
        } catch (error) {
            const err = error as any;

            console.log('Error @signup fro business =>', err.message);
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message);
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = (): boolean => {
        if (!name || !lastName || !email || !password) return false;
        if (!email && !password) {
            Alert.alert('Error', 'both fields are required');
            emailRef.current?.focus();
            return false;
        }

        if (phone.length !== 14) {
            Alert.alert('Error', 'Invalid phone');

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
                        Sign Up to Drive{' '}
                    </Text>
                    <View style={{ height: 10 }} />
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
                    <Button
                        title={
                            transportation
                                ? `${transportation}`
                                : 'Pick your Transportation'
                        }
                        onPress={() => {
                            setShowTransportation(true);
                        }}
                    />
                    <AnimatePresence>
                        {transportation && (
                            <MotiView
                                style={{ width: '100%' }}
                                from={{ opacity: 0, translateY: -20 }}
                                animate={{
                                    opacity: 1,
                                    translateY: 0,
                                    width: '100%'
                                }}
                            >
                                <InputField
                                    label="Password"
                                    mainStyle={{
                                        width: SIZES.width * 0.95,
                                        maxWidth: 600
                                    }}
                                    ref={passwordRef}
                                    placeholder="Password"
                                    onChangeText={setPassword}
                                    value={password}
                                    secureTextEntry={!showPassword}
                                    rightIcon={
                                        <FontAwesome
                                            onPress={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            name={
                                                showPassword
                                                    ? 'eye'
                                                    : 'eye-slash'
                                            }
                                            size={20}
                                            color={theme.TEXT_COLOR}
                                        />
                                    }
                                />
                                <InputField
                                    mainStyle={{
                                        width: SIZES.width * 0.95,
                                        maxWidth: 600
                                    }}
                                    label="Confirm Password"
                                    ref={passwordRef}
                                    placeholder="ConfirmPassword"
                                    onChangeText={setComfirm}
                                    value={comfirm}
                                    secureTextEntry={!showPassword}
                                    rightIcon={
                                        <FontAwesome
                                            onPress={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            name={
                                                showPassword
                                                    ? 'eye'
                                                    : 'eye-slash'
                                            }
                                            size={20}
                                            color={theme.TEXT_COLOR}
                                        />
                                    }
                                />
                            </MotiView>
                        )}
                    </AnimatePresence>

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
            <Modal
                visible={showTransportation}
                animationType="slide"
                presentationStyle="formSheet"
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: theme.BACKGROUND_COLOR,
                        paddingTop: 20
                    }}
                >
                    <Header
                        title="Pick One"
                        onPressBack={() => setShowTransportation(false)}
                    />
                    <View
                        style={{
                            justifyContent: 'center',
                            flex: 1,
                            alignItems: 'center'
                        }}
                    >
                        <Stack>
                            <Row
                                containerStyle={{
                                    width: '100%'
                                }}
                                horizontalAlign="space-evenly"
                            >
                                <MotiView
                                    style={{
                                        alignItems: 'center',
                                        padding: SIZES.base,
                                        borderRadius: SIZES.radius
                                    }}
                                    animate={{
                                        // borderWidth: 1,
                                        borderWidth:
                                            transportation == 'DRIVING' ? 1 : 0,
                                        borderColor:
                                            transportation === 'DRIVING'
                                                ? theme.TEXT_COLOR
                                                : undefined,
                                        scale:
                                            transportation === 'DRIVING'
                                                ? [1, 1.2, 1.1]
                                                : 1
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{ flexGrow: 1 }}
                                        onPress={() =>
                                            setTransportation('DRIVING')
                                        }
                                    >
                                        <FontAwesome
                                            name="car"
                                            size={36}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        bold={transportation === 'DRIVING'}
                                        py_4
                                        center
                                    >
                                        DRIVING
                                    </Text>
                                </MotiView>
                                <MotiView
                                    style={{
                                        alignItems: 'center',
                                        padding: SIZES.base,
                                        borderRadius: SIZES.radius
                                    }}
                                    animate={{
                                        borderWidth:
                                            transportation == 'BICYCLING'
                                                ? 1
                                                : 0,
                                        borderColor:
                                            transportation === 'BICYCLING'
                                                ? theme.TEXT_COLOR
                                                : undefined,
                                        scale:
                                            transportation === 'BICYCLING'
                                                ? [1, 1.2, 1.1]
                                                : 1
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{ flexGrow: 1 }}
                                        onPress={() =>
                                            setTransportation('BICYCLING')
                                        }
                                    >
                                        <FontAwesome
                                            name="bicycle"
                                            size={36}
                                            color={theme.TEXT_COLOR}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        bold={transportation === 'BICYCLING'}
                                        py_4
                                        center
                                    >
                                        BICYCLING
                                    </Text>
                                </MotiView>
                            </Row>
                        </Stack>
                    </View>
                </View>
            </Modal>
        </Screen>
    );
};

export default CourierSignUp;
