import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Reports from '../../screens/admin/reports/Reports';

import { AdminReportsStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<AdminReportsStackScreens>();
const AdminReportsStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Reports" component={Reports} />
        </Navigator>
    );
};

export default AdminReportsStackNavigation;
