import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../../redux/business/productsSlice';
import { AuthScreens } from '../auth/typing';

export type ConsumerBottomTabScreens = {
    ConsumerHome: NavigatorScreenParams<ConsumerHomeStackScreens>;
    ConsumerOrders: NavigatorScreenParams<ConsumerOrdersStackScreens>;
    ConsumerCart: NavigatorScreenParams<ConsumerCartStackScreens>;
    ConsumerProfile: NavigatorScreenParams<ConsumerProfileStackScreens>;
};

export type ConsumerHomeStackScreens = {
    Businesses: undefined;
    BusinessPage: undefined;
    ProductDetails: { product: Product };
    DeliveryAddressSelection: undefined;
};
export type ConsumerOrdersStackScreens = {
    Orders: { orderId: string } | undefined;
    OrderDetails: { orderId: string };
};

export type ConsumerCartStackScreens = {
    Cart: undefined;
    OrderReview: undefined;
    Checkout: undefined;
    OrderSuccess: { orderId: string };
    AddressSelection: undefined;
    Auth: NavigatorScreenParams<AuthScreens>;
    OrdersScreen: NavigatorScreenParams<ConsumerOrdersStackScreens>;
};
export type ConsumerProfileStackScreens = {
    Profile: undefined;
    Auth: NavigatorScreenParams<AuthScreens>;
};
