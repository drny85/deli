import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../../redux/business/productsSlice';
import { ORDER_STATUS } from '../../redux/consumer/ordersSlide';
import { ConnectedAccountParams } from '../../types';

export type BusinessnBottomTabScreens = {
    BusinessHome: NavigatorScreenParams<BusinessHomeStackScreens>;
    BusinessOrders: NavigatorScreenParams<BusinessOrdersStackScreens>;
    BusinessProducts: NavigatorScreenParams<BusinessProductsStackScreens>;
    BusinessSettings: NavigatorScreenParams<BusinessSettingsStackScreens>;
};

export type BusinessHomeStackScreens = {
    Home: undefined;
    OrderHistory: undefined;
    AllCouriers: undefined;
    BusinessOrders: { status: ORDER_STATUS };
    BusinessOrderDetails: { orderId: string };
};
export type BusinessOrdersStackScreens = {
    Earnings: undefined;
};
export type BusinessProductsStackScreens = {
    Products: undefined;
    AddProduct: { product: Product } | undefined;
    AddCategoryScreen: undefined;
    BusinessProductDetails: { productId: string };
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
