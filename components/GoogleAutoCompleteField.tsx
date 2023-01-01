import React, { FC } from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import Text from './Text';

interface Props {
    label: string;
    onPress: any;
    ref?: any;
    errorMessage?: React.ReactElement | null;
    placeholder: string;
    rightButton?: any;
}

const GoogleAutoComplete: FC<Props> = React.forwardRef(
    ({ label, onPress, errorMessage, rightButton, placeholder }, ref) => {
        const theme = useAppSelector((state) => state.theme);

        return (
            <View style={{ maxWidth: 612, width: '100%' }}>
                <Text bold px_4 left>
                    {label}
                </Text>
                <GooglePlacesAutocomplete
                    nearbyPlacesAPI="GooglePlacesSearch"
                    keyboardShouldPersistTaps="handled"
                    placeholder={placeholder}
                    debounce={400}
                    ref={ref as any}
                    renderRightButton={rightButton}
                    fetchDetails={true}
                    minLength={2}
                    listUnderlayColor={theme.PRIMARY_BUTTON_COLOR}
                    query={{
                        key: process.env.GOOGLE_KEY,
                        language: 'en', // language of the results
                        components: 'country:us'
                    }}
                    styles={{
                        container: {
                            flex: 0
                        },
                        textInput: {
                            color: theme.TEXT_COLOR,
                            backgroundColor: theme.BACKGROUND_COLOR,
                            paddingHorizontal: SIZES.base * 2,
                            borderBottomWidth: 0.3,
                            borderBottomColor: theme.SHADOW_COLOR,
                            paddingVertical: 16,
                            borderRadius: SIZES.radius * 2,

                            shadowOffset: { width: -4, height: -4 },
                            shadowColor: theme.SHADOW_COLOR,
                            shadowOpacity: 0.4,
                            shadowRadius: 3,
                            elevation: 5
                        },
                        textInputContainer: {
                            backgroundColor: theme.BACKGROUND_COLOR,
                            borderRadius: SIZES.radius * 2
                        },
                        description: {
                            color:
                                theme.mode === 'light' ? '#212121' : '#ffffff'
                        },
                        listView: {
                            borderRadius: 10,
                            marginHorizontal: 4
                        },
                        row: {
                            backgroundColor:
                                theme.mode === 'dark' ? '#212121' : '#ffffff'
                        }
                    }}
                    enablePoweredByContainer={false}
                    onPress={onPress}
                    textInputProps={{
                        //InputComp: InputField,
                        placeholderTextColor: theme.SHADOW_COLOR,

                        leftIcon: {
                            type: 'font-awesome',
                            name: 'chevron-left'
                        },
                        errorStyle: { color: 'red' }
                    }}
                />
                {errorMessage && (
                    <View style={{ paddingRight: SIZES.padding * 0.5 }}>
                        <Text style={{ color: 'red' }} right>
                            {errorMessage}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
);

export default GoogleAutoComplete;
