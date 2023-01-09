import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourierHome from '../../screens/courier/CourierHome';
import DeliveryView from '../../screens/courier/DeliveryView';
import MyDeliveries from '../../screens/courier/MyDeliveries';

import { CourierHomeStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<CourierHomeStackScreens>();
const CourierHomeStack = () => {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom'
            }}
        >
            <Screen name="CourierHome" component={CourierHome} />

            <Screen
                name="DeliveryView"
                component={DeliveryView}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Screen
                name="MyDeliveries"
                component={MyDeliveries}
                options={{ presentation: 'fullScreenModal' }}
            />
        </Navigator>
    );
};

export default CourierHomeStack;
