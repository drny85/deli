import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllCouriers from '../../screens/business/home/AllCouriers';
import BusinessOrderDetails from '../../screens/business/home/BusinessOrderDetails';
import BusinessOrders from '../../screens/business/home/BusinessOrders';
import Home from '../../screens/business/home/Home';
import OrderHistory from '../../screens/business/home/OrderHistory';
import { BusinessHomeStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessHomeStackScreens>();
const BusinessHomeStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Home" component={Home} />
            <Screen
                name="OrderHistory"
                component={OrderHistory}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Screen
                name="AllCouriers"
                component={AllCouriers}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Screen name="BusinessOrders" component={BusinessOrders} />
            <Screen
                name="BusinessOrderDetails"
                component={BusinessOrderDetails}
            />
        </Navigator>
    );
};

export default BusinessHomeStackNavigation;
