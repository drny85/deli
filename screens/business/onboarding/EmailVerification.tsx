import { TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'EmailVerification'
>;

const EmailVerification = ({ navigation }: Props) => {
    const { user, loading } = useAppSelector((state) => state.auth);

    const [isVerified, setIsVerify] = useState(user?.emailVerified);
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
                    emailVerified: data?.emailVerified,
                    type: 'business'
                })
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Screen center>
            <Text py_8 lobster large animation={'fadeInDown'}>
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
                    </MotiView>
                )}
            </AnimatePresence>
            {isVerified ? (
                <Button
                    title="Next Step"
                    onPress={() => navigation.navigate('PrepareInfoScreen')}
                />
            ) : (
                <Button
                    isLoading={loading}
                    title="Refresh"
                    onPress={handleRefresh}
                />
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
