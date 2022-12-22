import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Products from '../../screens/business/products/Products';

import { BusinessProductsStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessProductsStackScreens>();
const BusinessProductsStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Products" component={Products} />
        </Navigator>
    );
};

export default BusinessProductsStackNavigation;
