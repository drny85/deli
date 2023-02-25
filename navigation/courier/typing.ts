// import { NavigatorScreenParams } from '@react-navigation/native';

import { Order } from '../../redux/consumer/ordersSlide';
import { ConnectedAccountParams } from '../../types';

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
    DeliveryDetails: { order: Order };
};

export type CourierOnBoardingScreens = {
    CourierEmailVerification: undefined;
    CourierStripeAccountCreation: { url: string; data: ConnectedAccountParams };
    CourierOnBoardingSuccess: undefined;
    CourierPictureScreen: undefined;
};
// export type CourierDeliveriesStackScreens = {
//     Deliveries: undefined;
// };

// export type CourierProfileStackScreens = {
//     CourierProfile: undefined;
// };
