import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessSignUp from '../../screens/auth/BusinessSignUp';
import CourierSignUp from '../../screens/auth/CourierSignUp';
import EmailVerification from '../../screens/auth/EmailVerification';
import Login from '../../screens/auth/Login';
import Signup from '../../screens/auth/Signup';
import { AuthScreens } from './typing';

const { Screen, Navigator } = createNativeStackNavigator<AuthScreens>();

const AuthNavigationStack = () => {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }}
        >
            <Screen name="Login" component={Login} />
            <Screen name="Signup" component={Signup} />
            <Screen name="BusinessSignup" component={BusinessSignUp} />
            <Screen name="EmailVerification" component={EmailVerification} />
            <Screen name="CourierSignup" component={CourierSignUp} />
        </Navigator>
    );
};

export default AuthNavigationStack;
