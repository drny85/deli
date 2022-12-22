import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';
import { ConsumerBottomTabScreens } from './typing';

import { Ionicons } from '@expo/vector-icons';
import ConsumerHomeStackNavigation from './ConsumerHomeStacksScreens';
import ConsumerOrdersStackNavigation from './ConsumerOrdersStacksScreens';
import ConsumerCartStackNavigation from './ConsumerCartStacksNavigation';
import ConsumerProfileStackNavigation from './ConsumerProfileStacksNavigation';

const { Navigator, Screen } =
    createBottomTabNavigator<ConsumerBottomTabScreens>();

const ConsumerBottomTabs = () => {
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
                component={ConsumerHomeStackNavigation}
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
                component={ConsumerOrdersStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="aperture" />
                })}
            />
            <Screen
                name="CartScreens"
                component={ConsumerCartStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="cart" />
                })}
            />
            <Screen
                name="ProfileScreens"
                component={ConsumerProfileStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="person" />
                })}
            />
        </Navigator>
    );
};

export default ConsumerBottomTabs;

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
