import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../../redux/store';

import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { AdminBottomTabScreens } from './typing';
import AdminHomeStackNavigation from './AdminHomeStackNavigation';
import AdminBusinessStackNavigation from './AdminBusinessStackNavigation';

const { Navigator, Screen } = createBottomTabNavigator<AdminBottomTabScreens>();

const AdminBottomTabs = () => {
    const theme = useAppSelector((state) => state.theme);
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.BACKGROUND_COLOR,
                    borderTopWidth: 0,
                    elevation: 0,
                    borderColor: theme.BACKGROUND_COLOR
                },

                tabBarActiveTintColor: theme.SECONDARY_BUTTON_COLOR,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: '#13121228'
            }}
        >
            <Screen
                name="AdminHome"
                component={AdminHomeStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="home-outline" />
                })}
            />
            <Screen
                name="AdminBusiness"
                component={AdminBusinessStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="business" />
                })}
            />
        </Navigator>
    );
};

export default AdminBottomTabs;

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color?: string;
}) {
    const theme = useAppSelector((state) => state.theme);
    return (
        <Ionicons
            size={28}
            style={{ marginBottom: -2 }}
            {...props}
            color={theme.TEXT_COLOR}
        />
    );
}

const tabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);

    const routes = [''];

    if (routes.findIndex((r) => r === routeName) !== -1) {
        return 'none';
    }
    return 'flex';
};
