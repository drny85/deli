import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessOrderDetails from '../../screens/business/home/BusinessOrderDetails';
import BusinessOrders from '../../screens/business/home/BusinessOrders';
import Orders from '../../screens/business/home/BusinessOrders';
import { BusinessOrdersStackScreens } from './typing';
import Earnings from '../../screens/business/earnings/Earnings';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessOrdersStackScreens>();
const BusinessOrdersStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Earnings" component={Earnings} />
        </Navigator>
    );
};

export default BusinessOrdersStackNavigation;
