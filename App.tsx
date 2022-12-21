import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import { ThemeProvider } from 'styled-components/native';
import store, { useAppSelector } from './redux/store';

import useCachedResources from './hooks/useInit';

import Loader from './components/Loader';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AuthNavigationStack from './navigation/auth/AuthNavigationStack';
import AdminBottomTabs from './navigation/admin/AdminBottomTabs';
import BusinessBottomTabs from './navigation/business/BusinessBottomTabs';

const App = () => {
    const isReady = useCachedResources();
    const theme = useAppSelector((state) => state.theme);
    const { user, loading } = useAppSelector((state) => state.auth);
    console.log('USER => ', user);

    if (!isReady || loading) return <Loader />;
    return (
        <ThemeProvider theme={theme}>
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
                ) : user && user.type === 'business' ? (
                    <BusinessBottomTabs />
                ) : !loading && isReady ? (
                    <AuthNavigationStack />
                ) : (
                    <Loader />
                )}

                <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
            </NavigationContainer>
        </ThemeProvider>
    );
};

export default () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};
