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
import * as Yup from 'yup';
import { Formik } from 'formik';

const validationScheme = Yup.object().shape({
    name: Yup.string().min(3, 'name is too short').required('name is required'),
    lastName: Yup.string()
        .min(3, 'last name is too short')
        .required('last name is required'),
    email: Yup.string().email('invalid email').required('email is required'),
    phone: Yup.string().min(14, 'invalid phone').required('phone is required'),
    password: Yup.string()
        .min(6, 'must be at least 6 characters')
        .required('password is required'),
    confirm: Yup.string()
        .min(6, 'must be at least 6 characters')
        .equals([Yup.ref('password'), null], 'password does not match')
});

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

    const [showPassword, setShowPassword] = useState(false);
    const [showTransportation, setShowTransportation] = useState(false);
    const initialValues = {
        name: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        confirm: ''
    };
    const handleSignUp = async (
        values: typeof initialValues
    ): Promise<boolean> => {
        try {
            console.log(values);

            setLoading(true);
            const { name, lastName, password, email, phone } = values;
            const { user } = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            if (!user) {
                return false;
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
                transportation: transportation,
                isActive: false,
                isOnline: false,
                image: null,
                stripeAccount: null,
                deliveryAddresses: [],
                favoritesStores: []
            };

            await dispatch(createUser(userData));
            return true;
        } catch (error) {
            const err = error as any;

            console.log('Error @signup from courier =>', err.message);
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen>
            <KeyboardScreen>
                <View
                    style={{
                        //alignItems: 'center',
                        justifyContent: 'center',
                        maxWidth: 610,
                        alignSelf: 'center'
                    }}
                >
                    <Header
                        title="Signup To Drive"
                        onPressBack={() => navigation.goBack()}
                    />
                    <View style={{ height: 10 }} />
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationScheme}
                        onSubmit={async (values, { resetForm }) => {
                            const submitted = await handleSignUp(values);
                            if (submitted) {
                                resetForm();
                                setTransportation(undefined);
                            }
                        }}
                    >
                        {({
                            handleChange,
                            handleSubmit,
                            handleBlur,
                            values,
                            setFieldValue,
                            touched,
                            errors,
                            isSubmitting
                        }) => {
                            const {
                                name,
                                lastName,
                                password,
                                phone,
                                email,
                                confirm
                            } = values;

                            return (
                                <>
                                    <Row>
                                        <InputField
                                            label="First Name"
                                            mainStyle={{
                                                width: '49%',
                                                marginRight: 3
                                            }}
                                            placeholder="Ex. John"
                                            value={name}
                                            errorMessage={
                                                touched.name && errors.name
                                                    ? errors.name
                                                    : undefined
                                            }
                                            onBlur={handleBlur('name')}
                                            onChangeText={handleChange('name')}
                                            autoCapitalize="words"
                                        />
                                        <InputField
                                            label="Last Name"
                                            mainStyle={{
                                                width: '49%',
                                                marginLeft: 3
                                            }}
                                            placeholder="Ex. Smith"
                                            value={lastName}
                                            errorMessage={
                                                touched.lastName &&
                                                errors.lastName
                                                    ? errors.lastName
                                                    : undefined
                                            }
                                            onBlur={handleBlur('lastName')}
                                            onChangeText={handleChange(
                                                'lastName'
                                            )}
                                            autoCapitalize="words"
                                        />
                                    </Row>
                                    <InputField
                                        label="Phone"
                                        value={phone}
                                        errorMessage={
                                            touched.phone && errors.phone
                                                ? errors.phone
                                                : undefined
                                        }
                                        onBlur={handleBlur('phone')}
                                        onChangeText={(text) =>
                                            setFieldValue(
                                                'phone',
                                                formatPhone(text)
                                            )
                                        }
                                        rightIcon={
                                            phone.length === 14 && (
                                                <FontAwesome
                                                    name="check-circle"
                                                    size={20}
                                                    color={theme.ASCENT}
                                                />
                                            )
                                        }
                                        keyboardType="number-pad"
                                        placeholder="Ex.(123)-456-7890"
                                    />

                                    <InputField
                                        label="Email Address"
                                        ref={emailRef}
                                        placeholder="Email Address"
                                        onChangeText={handleChange('email')}
                                        keyboardType="email-address"
                                        onBlur={handleBlur('email')}
                                        errorMessage={
                                            touched.email && errors.email
                                                ? errors.email
                                                : undefined
                                        }
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
                                        containerStyle={{ alignSelf: 'center' }}
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
                                                from={{
                                                    opacity: 0,
                                                    translateY: -20
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    translateY: 0,
                                                    width: '100%'
                                                }}
                                            >
                                                <InputField
                                                    label="Password"
                                                    mainStyle={{
                                                        width:
                                                            SIZES.width * 0.95,
                                                        maxWidth: 600
                                                    }}
                                                    ref={passwordRef}
                                                    placeholder="Password"
                                                    errorMessage={
                                                        touched.password &&
                                                        errors.password
                                                            ? errors.password
                                                            : undefined
                                                    }
                                                    onBlur={handleBlur(
                                                        'password'
                                                    )}
                                                    onChangeText={handleChange(
                                                        'password'
                                                    )}
                                                    value={password}
                                                    secureTextEntry={
                                                        !showPassword
                                                    }
                                                    rightIcon={
                                                        <FontAwesome
                                                            onPress={() =>
                                                                setShowPassword(
                                                                    (prev) =>
                                                                        !prev
                                                                )
                                                            }
                                                            name={
                                                                showPassword
                                                                    ? 'eye'
                                                                    : 'eye-slash'
                                                            }
                                                            size={20}
                                                            color={
                                                                theme.TEXT_COLOR
                                                            }
                                                        />
                                                    }
                                                />
                                                <InputField
                                                    mainStyle={{
                                                        width:
                                                            SIZES.width * 0.95,
                                                        maxWidth: 600
                                                    }}
                                                    label="Confirm Password"
                                                    ref={passwordRef}
                                                    onBlur={handleBlur(
                                                        'confirm'
                                                    )}
                                                    placeholder="ConfirmPassword"
                                                    errorMessage={
                                                        touched.confirm &&
                                                        errors.confirm
                                                            ? errors.confirm
                                                            : undefined
                                                    }
                                                    onChangeText={handleChange(
                                                        'confirm'
                                                    )}
                                                    value={confirm}
                                                    secureTextEntry={
                                                        !showPassword
                                                    }
                                                    rightIcon={
                                                        <FontAwesome
                                                            onPress={() =>
                                                                setShowPassword(
                                                                    (prev) =>
                                                                        !prev
                                                                )
                                                            }
                                                            name={
                                                                showPassword
                                                                    ? 'eye'
                                                                    : 'eye-slash'
                                                            }
                                                            size={20}
                                                            color={
                                                                theme.TEXT_COLOR
                                                            }
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
                                            isLoading={loading || isSubmitting}
                                            disabled={loading}
                                            title="Sign Up"
                                            onPress={() => {
                                                if (!transportation) {
                                                    Alert.alert(
                                                        'Error',
                                                        'Please select a transportation type'
                                                    );
                                                    setShowTransportation(true);
                                                    return;
                                                }
                                                handleSubmit();
                                            }}
                                        />
                                    </View>
                                </>
                            );
                        }}
                    </Formik>
                </View>

                <View>
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
                    <Header title="Pick One" />
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
                                        onPress={() => {
                                            setTransportation('DRIVING');
                                            setShowTransportation(false);
                                        }}
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
                                        onPress={() => {
                                            setTransportation('BICYCLING');
                                            setShowTransportation(false);
                                        }}
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
