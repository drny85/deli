import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import { ThemeProvider } from 'styled-components/native';
import store, { useAppSelector } from './redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useCachedResources from './hooks/useInit';
import Loader from './components/Loader';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AdminBottomTabs from './navigation/admin/AdminBottomTabs';
import BusinessBottomTabs from './navigation/business/BusinessBottomTabs';
import BusinessOnBoardingNavigation from './navigation/business/BusinessOnBoardingNavigation';
import ConsumerBottomTabs from './navigation/consumer/ConsumerBottomTabs';
import CourierHomeStack from './navigation/courier/CourierHomeStack';

const App = () => {
    const { isLoadingComplete, onLayoutRootView } = useCachedResources();
    const theme = useAppSelector((state) => state.theme);
    const [processing, setProcessing] = useState(true);
    const { user, loading } = useAppSelector((state) => state.auth);
    const { business, loading: businessLoading } = useAppSelector(
        (state) => state.business
    );

    useEffect(() => {
        if (isLoadingComplete && !loading && !businessLoading) {
            onLayoutRootView();
            setProcessing(false);
        } else {
            setProcessing(true);
        }
    }, [isLoadingComplete, loading, businessLoading]);

    // console.log('PROS', processing);
    if (processing) return <Loader />;
    return (
        <ThemeProvider theme={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <NavigationContainer
                    theme={{
                        ...DefaultTheme,
                        colors: {
                            ...DefaultTheme.colors,
                            primary: theme.PRIMARY_BUTTON_COLOR,
                            background: theme.BACKGROUND_COLOR
                        }
                    }}
                >
                    {user && user.type === 'admin' ? (
                        <AdminBottomTabs />
                    ) : user &&
                      user.type === 'business' &&
                      business &&
                      business.stripeAccount !== null ? (
                        <BusinessBottomTabs />
                    ) : user &&
                      user.type === 'business' &&
                      business &&
                      business.stripeAccount === null ? (
                        <BusinessOnBoardingNavigation />
                    ) : user && user.type === 'courier' ? (
                        <CourierHomeStack />
                    ) : (
                        <ConsumerBottomTabs />
                    )}

                    <StatusBar
                        style={theme.mode === 'dark' ? 'light' : 'dark'}
                    />
                </NavigationContainer>
            </GestureHandlerRootView>
        </ThemeProvider>
    );
};

export default () => (
    <Provider store={store}>
        <App />
    </Provider>
);
