import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Businesses from '../../screens/consumer/home/Businesses';
import BusinessPage from '../../screens/consumer/home/BusinessPage';
import ProductDetails from '../../screens/consumer/home/ProductDetails';

import { ConsumerHomeStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<ConsumerHomeStackScreens>();
const ConsumerHomeStackNavigation = () => {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }}
        >
            <Screen name="Businesses" component={Businesses} />
            <Screen
                name="BusinessPage"
                component={BusinessPage}
                //options={{ presentation: 'modal' }}
            />
            <Screen
                name="ProductDetails"
                component={ProductDetails}
                options={{ presentation: 'fullScreenModal' }}
            />
        </Navigator>
    );
};

export default ConsumerHomeStackNavigation;
