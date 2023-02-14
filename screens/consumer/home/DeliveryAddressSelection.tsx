import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import GoogleAutoComplete from '../../../components/GoogleAutoCompleteField';
import {
    Order,
    saveDeliveryAddress
} from '../../../redux/consumer/ordersSlide';
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { AnimatePresence, MotiView } from 'moti';
import InputField from '../../../components/InputField';
import { SIZES } from '../../../constants';
import Button from '../../../components/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { updateUser } from '../../../redux/auth/authActions';
import Stack from '../../../components/Stack';

type Props = {};

const DeliveryAddressSelection = ({}: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme);
    const navigation = useNavigation();
    const [address, setAddress] = useState<Order['address']>();
    const dispatch = useAppDispatch();
    const handleSave = async () => {
        if (!address) return;
        try {
            dispatch(saveDeliveryAddress({ ...address! }));
            if (user) {
                if (user.deliveryAddresses) {
                    const deliveryAddress = [...user.deliveryAddresses];
                    deliveryAddress.push(address);

                    await dispatch(
                        updateUser({
                            ...user,
                            deliveryAddresses: deliveryAddress
                        })
                    );
                    navigation.goBack();
                } else {
                    await dispatch(
                        updateUser({
                            ...user,
                            deliveryAddresses: [address]
                        })
                    );

                    navigation.goBack();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handlePress = (_: any, details: GooglePlaceDetail) => {
        setAddress({
            coors: { ...details.geometry.location! },
            street: details.formatted_address,
            addedOn: new Date().toISOString()
        });
    };
    return (
        <Screen>
            <Header
                title="Delivery Address"
                onPressBack={() => {
                    navigation.goBack();
                }}
            />
            <View style={{ flex: 1 }}>
                <Text py_4 bold>
                    Delivery Address
                </Text>
                <GoogleAutoComplete
                    inputRadius={SIZES.base}
                    placeholder="Please type your delivery address"
                    onPress={handlePress}
                />
                <AnimatePresence>
                    {address?.street && (
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                        >
                            <InputField
                                containerStyle={{ borderRadius: SIZES.base }}
                                placeholder="Apt, Suite, Floor"
                                label="Apt, Suite, Floor"
                                value={address.apt!}
                                onChangeText={(text) =>
                                    setAddress({
                                        ...address,
                                        apt: text.toUpperCase()
                                    })
                                }
                            />
                        </MotiView>
                    )}
                </AnimatePresence>
                <View
                    style={{
                        marginTop: SIZES.padding,
                        width: '80%',
                        alignSelf: 'center'
                    }}
                >
                    <Button
                        disabled={!address?.street}
                        outlined
                        title="Save & Continue"
                        onPress={handleSave}
                    />
                </View>
                <Stack center containerStyle={{ width: '100%' }}>
                    <ScrollView contentContainerStyle={{ width: '100%' }}>
                        {user &&
                            user.deliveryAddresses.length > 0 &&
                            user.deliveryAddresses.map((a) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(
                                            saveDeliveryAddress({ ...a! })
                                        );
                                        navigation.goBack();
                                    }}
                                    style={[
                                        styles.list,
                                        {
                                            shadowColor: theme.SHADOW_COLOR,
                                            backgroundColor:
                                                theme.BACKGROUND_COLOR
                                        }
                                    ]}
                                    key={a?.street}
                                >
                                    <Text>{a?.street.slice(0, -5)}</Text>
                                </TouchableOpacity>
                            ))}
                    </ScrollView>
                </Stack>
            </View>
        </Screen>
    );
};

export default DeliveryAddressSelection;

const styles = StyleSheet.create({
    list: {
        shadowOffset: { width: 3, height: 3 },
        elevation: 5,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginVertical: SIZES.base,
        padding: SIZES.padding,
        borderRadius: SIZES.radius
    }
});
