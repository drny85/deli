import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessOrderDetails from '../../screens/business/orders/BusinessOrderDetails';
import Orders from '../../screens/business/orders/Orders';
import { BusinessOrdersStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessOrdersStackScreens>();
const BusinessOrdersStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Orders" component={Orders} />
            <Screen
                name="BusinessOrderDetails"
                component={BusinessOrderDetails}
                options={{ presentation: 'fullScreenModal' }}
            />
        </Navigator>
    );
};

export default BusinessOrdersStackNavigation;
