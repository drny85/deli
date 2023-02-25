import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useAppDispatch } from '../../../redux/store';
import { AnimatePresence, Image, MotiView } from 'moti';
import Stack from '../../../components/Stack';
import Button from '../../../components/Button';
import { connectedStore, emailVerifiedFunc, storage } from '../../../firebase';
import {
    autoLogin,
    logoutUser,
    updateUser
} from '../../../redux/auth/authActions';
import Divider from '../../../components/Divider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CourierOnBoardingScreens } from '../../../navigation/courier/typing';
import { ConnectedAccountParams, Courier } from '../../../types';
import Loader from '../../../components/Loader';
import { useCurrentUser } from '../../../hooks/useAuth';
import { IMAGE_PLACEHOLDER, SIZES } from '../../../constants';

import { useCourierImage } from '../../../hooks/useCourierImage';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

type Props = NativeStackScreenProps<
    CourierOnBoardingScreens,
    'CourierEmailVerification'
>;

const CourierEmailVerification = ({ navigation }: Props) => {
    const { currentUser: user } = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const [pictureReady, setPictureReady] = useState(false);
    const { pickImage, imageUrl: image } = useCourierImage();

    const dispatch = useAppDispatch();
    const [steps, setSteps] = useState<string[]>([
        'Business Address',
        'Business Type (Grocery Store)',
        'Owner Cell Phone Number',
        'Payment Information (checking account)'
    ]);

    const savePicture = async () => {
        try {
            if (!image || !user) return;
            const id = image.split('ImagePicker')[1].split('.')[0];
            const ext = image.split('.').pop();
            const filename = id + '.' + ext;
            const response = await fetch(image);
            setLoading(true);
            const blob = await response.blob();

            const uploadRef = ref(
                storage,
                `${user?.id}-${'courier'}/${filename}`
            );
            const uploadTask = uploadBytesResumable(uploadRef, blob);
            uploadTask.on(
                'state_changed',
                (snapshot) => {},
                (error) => {
                    console.log('@Error: ', error);
                },
                async () => {
                    const imageUrl = await getDownloadURL(
                        uploadTask.snapshot.ref
                    );
                    dispatch(updateUser({ ...user, image: imageUrl }));
                    setPictureReady(true);
                }
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = async () => {
        try {
            const func = connectedStore('createConnectedBusinessAccount');
            setLoading(true);
            const params: ConnectedAccountParams = {
                businessName: `${user?.name} Delivery`,
                phone: user?.phone!,
                // address: business.address!,
                lastName: user?.lastName!,
                name: user?.name!,
                type: 'courier'
            };
            const { data } = await func({
                ...params
            });
            if (data.success) {
                console.log(data.result);
                console.log('Still in business hours');
                navigation.navigate('CourierStripeAccountCreation', {
                    url: data.result,
                    data: { ...params }
                });
            }
        } catch (error) {
            const err = error as any;
            console.log(
                'Error creating courier connected account',
                err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            const func = emailVerifiedFunc('checkIfEmailIsVerified');

            const { data } = await func({ email: user?.email! });
            if (!data) return;

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
        if (!user) return;
        if ((user as Courier).image) {
            setPictureReady(true);
        }
    }, [user]);
    if (loading) return <Loader />;
    return (
        <Screen>
            <View>
                <Text py_8 lobster center large animation={'fadeInDown'}>
                    Welcome {user?.name}
                </Text>
                <AnimatePresence>
                    {!(user as Courier)?.emailVerified && (
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
                            <Text
                                animation={'fadeInLeft'}
                                delay={800}
                                center
                                py_6
                            >
                                After verifying your email, please click Refresh
                            </Text>
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
            {user?.emailVerified && (user as Courier).image && pictureReady && (
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
                        {steps.map((step, index) => (
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
                        <Stack>
                            <Text py_4>
                                Please have your SSN ready for verification
                                purpose
                            </Text>
                        </Stack>
                    </ScrollView>
                    <View
                        style={{
                            alignSelf: 'center',
                            width: '60%',
                            marginBottom: 100
                        }}
                    >
                        <Button
                            disabled={loading}
                            title="Next Step"
                            onPress={handleNextStep}
                        />
                    </View>
                </View>
            )}
            {user?.emailVerified &&
                !(user as Courier).image &&
                !pictureReady && (
                    <View style={{ flex: 1 }}>
                        <Text raleway medium py_6 center>
                            We need a picture / photo of you
                        </Text>
                        <Divider />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: '60%',
                                marginBottom: 100,
                                flex: 1
                            }}
                        >
                            <View style={{ alignSelf: 'center' }}>
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={{
                                        height: SIZES.width * 0.7,
                                        width: SIZES.width * 0.7,

                                        borderRadius: (SIZES.width * 0.7) / 2,
                                        overflow: 'hidden',
                                        marginVertical: 30
                                    }}
                                >
                                    <Image
                                        resizeMode="cover"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            overflow: 'hidden'
                                        }}
                                        source={{
                                            uri:
                                                (user as Courier).image ||
                                                image ||
                                                IMAGE_PLACEHOLDER
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Button
                                disabled={loading}
                                title="Next Step"
                                onPress={savePicture}
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

export default CourierEmailVerification;
