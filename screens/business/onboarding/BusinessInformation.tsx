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
import { useAppSelector } from '../../../redux/store';
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

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'BusinessInformation'
>;

const BusinessInformation = ({ navigation }: Props) => {
    const { business } = useAppSelector((state) => state.business);
    const [loading, setLoading] = useState(false);
    const theme = useAppSelector((state) => state.theme);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const addressRef = useRef<GooglePlacesAutocompleteRef>(null);

    const handleNext = async () => {
        try {
            if (!address) {
                Alert.alert('No Address Provided', 'Please type an address');
                addressRef.current?.focus();
                return;
            }
            if (address.length && phone.length === 14) {
                await getConnectedStoreUrl();
            }
        } catch (error) {}
    };

    const getConnectedStoreUrl = async () => {
        try {
            if (!business) return;
            const func = connectedStore('createConnectedBusinessAccount');
            setLoading(true);
            const params: ConnectedAccountParams = {
                businessName: business?.name,
                phone,
                address,
                lastName: business.owner.lastName,
                name: business.owner.name
            };
            const { data } = await func({
                ...params
            });
            if (data.success) {
                console.log(data.result);

                navigation.navigate('BusinessStripeAccountCreation', {
                    url: data.result,
                    data: { ...params }
                });
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
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
                    <>
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
                                        console.log(details.geometry.location);
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
                            </View>
                        </KeyboardScreen>
                    </>
                }
            />

            <TouchableOpacity
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
