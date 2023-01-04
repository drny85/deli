import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from '../../screens/consumer/cart/Cart';
import Checkout from '../../screens/consumer/cart/Checkout';

import OrderReview from '../../screens/consumer/cart/OrderReview';

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
                options={{ presentation: 'fullScreenModal' }}
            />
            <Screen
                name="Checkout"
                component={Checkout}
                options={{ presentation: 'fullScreenModal' }}
            />
        </Navigator>
    );
};

export default ConsumerCartStackNavigation;
