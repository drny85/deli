import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    getFocusedRouteNameFromRoute,
    useNavigation
} from '@react-navigation/native';
import { useAppSelector } from '../../redux/store';
import { ConsumerBottomTabScreens } from './typing';

import { Ionicons } from '@expo/vector-icons';
import ConsumerHomeStackNavigation from './ConsumerHomeStacksScreens';
import ConsumerOrdersStackNavigation from './ConsumerOrdersStacksScreens';
import ConsumerCartStackNavigation from './ConsumerCartStacksNavigation';
import ConsumerProfileStackNavigation from './ConsumerProfileStacksNavigation';
import { MotiView } from 'moti';
import { Image } from 'react-native';
import { Asset, useAssets } from 'expo-asset';

const { Navigator, Screen } =
    createBottomTabNavigator<ConsumerBottomTabScreens>();

const ConsumerBottomTabs = () => {
    const theme = useAppSelector((state) => state.theme);
    const { quantity } = useAppSelector((state) => state.cart);

    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.BACKGROUND_COLOR,
                    borderWidth: 0,
                    elevation: 0
                },
                tabBarActiveTintColor: theme.SECONDARY_BUTTON_COLOR,
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: '#13121228'
            }}
        >
            <Screen
                name="ConsumerHome"
                component={ConsumerHomeStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0
                    },

                    tabBarIcon: ({ size, color }) => (
                        <Image
                            style={{
                                height: 28,
                                width: 28,
                                tintColor: theme.TEXT_COLOR
                            }}
                            resizeMode="contain"
                            source={require('../../restaurant.png')}
                        />
                    )
                })}
            />
            <Screen
                name="ConsumerOrders"
                component={ConsumerOrdersStackNavigation}
                options={({ route }) => {
                    return {
                        tabBarStyle: {
                            display: tabBarVisibility(route),
                            backgroundColor: theme.BACKGROUND_COLOR,
                            borderTopWidth: 0,
                            elevation: 0
                        },

                        tabBarIcon: ({ size, color }) => (
                            <Image
                                style={{
                                    height: 28,
                                    width: 28,
                                    tintColor: theme.TEXT_COLOR
                                }}
                                resizeMode="contain"
                                source={require('../../order.png')}
                            />
                        )
                    };
                }}
            />
            <Screen
                name="ConsumerCart"
                component={ConsumerCartStackNavigation}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: tabBarVisibility(route),
                        backgroundColor: theme.BACKGROUND_COLOR,
                        borderTopWidth: 0,
                        elevation: 0,
                        height: tabBarVisibility(route) === 'flex' ? 80 : 0
                    },
                    tabBarBadge: quantity > 0 ? quantity : undefined,
                    tabBarBadgeStyle:
                        quantity > 0
                            ? {
                                  backgroundColor: theme.ASCENT,
                                  color: theme.WHITE_COLOR
                              }
                            : undefined,

                    tabBarIcon: () => <TabBarIcon name="cart" />
                })}
            />
            <Screen
                name="ConsumerProfile"
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

    const routes = ['BusinessPage'];

    if (routes.findIndex((r) => r === routeName) !== -1) {
        return 'none';
    }
    return 'flex';
};
