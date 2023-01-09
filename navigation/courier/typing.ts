import { NavigatorScreenParams } from '@react-navigation/native';
import { Coors } from '../../redux/business/businessSlide';

export type CourierBottomTabScreens = {
    CourierHomeStack: NavigatorScreenParams<CourierHomeStackScreens>;
    CourierDeliveries: NavigatorScreenParams<CourierDeliveriesStackScreens>;
    CourierProfile: NavigatorScreenParams<CourierProfileStackScreens>;
};

export type CourierHomeStackScreens = {
    CourierHome: undefined;
    DeliveryView: { orderId: string };
    MyDeliveries: undefined;
};
export type CourierDeliveriesStackScreens = {
    Deliveries: undefined;
};

export type CourierProfileStackScreens = {
    CourierProfile: undefined;
};
