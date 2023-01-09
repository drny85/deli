import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../../redux/store';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { CourierBottomTabScreens } from './typing';
import CourierHome from '../../screens/courier/CourierHome';
import CourerDeliveries from '../../screens/courier/CourerDeliveries';
import CourierProfile from '../../screens/courier/CourierProfile';
import CourierHomeStack from './CourierHomeStack';

const { Navigator, Screen } =
    createBottomTabNavigator<CourierBottomTabScreens>();

const CourierBottomTabs = () => {
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
                name="CourierHomeStack"
                component={CourierHomeStack}
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
                name="CourierDeliveries"
                component={CourerDeliveries}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: () => <TabBarIcon name="bicycle-outline" />
                })}
            />
            <Screen
                name="CourierProfile"
                component={CourierProfile}
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

export default CourierBottomTabs;

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
