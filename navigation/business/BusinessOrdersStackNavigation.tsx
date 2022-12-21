import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Orders from '../../screens/business/orders/Orders';
import { BusinessOrdersStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessOrdersStackScreens>();
const BusinessOrdersStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Orders" component={Orders} />
        </Navigator>
    );
};

export default BusinessOrdersStackNavigation;
