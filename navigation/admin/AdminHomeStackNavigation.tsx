import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/admin/home/Home';
import { AdminHomeStackScreens } from './typings';
const { Navigator, Screen } =
    createNativeStackNavigator<AdminHomeStackScreens>();
const AdminHomeStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Home" component={Home} />
        </Navigator>
    );
};

export default AdminHomeStackNavigation;
