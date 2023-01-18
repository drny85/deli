import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../../redux/business/productsSlice';
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
    AddProduct: { product: Product } | undefined;
    AddCategoryScreen: undefined;
    BusinessProductDetails: { product: Product };
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
