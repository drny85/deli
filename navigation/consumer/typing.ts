import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthScreens } from '../auth/typing';

export type ConsumerBottomTabScreens = {
    ConsumerHome: NavigatorScreenParams<ConsumerHomeStackScreens>;
    ConsumerOrders: NavigatorScreenParams<ConsumerOrdersStackScreens>;
    ConsumerCart: NavigatorScreenParams<ConsumerCartStackScreens>;
    ConsumerProfile: NavigatorScreenParams<ConsumerProfileStackScreens>;
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
