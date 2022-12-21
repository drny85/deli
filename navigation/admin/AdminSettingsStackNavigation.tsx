import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminSettings from '../../screens/admin/settings/AdminSettings';
import { AdminSettingsStackScreens } from './typings';

const { Navigator, Screen } =
    createNativeStackNavigator<AdminSettingsStackScreens>();
const AdminSettingsStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Settings" component={AdminSettings} />
        </Navigator>
    );
};

export default AdminSettingsStackNavigation;
