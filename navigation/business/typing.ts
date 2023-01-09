import { NavigatorScreenParams } from '@react-navigation/native';
import { ConnectedAccountParams } from '../../types';

export type BusinessnBottomTabScreens = {
    BusinessHome: NavigatorScreenParams<BusinessHomeStackScreens>;
    BusinessOrders: NavigatorScreenParams<BusinessOrdersStackScreens>;
    BusinessProducts: NavigatorScreenParams<BusinessProductsStackScreens>;
    BusinessSettings: NavigatorScreenParams<BusinessSettingsStackScreens>;
};

export type BusinessHomeStackScreens = {
    Home: undefined;
};
export type BusinessOrdersStackScreens = {
    Orders: undefined;
    BusinessOrderDetails: { orderId: string };
};
export type BusinessProductsStackScreens = {
    Products: undefined;
    AddProduct: undefined;
    AddCategoryScreen: undefined;
};
export type BusinessSettingsStackScreens = {
    Settings: undefined;
};

export type BusinessOnBoardingStackScreens = {
    EmailVerification: undefined;
    BusinessInformation: undefined;
    PrepareInfoScreen: undefined;
    BusinessHoursScreen: undefined;
    BusinessStripeAccountCreation: {
        data: ConnectedAccountParams;
        url: string;
    };
    BusinessCreatedSuccesfull: undefined;
};
