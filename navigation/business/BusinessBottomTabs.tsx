import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../../redux/store';

import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { BusinessnBottomTabScreens } from './typing';
import BusinessHomeStackNavigation from './BusinessHomeStackNavigation';
import BusinessOrdersStackNavigation from './BusinessOrdersStackNavigation';
import BusinessProductsStackNavigation from './BusinessProductsStackScreens';
import BusinessSettingsStackNavigation from './BusinessSettingsStackNavigation';

const { Navigator, Screen } =
    createBottomTabNavigator<BusinessnBottomTabScreens>();

const BusinessBottomTabs = () => {
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
                name="HomeScreens"
                component={BusinessHomeStackNavigation}
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
                name="OrdersScreens"
                component={BusinessOrdersStackNavigation}
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
            <Screen
                name="ProducsScreens"
                component={BusinessProductsStackNavigation}
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
            <Screen
                name="SettingsScreens"
                component={BusinessSettingsStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="settings" />
                })}
            />
        </Navigator>
    );
};

export default BusinessBottomTabs;

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
