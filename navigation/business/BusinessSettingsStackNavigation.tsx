import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../../screens/business/settings/Settings';

import { BusinessSettingsStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessSettingsStackScreens>();
const BusinessSettingsStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Settings" component={Settings} />
        </Navigator>
    );
};

export default BusinessSettingsStackNavigation;
