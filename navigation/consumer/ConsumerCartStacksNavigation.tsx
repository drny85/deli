import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from '../../screens/consumer/cart/Cart';
import Checkout from '../../screens/consumer/cart/Checkout';
import OrderReview from '../../screens/consumer/cart/OrderReview';
import OrderSuccess from '../../screens/consumer/cart/OrderSuccess';
import DeliveryAddressSelection from '../../screens/consumer/home/DeliveryAddressSelection';
import AuthNavigationStack from '../auth/AuthNavigationStack';
import ConsumerOrdersStackNavigation from './ConsumerOrdersStacksScreens';

import { ConsumerCartStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<ConsumerCartStackScreens>();
const ConsumerCartStackNavigation = () => {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }}
        >
            <Screen name="Cart" component={Cart} />
            <Screen
                name="OrderReview"
                component={OrderReview}
                // options={{ presentation: 'fullScreenModal' }}
            />
            <Screen
                name="Checkout"
                component={Checkout}
                // options={{ presentation: 'fullScreenModal' }}
            />
            <Screen
                name="AddressSelection"
                component={DeliveryAddressSelection}
                // options={{ presentation: 'modal' }}
            />
            <Screen name="OrderSuccess" component={OrderSuccess} />

            <Screen name="Auth" component={AuthNavigationStack} />
            <Screen
                name="OrdersScreen"
                component={ConsumerOrdersStackNavigation}
            />
        </Navigator>
    );
};

export default ConsumerCartStackNavigation;
