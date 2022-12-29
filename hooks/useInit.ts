import 'expo-dev-client';
import React, { useCallback, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from './../Theme';
import { useAppDispatch } from './../redux/store';

import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

import useColorScheme from './useColorScheme';
import { LogBox } from 'react-native';

import { auth } from '../firebase';
import { switchTheme } from '../redux/themeSlide';
import { autoLogin } from '../redux/auth/authActions';
import { getBusiness } from '../redux/business/businessActions';
import { loadCart } from '../utils/saveCart';
import { setCart } from '../redux/consumer/cartSlide';

SplashScreen.preventAutoHideAsync();

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);
    const [fontsLoaded, err] = useFonts({
        montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
        'montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
        lobster: require('../assets/fonts/Lobster-Regular.ttf'),
        tange: require('../assets/fonts/Tangerine-Regular.ttf'),
        italic: require('../assets/fonts/Montserrat-LightItalic.ttf'),
        raleway: require('../assets/fonts/Raleway-Regular.ttf'),
        'raleway-bold': require('../assets/fonts/Raleway-Bold.ttf'),
        'raleway-italic': require('../assets/fonts/Raleway-LightItalic.ttf')
    });

    const isDark = useColorScheme() === 'dark';
    const dispatch = useAppDispatch();

    const autoSignIn = async () => {
        try {
            auth.onAuthStateChanged(async (authState) => {
                if (authState?.uid) {
                    const result = await authState.getIdTokenResult();
                    const claims = result.claims;

                    if (claims.type === 'business') {
                        dispatch(getBusiness(authState.uid));
                    }

                    dispatch(
                        autoLogin({
                            userId: authState.uid,
                            emailVerified: authState.emailVerified,
                            type: claims.type
                        })
                    );

                    //logged in and verified
                }
            });
        } catch (error) {
            console.log('AUTO LOGING ERROR =>', error);
        }
    };

    // Load any resources or data that we need prior to rendering the app

    useEffect(() => {
        //onLayoutRootView();
        async function loadResourcesAndDataAsync() {
            try {
                LogBox.ignoreAllLogs(true);

                autoSignIn();
                const cart = await loadCart();
                if (cart) {
                    console.log('CART FROM INIT', cart);
                    dispatch(setCart(cart));
                }

                isDark
                    ? dispatch(switchTheme(darkTheme))
                    : dispatch(switchTheme(lightTheme));

                if (fontsLoaded) {
                    setLoadingComplete(true);
                }
            } catch (error) {
                console.log(error);
            } finally {
            }
        }

        loadResourcesAndDataAsync();
    }, [fontsLoaded]);

    const onLayoutRootView = useCallback(async () => {
        try {
            if (isLoadingComplete) {
                // This tells the splash screen to hide immediately! If we call this after
                // `setAppIsReady`, then we may see a blank screen while the app is
                // loading its initial state and rendering its first pixels. So instead,
                // we hide the splash screen once we know the root view has already
                // performed layout.
                await SplashScreen.hideAsync();
            }
        } catch (error) {
            console.log(error);
        }
    }, [isLoadingComplete]);

    onLayoutRootView();

    return isLoadingComplete;
}
