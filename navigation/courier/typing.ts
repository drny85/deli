// import { NavigatorScreenParams } from '@react-navigation/native';

// export type CourierBottomTabScreens = {
//     CourierHomeStack: NavigatorScreenParams<CourierHomeStackScreens>;
//     CourierDeliveries: NavigatorScreenParams<CourierDeliveriesStackScreens>;
//     CourierProfile: NavigatorScreenParams<CourierProfileStackScreens>;
// };

export type CourierStackScreens = {
    CourierHome: undefined;
    DeliveryView: { orderId: string };
    MyDeliveries: undefined;
    CourierSettings: undefined;
    CourierDeliveries: undefined;
};
// export type CourierDeliveriesStackScreens = {
//     Deliveries: undefined;
// };

// export type CourierProfileStackScreens = {
//     CourierProfile: undefined;
// };
