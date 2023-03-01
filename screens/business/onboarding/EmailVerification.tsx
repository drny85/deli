import { ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { AnimatePresence, MotiView } from 'moti';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';
import { autoLogin, logoutUser } from '../../../redux/auth/authActions';
import { emailVerifiedFunc } from '../../../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOnBoardingStackScreens } from '../../../navigation/business/typing';
import { Business } from '../../../redux/business/businessSlide';
import Divider from '../../../components/Divider';
import { useBusiness } from '../../../hooks/useBusiness';

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'EmailVerification'
>;

interface Required {
    stripeAccount: string;
    hours: Object;
    address: string;
    phone: string;
    minimunDelivery: number;
}

interface Message {
    [key: string]: string;
}
const Messages: Message = {
    stripeAccount: 'Payment Information',
    address: 'Business Address',
    image: 'Business Photo (Business Profile)',
    phone: 'Business Phone Number',
    minimumDelivery: 'Minimum Delivery Amount',
    hours: 'Business Hours',
    zips: 'Delivery Zip Codes',
    eta: 'Estimated Delivery Arrival'
};

const EmailVerification = ({ navigation }: Props) => {
    const { user, loading } = useAppSelector((state) => state.auth);
    const { business } = useBusiness(user?.id!);
    const [isVerified, setIsVerify] = useState(user?.emailVerified);
    const [steps, setSteps] = useState<string[]>([]);

    const dispatch = useAppDispatch();

    const handleRefresh = async () => {
        try {
            const func = emailVerifiedFunc('checkIfEmailIsVerified');
            console.log(user?.email);
            const { data } = await func({ email: user?.email! });
            if (!data) return;

            setIsVerify(data?.emailVerified);

            dispatch(
                autoLogin({
                    userId: data?.uid,
                    emailVerified: data?.emailVerified
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!business) return;
        Object.entries(business).forEach(([key, value]) => {
            if (
                value === null ||
                !value ||
                value.length === 0 ||
                value === undefined
            ) {
                if (Messages[key]) {
                    setSteps((prev) => [...prev, Messages[key]]);
                }
            }
        });

        return () => {
            setSteps([]);
        };
    }, [business]);
    return (
        <Screen>
            <View>
                <Text py_8 lobster center large animation={'fadeInDown'}>
                    Welcome {user?.name}
                </Text>
                <AnimatePresence>
                    {!user?.emailVerified && (
                        <MotiView
                            from={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                            transition={{ type: 'timing' }}
                        >
                            <Stack center>
                                <Text py_4>Please verify your email</Text>
                                <Text bold>{user?.email}</Text>

                                <Text py_4>Check your Spam or Junk forder</Text>
                            </Stack>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    width: '60%',
                                    marginTop: 30
                                }}
                            >
                                <Button
                                    title="Refresh"
                                    onPress={handleRefresh}
                                />
                            </View>
                        </MotiView>
                    )}
                </AnimatePresence>
            </View>
            {user?.emailVerified && (
                <View style={{ flex: 1 }}>
                    <Text raleway medium py_6 center>
                        We need to complete the next steps
                    </Text>
                    <Divider />
                    <ScrollView
                        contentContainerStyle={{
                            justifyContent: 'center',
                            marginLeft: 30
                        }}
                    >
                        {steps
                            .sort((a, b) =>
                                a.toLowerCase() > b.toLowerCase() ? 1 : -1
                            )
                            .map((step, index) => (
                                <Text
                                    py_6
                                    left
                                    animation={'fadeInLeft'}
                                    delay={index * 300}
                                    key={index.toString()}
                                >
                                    {index + 1} - {step}
                                </Text>
                            ))}
                    </ScrollView>
                    <View
                        style={{
                            alignSelf: 'center',
                            width: '60%',
                            marginBottom: 100
                        }}
                    >
                        <Button
                            title="Next Step"
                            onPress={() =>
                                navigation.navigate('BusinessInformation')
                            }
                        />
                    </View>
                </View>
            )}
            <TouchableOpacity
                onPress={() => {
                    console.log('EXIT');
                    dispatch(logoutUser());
                }}
                style={{
                    position: 'absolute',
                    bottom: 40,
                    right: 40,
                    padding: 20
                }}
            >
                <Text bold>Exit</Text>
            </TouchableOpacity>
        </Screen>
    );
};

export default EmailVerification;
