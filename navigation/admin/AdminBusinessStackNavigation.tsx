import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Business from '../../screens/admin/business/Business';

import { AdminBusinessStackScreens, AdminHomeStackScreens } from './typing';
const { Navigator, Screen } =
    createNativeStackNavigator<AdminBusinessStackScreens>();
const AdminBusinessStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Business" component={Business} />
        </Navigator>
    );
};

export default AdminBusinessStackNavigation;
