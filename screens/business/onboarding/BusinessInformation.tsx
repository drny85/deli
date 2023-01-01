import {
    View,
    StyleSheet,
    FlatList,
    Alert,
    TouchableOpacity
} from 'react-native';
import React, { useRef, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOnBoardingStackScreens } from '../../../navigation/business/typing';
import { SIZES } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import KeyboardScreen from '../../../components/KeyboardScreen';
import GoogleAutoComplete from '../../../components/GoogleAutoCompleteField';
import InputField from '../../../components/InputField';
import { GoogleAuthProvider } from 'firebase/auth';
import {
    GooglePlaceDetail,
    GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete';
import { formatPhone } from '../../../utils/formatPhone';
import { FontAwesome } from '@expo/vector-icons';
import { connectedStore } from '../../../firebase';
import Loader from '../../../components/Loader';
import { ConnectedAccountParams } from '../../../types';

import { Business, Coors } from '../../../redux/business/businessSlide';
import Row from '../../../components/Row';
import { updateBusiness } from '../../../redux/business/businessActions';

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'BusinessInformation'
>;

const BusinessInformation = ({ navigation }: Props) => {
    const { business } = useAppSelector((state) => state.business);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const theme = useAppSelector((state) => state.theme);
    const [coors, setCoors] = useState<Coors>({ lat: 0, lng: 0 });
    const [phone, setPhone] = useState('');
    const [milesRadius, setMilesRadius] = useState('');
    const [minimunDeliveryAmount, setMinimunDeliveryAmount] = useState('');
    const [address, setAddress] = useState('');
    const addressRef = useRef<GooglePlacesAutocompleteRef>(null);

    const handleNext = async () => {
        try {
            const isValid = validateInputs();
            console.log(isValid);
            if (!isValid) {
                return;
            }

            const businessData: Business = {
                ...business!,
                address: address,
                coors,
                phone,
                milesRadius: +milesRadius,
                minimumDelivery: +minimunDeliveryAmount
            };
            setLoading(true);

            const { payload } = await dispatch(updateBusiness(businessData));
            if (!payload) return;
            setAddress('');
            setMilesRadius('');
            setMinimunDeliveryAmount('');

            navigation.navigate('BusinessHoursScreen');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = (): boolean => {
        if (!address) {
            Alert.alert('No Address Provided', 'Please type an address');
            addressRef.current?.focus();
            return false;
        }
        if (!address.length && phone.length !== 14) {
            Alert.alert('Phone Number Provided', 'Please type a phone number');
            return false;
            // await getConnectedStoreUrl();
        }
        if (!milesRadius || !minimunDeliveryAmount) {
            Alert.alert('Minimun Delivery and Miles Radius are required');
            return false;
            // await getConnectedStoreUrl();
        }
        return true;
    };

    if (loading) return <Loader />;
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
                            maxWidth: 600,
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
                                <GoogleAutoComplete
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
                                    label="Business' Phone Number"
                                    placeholder="Ex. (212)-555-4444"
                                    onChangeText={(text) =>
                                        setPhone(formatPhone(text))
                                    }
                                    value={phone}
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
                                            keyboardType="numeric"
                                            maxLenght={2}
                                            onChangeText={
                                                setMinimunDeliveryAmount
                                            }
                                            value={minimunDeliveryAmount}
                                        />
                                    </Row>
                                    <Row
                                        horizontalAlign="space-between"
                                        containerStyle={{ width: '100%' }}
                                    >
                                        <Text bold px_4>
                                            Miles Radius Delivery:
                                        </Text>
                                        <InputField
                                            mainStyle={{
                                                width: '30%'
                                            }}
                                            contentStyle={{
                                                textAlign: 'center'
                                            }}
                                            placeholder="Ex . 5"
                                            label="Miles"
                                            onChangeText={setMilesRadius}
                                            value={milesRadius}
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
                onPress={handleNext}
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
