import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/business/home/Home';
import { BusinessHomeStackScreens } from './typing';

const { Navigator, Screen } =
    createNativeStackNavigator<BusinessHomeStackScreens>();
const BusinessHomeStackNavigation = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Home" component={Home} />
        </Navigator>
    );
};

export default BusinessHomeStackNavigation;
