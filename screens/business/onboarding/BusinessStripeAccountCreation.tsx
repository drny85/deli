import { TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessOnBoardingStackScreens } from '../../../navigation/business/typing';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { SIZES } from '../../../constants';
import Loader from '../../../components/Loader';
import { checkForConnectedAccount, connectedStore } from '../../../firebase';
import { ConnectedAccountParams } from '../../../types';
import { MotiView } from 'moti';
import { useAppSelector } from '../../../redux/store';

type Props = NativeStackScreenProps<
    BusinessOnBoardingStackScreens,
    'BusinessStripeAccountCreation'
>;

const BusinessStripeAccountCreation = ({
    navigation,
    route: {
        params: { url, data }
    }
}: Props) => {
    const webViewRef = useRef<WebView>(null);
    const [loading, setLoading] = useState(true);
    const theme = useAppSelector((state) => state.theme);
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);

    const handleNavigationChanges = async (newNavState: WebViewNavigation) => {
        const { url, loading } = newNavState;

        try {
            console.log('URL =>', url, loading);
            setLoading(loading);
            const success = await checkForAccountSuccefullCreation(url);
            console.log('SUCCESS =>', success);
            if (success) {
                navigation.navigate('BusinessCreatedSuccesfull');
            } else {
                console.log('HERE');
                await checkForNonCompletion(url);
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

    const checkForAccountSuccefullCreation = async (
        url: string
    ): Promise<boolean> => {
        try {
            if (url.includes('/return_url')) {
                const { accountId } = getParams(url);

                const func = checkForConnectedAccount(
                    'addConnectedAccountToBusiness'
                );
                const { data } = await func({ accountId });
                console.log('DATA =>', data);
                if (data.success) return true;
                return false;
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
                    await checkForAccountSuccefullCreation(url);
                } else {
                    navigation.navigate('BusinessCreatedSuccesfull');
                }
            }
        } catch (error) {
            console.log('Error 2 => ', error);
        }
    };

    useEffect(() => {
        console.log('Now In ConnectedStore');
        if (!url) return;
        setCurrentUrl(url);
    }, [url]);

    if (!currentUrl) return <Loader />;
    return (
        <Screen>
            <MotiView
                style={{
                    top: SIZES.base,
                    alignSelf: 'center',
                    height: 28,

                    paddingHorizontal: SIZES.padding,
                    backgroundColor: theme.ASCENT,
                    zIndex: 100,
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
                style={{ flex: 1, marginTop: SIZES.statusBarHeight }}
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ uri: currentUrl! }}
                onNavigationStateChange={handleNavigationChanges}
                sharedCookiesEnabled={true}
            ></WebView>
        </Screen>
    );
};

export default BusinessStripeAccountCreation;
