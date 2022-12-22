import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Orders from '../../screens/consumer/orders/Orders';

import { ConsumerOrdersStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<ConsumerOrdersStackScreens>();
const ConsumerOrdersStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Orders" component={Orders} />
        </Navigator>
    );
};

export default ConsumerOrdersStackNavigation;
