import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessSignUp from '../../screens/auth/BusinessSignUp';
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
            <Screen name="Signup" component={Signup} options={{presentation:'fullScreenModal'}} />
            <Screen name="BusinessSignup" component={BusinessSignUp} options={{presentation:'fullScreenModal'}} />
            <Screen name="EmailVerification" component={EmailVerification} options={{presentation:'fullScreenModal'}} />
        </Navigator>
    );
};

export default AuthNavigationStack;
