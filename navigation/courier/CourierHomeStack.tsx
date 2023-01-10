import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourierSettings from '../../redux/consumer/CourierSettings';
import CourierDeliveries from '../../screens/courier/CourerDeliveries';
import CourierHome from '../../screens/courier/CourierHome';
import DeliveryView from '../../screens/courier/DeliveryView';
import MyDeliveries from '../../screens/courier/MyDeliveries';

import { CourierStackScreens } from './typing';

const { Navigator, Screen } = createNativeStackNavigator<CourierStackScreens>();
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
            <Screen
                name="CourierSettings"
                component={CourierSettings}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Screen
                name="CourierDeliveries"
                component={CourierDeliveries}
                options={{ presentation: 'fullScreenModal' }}
            />
        </Navigator>
    );
};

export default CourierHomeStack;
