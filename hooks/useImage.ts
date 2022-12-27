import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { setProductImage } from '../redux/business/productsSlice';

import { useAppDispatch } from '../redux/store';

export const useImage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Error',
                        'Sorry, we need camera roll permissions to make this work!',
                        [{ text: 'OK', style: 'cancel' }]
                    );
                }
            }
        })();
    }, [dispatch]);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.3,
                presentationStyle:
                    ImagePicker.UIImagePickerPresentationStyle.AUTOMATIC
            });

            if (!result.canceled) {
                dispatch(setProductImage(result.assets[0].uri));
            } else {
                dispatch(setProductImage(null));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { pickImage };
};
