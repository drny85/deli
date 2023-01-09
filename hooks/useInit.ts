import 'expo-dev-client';
import React, { useCallback, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from './../Theme';
import { useAppDispatch, useAppSelector } from './../redux/store';

import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

import useColorScheme from './useColorScheme';
import { LogBox } from 'react-native';

import { auth, usersCollection } from '../firebase';
import { switchTheme } from '../redux/themeSlide';
import { autoLogin } from '../redux/auth/authActions';
import {
    getBusiness,
    getCurrentBusiness
} from '../redux/business/businessActions';
import { loadCart } from '../utils/saveCart';
import { setCart } from '../redux/consumer/cartSlide';
import { AppUser } from '../redux/auth/authSlide';
import { doc, getDoc } from 'firebase/firestore';

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
    if (isDark) {
        dispatch(switchTheme(darkTheme));
    } else {
        dispatch(switchTheme(lightTheme));
    }

    const getUser = async (userId: string): Promise<AppUser | null> => {
        try {
            const ref = doc(usersCollection, userId);
            const user = await getDoc(ref);
            if (!user.exists()) return null;
            return { id: user.id, ...user.data() };
        } catch (error) {
            return null;
        }
    };

    const autoSignIn = async () => {
        try {
            auth.onAuthStateChanged(async (authState) => {
                if (authState?.uid) {
                    const data = await getUser(authState.uid);

                    if (data?.type === 'business') {
                        dispatch(getCurrentBusiness(authState.uid));
                    }

                    dispatch(
                        autoLogin({
                            userId: authState.uid,
                            emailVerified: authState.emailVerified
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
                    dispatch(setCart(cart));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingComplete(true);
            }
        }

        loadResourcesAndDataAsync();
    }, [fontsLoaded]);

    const onLayoutRootView = useCallback(async () => {
        try {
            if (isLoadingComplete) {
                await SplashScreen.hideAsync();
            }
        } catch (error) {
            console.log(error);
        }
    }, [isLoadingComplete]);

    return { isLoadingComplete, onLayoutRootView };
}
