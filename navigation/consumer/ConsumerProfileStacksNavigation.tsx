import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../screens/consumer/profile/Profile';
import AuthNavigationStack from '../auth/AuthNavigationStack';

import { ConsumerProfileStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<ConsumerProfileStackScreens>();
const ConsumerProfileStackNavigation = () => {
    return (
        <Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Profile"
        >
            <Screen name="Profile" component={Profile} />
            <Screen name="Auth" component={AuthNavigationStack} />
        </Navigator>
    );
};

export default ConsumerProfileStackNavigation;
