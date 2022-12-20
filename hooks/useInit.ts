import 'expo-dev-client';
import React, { useEffect, useState } from 'react';
import { darkTheme, lightTheme } from './../Theme';
import { useAppDispatch } from './../redux/store';

import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

import useColorScheme from './useColorScheme';
import { LogBox } from 'react-native';

import { auth } from '../firebase';
import { switchTheme } from '../redux/themeSlide';

SplashScreen.preventAutoHideAsync();

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);
    const [fontsLoaded, err] = useFonts({
        montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
        'montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
        lobster: require('../assets/fonts/Lobster-Regular.ttf'),
        tange: require('../assets/fonts/Tangerine-Regular.ttf'),
        italic: require('../assets/fonts/Montserrat-LightItalic.ttf')
    });

    const isDark = useColorScheme() === 'dark';
    const dispatch = useAppDispatch();

    const autoSignIn = async () => {
        try {
            auth.onAuthStateChanged(async (authState) => {
                if (authState?.uid) {
                    const result = await authState.getIdTokenResult();
                    if (authState.emailVerified) {
                      console.log('VERIFIED')
                    }
                    const claims = result.claims;

                    if (claims.role) {
                       console.log(claims.type)
                    }
                } else {
                   console.log('NOTYHING')
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
                if (fontsLoaded) {
                    setLoadingComplete(true);
                    SplashScreen.hideAsync();
                }

              

                isDark
                    ? dispatch(switchTheme(darkTheme))
                    : dispatch(switchTheme(lightTheme));
                    console.log('THEME DARK =>', isDark)
            } catch (error) {
                console.log(error);
            }
        }

        loadResourcesAndDataAsync();
    }, [fontsLoaded]);

    return isLoadingComplete;
}