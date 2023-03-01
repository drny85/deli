import {
    View,
    StyleSheet,
    FlatList,
    Alert,
    TouchableOpacity,
    Image
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOnBoardingStackScreens } from '../../../navigation/business/typing';
import { IMAGE_PLACEHOLDER, SIZES } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import KeyboardScreen from '../../../components/KeyboardScreen';
import GoogleAutoComplete from '../../../components/GoogleAutoCompleteField';
import InputField from '../../../components/InputField';
import {
    GooglePlaceDetail,
    GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete';
import { formatPhone } from '../../../utils/formatPhone';
import { FontAwesome } from '@expo/vector-icons';
import Loader from '../../../components/Loader';

import {
    Business,
    Coors,
    setBusiness
} from '../../../redux/business/businessSlide';
import Row from '../../../components/Row';
import { updateBusiness } from '../../../redux/business/businessActions';
import ZipCodes from '../../../components/ZipCodes';
import { useBusiness } from '../../../hooks/useBusiness';
import { useBusinessImage } from '../../../hooks/useBusinessImage';
import { LinearGradient } from 'expo-linear-gradient';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'BusinessInformation'
>;

const BusinessInformation = ({ navigation }: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const { business, loading: l } = useBusiness(user?.id!);

    const nav = useNavigation();
    const { business: buss } = useAppSelector((state) => state.business);
    const { pickImage } = useBusinessImage();
    const dispatch = useAppDispatch();
    const googleRef = useRef<GooglePlacesAutocompleteRef>(null);
    const [loading, setLoading] = useState(false);
    const theme = useAppSelector((state) => state.theme);
    const [coors, setCoors] = useState<Coors>({ lat: 0, lng: 0 });
    const [phone, setPhone] = useState('');
    const [eta, setEta] = useState('');

    const [minimunDeliveryAmount, setMinimunDeliveryAmount] = useState('');
    const [address, setAddress] = useState('');
    const addressRef = useRef<GooglePlacesAutocompleteRef>(null);

    const savePictureAndContinue = async () => {
        const isValid = validateInputs();
        // console.log(isValid, buss?.image?.startsWith('file://'), buss?.image);
        console.log(isValid);
        if (!isValid) return;
        if (buss?.image && !buss?.image?.startsWith('file://')) {
            console.log('___');
            handleNext();
            return;
        }

        if (!buss?.image?.startsWith('file://')) return;
        try {
            const image = buss.image;
            const id = image.split('ImagePicker')[1].split('.')[0];
            const ext = image.split('.').pop();
            const filename = id + '.' + ext;
            const response = await fetch(image);
            const blob = await response.blob();

            const uploadRef = ref(
                storage,
                `${business?.id!}-${business?.name}/${filename}`
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
                    console.log(imageUrl);
                    dispatch(setBusiness({ ...business!, image: imageUrl }));
                    await handleNext();
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleNext = async () => {
        try {
            const isValid = validateInputs();
            console.log('V', isValid);
            if (!isValid) {
                return;
            }

            const businessData: Business = {
                ...business!,
                address: address,
                coors,
                phone,
                eta: +eta,
                image: buss?.image!,
                minimumDelivery: +minimunDeliveryAmount
            };
            setLoading(true);

            const { payload } = await dispatch(updateBusiness(businessData));
            if (!payload) return;
            setAddress('');

            setMinimunDeliveryAmount('');

            navigation.navigate('BusinessHoursScreen');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = (): boolean => {
        if (!buss?.image!) {
            Alert.alert(
                'Please provide an image for your business, something nice because it will be seen as the face of your business'
            );
            pickImage();
            return false;
        }
        if (address.length < 10) {
            Alert.alert('No Address Provided', 'Please type an address');
            addressRef.current?.focus();
            return false;
        }
        if (phone.length !== 14) {
            Alert.alert('Phone Number Provided', 'Please type a phone number');
            return false;
            // await getConnectedStoreUrl();
        }
        if (business?.zips.length === 0) {
            Alert.alert(
                'Please provide zip codes where you are going to deliver'
            );
            return false;
        }

        if (!minimunDeliveryAmount) {
            Alert.alert('Provide a minimum delivery amount');
            return false;
            // await getConnectedStoreUrl();
        }
        if (!eta) {
            Alert.alert('Provide an eatimared delivery arrival');
            return false;
            // await getConnectedStoreUrl();
        }

        return true;
    };
    useEffect(() => {
        if (!business) return;
        const sub = nav.addListener('focus', () => {
            console.log('FOCUS', business);

            if (business.address) {
                googleRef.current?.setAddressText(business.address);
                setAddress(business.address);
            }
            if (business.phone) {
                setPhone(business.phone);
            }
            if (business.minimumDelivery && !minimunDeliveryAmount) {
                setMinimunDeliveryAmount(business.minimumDelivery.toString());
            }
            if (business.eta && !eta) {
                setEta(business.eta.toString());
            }
            if (business.image) {
                setBusiness({ ...business, image: business.image });
            }
        });

        return sub;
    }, [nav, business]);

    if (loading || l) return <Loader />;
    return (
        <Screen>
            <FlatList
                keyboardShouldPersistTaps="handled"
                data={[]}
                keyExtractor={(item) => item}
                renderItem={() => <View />}
                ListHeaderComponent={
                    <View
                        style={{
                            maxWidth: 640,
                            alignSelf: 'center',
                            marginTop: 20
                        }}
                    >
                        <Header
                            onPressBack={() => navigation.goBack()}
                            title="Business' Info"
                        />

                        <KeyboardScreen>
                            <View style={styles.container}>
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={{
                                        alignSelf: 'center',
                                        width: SIZES.width * 0.5,
                                        height: SIZES.height * 0.15,
                                        borderRadius: SIZES.radius,
                                        marginBottom: 10
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri:
                                                business?.image ||
                                                buss?.image ||
                                                IMAGE_PLACEHOLDER
                                        }}
                                        resizeMode="cover"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: SIZES.radius
                                        }}
                                    />
                                    <LinearGradient
                                        colors={[
                                            'rgba(0,0,0,0.2)',
                                            'rgba(0,0,0,0.6)',
                                            'rgba(0,0,0,0.8)'
                                        ]}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            overflow: 'hidden',
                                            borderRadius: 10,
                                            width: '100%',
                                            padding: 10
                                        }}
                                    >
                                        <Text lobster lightText large>
                                            {business?.name}
                                        </Text>
                                        {address && (
                                            <Text lightText>
                                                {address.slice(0, -15)}
                                            </Text>
                                        )}
                                        {phone && (
                                            <Text lightText>{phone}</Text>
                                        )}
                                        {minimunDeliveryAmount && (
                                            <Text lightText>
                                                minimum delivery $ $
                                                {minimunDeliveryAmount}
                                            </Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                                <GoogleAutoComplete
                                    ref={googleRef}
                                    label="Business' Address"
                                    placeholder="Start typing the address"
                                    onPress={(
                                        _: any,
                                        details: GooglePlaceDetail
                                    ) => {
                                        setCoors(details.geometry.location);
                                        setAddress(details.formatted_address);
                                    }}
                                />

                                <InputField
                                    nogap
                                    p_y={8}
                                    contentStyle={{ marginLeft: 4 }}
                                    label="Business' Phone Number"
                                    placeholder="Ex. (212)-555-4444"
                                    onChangeText={(text) =>
                                        setPhone(formatPhone(text))
                                    }
                                    value={phone}
                                    keyboardType="number-pad"
                                    rightIcon={
                                        phone.length === 14 && (
                                            <FontAwesome
                                                name="check-circle"
                                                color={theme.TEXT_COLOR}
                                                size={18}
                                            />
                                        )
                                    }
                                />
                                <View style={{ marginVertical: SIZES.base }}>
                                    <ZipCodes
                                        zips={
                                            business?.zips &&
                                            business.zips.length
                                                ? business.zips
                                                : []
                                        }
                                    />
                                </View>

                                <View style={{ width: '100%' }}>
                                    <Row
                                        horizontalAlign="space-between"
                                        containerStyle={{ width: '100%' }}
                                    >
                                        <Text bold px_4>
                                            Mininim Delivery Amount:
                                        </Text>
                                        <InputField
                                            mainStyle={{ width: '30%' }}
                                            placeholder="Ex . 10"
                                            label="Amount"
                                            contentStyle={{
                                                textAlign: 'center'
                                            }}
                                            keyboardType="number-pad"
                                            maxLenght={2}
                                            onChangeText={
                                                setMinimunDeliveryAmount
                                            }
                                            value={minimunDeliveryAmount}
                                        />
                                    </Row>
                                </View>
                                <View style={{ width: '100%' }}>
                                    <Row
                                        horizontalAlign="space-between"
                                        containerStyle={{ width: '100%' }}
                                    >
                                        <Text bold px_4>
                                            Estimated Delivery Arrival (ETA):
                                        </Text>
                                        <InputField
                                            mainStyle={{ width: '30%' }}
                                            placeholder="Ex . 10"
                                            label="Minutes"
                                            contentStyle={{
                                                textAlign: 'center'
                                            }}
                                            keyboardType="number-pad"
                                            maxLenght={2}
                                            onChangeText={setEta}
                                            value={eta}
                                        />
                                    </Row>
                                </View>
                            </View>
                        </KeyboardScreen>
                    </View>
                }
            />

            <TouchableOpacity
                //disabled={!validateInputs()}
                onPress={savePictureAndContinue}
                style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 40,
                    right: 30,
                    padding: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text px_4 bold>
                    Next
                </Text>
                <FontAwesome
                    name="chevron-right"
                    size={20}
                    color={theme.TEXT_COLOR}
                />
            </TouchableOpacity>
        </Screen>
    );
};

export default BusinessInformation;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.padding,
        alignItems: 'center',
        flex: 1,
        width: '100%'
    }
});
