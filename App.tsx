import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Screen from './components/Screen';
import { ThemeProvider } from 'styled-components/native';
import store, { useAppDispatch, useAppSelector } from './redux/store';
import Text from './components/Text';
import useCachedResources from './hooks/useInit';
import Loader from './components/Loader';
import Button from './components/Button';
import { switchTheme } from './redux/themeSlide';
import { darkTheme, lightTheme } from './Theme';

const App = () => {
    const isReady = useCachedResources();
    const theme = useAppSelector((state) => state.theme);
    const dispatch = useAppDispatch();
    console.log(isReady, theme.mode);
    if (!isReady) return <Loader />;
    return (
        <ThemeProvider theme={theme}>
            <Screen center>
                <Text>Open up App.tsx to start working on your app!</Text>
                <Button
                    small
                    onPress={() =>
                        dispatch(
                            switchTheme(
                                theme.mode === 'dark' ? lightTheme : darkTheme
                            )
                        )
                    }
                    title="Toogle"
                />
                <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
            </Screen>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
