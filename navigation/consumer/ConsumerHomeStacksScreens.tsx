import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Business from '../../screens/consumer/home/Business';

import { ConsumerHomeStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<ConsumerHomeStackScreens>();
const ConsumerHomeStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Business" component={Business} />
        </Navigator>
    );
};

export default ConsumerHomeStackNavigation;
