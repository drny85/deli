import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthScreens } from '../auth/typing';

export type ConsumerBottomTabScreens = {
    HomeScreens: NavigatorScreenParams<ConsumerHomeStackScreens>;
    OrdersScreens: NavigatorScreenParams<ConsumerOrdersStackScreens>;
    CartScreens: NavigatorScreenParams<ConsumerCartStackScreens>;
    ProfileScreens: NavigatorScreenParams<ConsumerProfileStackScreens>;
};

export type ConsumerHomeStackScreens = {
    Business: undefined;
};
export type ConsumerOrdersStackScreens = {
    Orders: undefined;
};
export type ConsumerCartStackScreens = {
    Cart: undefined;
};
export type ConsumerProfileStackScreens = {
    Profile: undefined;
    Auth: NavigatorScreenParams<AuthScreens>;
};
