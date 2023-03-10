import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddCategoryScreen from '../../screens/business/products/AddCategoryScreen';
import AddProduct from '../../screens/business/products/AddProduct';
import BusinessProductDetails from '../../screens/business/products/BusinessProductDetails';
import Products from '../../screens/business/products/Products';

import { BusinessProductsStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessProductsStackScreens>();
const BusinessProductsStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Products" component={Products} />
            <Screen
                name="AddProduct"
                options={{ presentation: 'fullScreenModal' }}
                component={AddProduct}
            />
            <Screen
                name="AddCategoryScreen"
                options={{ presentation: 'modal' }}
                component={AddCategoryScreen}
            />
            <Screen
                name="BusinessProductDetails"
                options={{ presentation: 'fullScreenModal' }}
                component={BusinessProductDetails}
            />
        </Navigator>
    );
};

export default BusinessProductsStackNavigation;
