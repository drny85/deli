import { TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import WebView, { WebViewNavigation } from 'react-native-webview';
import { SIZES } from '../../../constants';
import Loader from '../../../components/Loader';

import { MotiView } from 'moti';
import { useAppSelector } from '../../../redux/store';
import { CourierOnBoardingScreens } from '../../../navigation/courier/typing';
import { useCurrentUser } from '../../../hooks/useAuth';
import { connectedStore } from '../../../firebase';
import { Courier } from '../../../types';
import CreatingStripeAccountLoading from '../../../components/lottie/CreatingStripeAccountLoading';

type Props = NativeStackScreenProps<
    CourierOnBoardingScreens,
    'CourierStripeAccountCreation'
>;

const CourierStripeAccountScreen = ({
    navigation,
    route: {
        params: { url, data }
    }
}: Props) => {
    const webViewRef = useRef<WebView>(null);
    const { currentUser, loading: loadingUder } = useCurrentUser();
    const [loading, setLoading] = useState(true);
    const [processing, setProccessing] = useState(false);
    const [accountId, setAccountId] = useState<string | null>(null);
    const theme = useAppSelector((state) => state.theme);
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);

    const handleNavigationChanges = async (newNavState: WebViewNavigation) => {
        const { url, loading } = newNavState;

        try {
            console.log('URL =>', url, loading);
            setLoading(loading);
            const success = await checkForAccountSuccefull(url);
            if (success) {
                setProccessing(true);
            } else {
                checkForNonCompletion(url);
            }
        } catch (error) {
            console.log('ERROR =>', error);
        }
    };

    const getParams = (url: string) => {
        let regexp = /[?&]([^=#]+)=([^&#]*)/g;
        let params: any = {};
        let check;
        while ((check = regexp.exec(url))) {
            params[check[1]] = check[2];
        }
        return params;
    };

    const checkForAccountSuccefull = async (url: string): Promise<boolean> => {
        try {
            if (url.includes('/return_url')) {
                const { accountId } = getParams(url);
                setAccountId(accountId);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const checkForNonCompletion = async (url: string) => {
        try {
            if (url.includes('/reauth')) {
                const func = connectedStore('createConnectedBusinessAccount');

                const { data: response } = await func({
                    ...data
                });
                console.log('RES 2 => ', response);
                if (!response.result) {
                    await checkForAccountSuccefull(url);
                } else {
                    //navigation.navigate('BusinessCreatedSuccesfull');
                    console.log('HERE Successs', response);
                }
            }
        } catch (error) {
            console.log('Error 2 => ', error);
        }
    };

    useEffect(() => {
        if (!accountId && !currentUser) return;
        if ((currentUser as Courier).stripeAccount) {
            setProccessing(false);
            navigation.navigate('CourierOnBoardingSuccess');
        }
    }, [accountId, currentUser]);

    useEffect(() => {
        console.log('Now In ConnectedStore');
        if (!url) return;
        setCurrentUrl(url);
    }, [url]);

    if (!currentUrl || loadingUder) return <Loader />;

    if (processing) return <CreatingStripeAccountLoading />;
    return (
        <Screen>
            <MotiView
                style={{
                    top: SIZES.statusBarHeight,
                    alignSelf: 'center',
                    height: 28,
                    position: 'absolute',
                    paddingHorizontal: SIZES.padding,
                    backgroundColor: theme.ASCENT,
                    zIndex: 100,
                    right: SIZES.padding,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 30
                }}
                from={{ scale: 0, translateY: -20 }}
                animate={{ scale: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600 }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text bold lightText center>
                        Exit
                    </Text>
                </TouchableOpacity>
            </MotiView>
            <WebView
                style={{ flex: 1, paddingTop: SIZES.base }}
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ uri: currentUrl! }}
                onNavigationStateChange={handleNavigationChanges}
                sharedCookiesEnabled={true}
            ></WebView>
        </Screen>
    );
};

export default CourierStripeAccountScreen;
