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
import useNotifications from '../../hooks/useNotifications';
import * as Yup from 'yup';
import { Formik } from 'formik';

type Props = NativeStackScreenProps<AuthScreens, 'BusinessSignup'>;

const validationScheme = Yup.object().shape({
    businessName: Yup.string()
        .min(6, 'name must be at least 6 characters long')
        .required('business name is required'),
    name: Yup.string().min(3, 'name is too short').required('name is required'),
    lastName: Yup.string()
        .min(3, 'last name is too short')
        .required('last name is required'),
    email: Yup.string().email('invalid email').required('email is required'),
    password: Yup.string()
        .min(6, 'must be at least 6 characters')
        .required('password is required'),
    confirm: Yup.string()
        .min(6, 'must be at least 6 characters')
        .equals([Yup.ref('password'), null], 'password does not match')
});

const BusinessSignUp = ({ navigation }: Props) => {
    useNotifications();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);
    const emailRef = useRef<TextInput>(null);
    const businessNameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    // const [businessName, setBusinessName] = useState('');
    const initialValues = {
        businessName: '',
        name: '',
        lastName: '',
        email: '',
        password: '',
        confirm: ''
    };
    // const [name, setName] = useState('');
    // const [lastName, setlastName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [comfirm, setComfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleSignUp = async (values: typeof initialValues) => {
        try {
            // //const isValid = validateInputs();
            // if (!isValid) return;
            // setLoading(true);
            const { user } = await createUserWithEmailAndPassword(
                auth,
                initialValues.email,
                initialValues.password
            );
            if (!user) {
                return;
            }
            await sendEmailVerification(user);

            const business: Business = {
                name: values.businessName,
                owner: {
                    name: values.name,
                    lastName: values.lastName
                },
                stripeAccount: null,
                email: initialValues.email,
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
                milesRadius: null,
                isOpen: true
            };
            const userData: AppUser = {
                id: user.uid,
                name: values.name,
                lastName: values.lastName,
                email: values.email,
                phone: null,
                emailVerified: user.emailVerified,
                type: 'business',
                favoritesStores: [],
                deliveryAddresses: []
            };
            console.log('BUS =>', business);
            await dispatch(createBusiness(business));
            await dispatch(createUser(userData));
        } catch (error) {
            const err = error as any;

            console.log('Error @signup fro business =>', err.message);
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message);
        } finally {
            setLoading(false);
        }
    };

    // const validateInputs = (): boolean => {
    //     if (!businessName) {
    //         Alert.alert('Please enter a name for your business');
    //         businessNameRef.current?.focus();
    //         return false;
    //     }
    //     if (!name || !lastName || !email || !password) return false;
    //     if (!email && !password) {
    //         Alert.alert('Error', 'both fields are required');
    //         emailRef.current?.focus();
    //         return false;
    //     }

    //     if (!isEmailValid(email)) {
    //         Alert.alert('Error', 'Invalid email');
    //         emailRef.current?.focus();
    //         return false;
    //     }

    //     if (!password) {
    //         Alert.alert('Error', 'please type your password');
    //         passwordRef.current?.focus();
    //         return false;
    //     }
    //     if (!comfirm) {
    //         Alert.alert('Error', 'please type your password');

    //         return false;
    //     }

    //     if (password !== comfirm) {
    //         Alert.alert('Error', 'please type your password');

    //         return false;
    //     }

    //     return true;
    // };

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
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationScheme}
                        onSubmit={(values, { resetForm }) => {
                            handleSignUp(values);
                        }}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            isValid,
                            errors,
                            touched
                        }) => {
                            //console.log(errors);
                            console.log(isSubmitting, isValid);
                            const {
                                name,
                                businessName,
                                lastName,
                                email,
                                password,
                                confirm
                            } = values;
                            return (
                                <View>
                                    <InputField
                                        ref={businessNameRef}
                                        label="Business' Name"
                                        placeholder="Ex. John's Store"
                                        onBlur={handleBlur('businessName')}
                                        value={businessName}
                                        errorMessage={
                                            touched.businessName &&
                                            errors.businessName
                                                ? errors.businessName
                                                : undefined
                                        }
                                        onChangeText={handleChange(
                                            'businessName'
                                        )}
                                        autoCapitalize="words"
                                    />

                                    <Row>
                                        <InputField
                                            label="First Name"
                                            mainStyle={{
                                                width: '49%',
                                                marginRight: 3
                                            }}
                                            onBlur={handleBlur('name')}
                                            placeholder="Ex. John"
                                            errorMessage={
                                                touched.name && errors.name
                                                    ? errors.name
                                                    : undefined
                                            }
                                            value={name}
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
                                            onBlur={handleBlur('lastName')}
                                            value={lastName}
                                            errorMessage={
                                                touched.lastName &&
                                                errors.lastName
                                                    ? errors.lastName
                                                    : undefined
                                            }
                                            onChangeText={handleChange(
                                                'lastName'
                                            )}
                                            autoCapitalize="words"
                                        />
                                    </Row>

                                    <InputField
                                        label="Email Address"
                                        ref={emailRef}
                                        placeholder="Email Address"
                                        onChangeText={handleChange('email')}
                                        keyboardType="email-address"
                                        value={email}
                                        errorMessage={
                                            touched.email && errors.email
                                                ? errors.email
                                                : undefined
                                        }
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
                                        onChangeText={handleChange('password')}
                                        value={password}
                                        onBlur={handleBlur('password')}
                                        errorMessage={
                                            touched.password && errors.password
                                                ? errors.password
                                                : undefined
                                        }
                                        secureTextEntry={!showPassword}
                                        rightIcon={
                                            <FontAwesome
                                                onPress={() =>
                                                    setShowPassword(
                                                        (prev) => !prev
                                                    )
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
                                        label="Confirm Password"
                                        //ref={passwordRef}
                                        placeholder="Confirm Password"
                                        onChangeText={handleChange('confirm')}
                                        value={confirm}
                                        onBlur={handleBlur('confirm')}
                                        errorMessage={
                                            touched.confirm && errors.confirm
                                                ? errors.confirm
                                                : undefined
                                        }
                                        secureTextEntry={!showPassword}
                                        rightIcon={
                                            <FontAwesome
                                                onPress={() =>
                                                    setShowPassword(
                                                        (prev) => !prev
                                                    )
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
                                            onPress={handleSubmit}
                                        />
                                    </View>
                                </View>
                            );
                        }}
                    </Formik>
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
