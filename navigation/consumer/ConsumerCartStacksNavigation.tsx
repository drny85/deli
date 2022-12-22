import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from '../../screens/consumer/cart/Cart';

import { ConsumerCartStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<ConsumerCartStackScreens>();
const ConsumerCartStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Cart" component={Cart} />
        </Navigator>
    );
};

export default ConsumerCartStackNavigation;
