import { NavigatorScreenParams } from '@react-navigation/native';

export type AdminBottomTabScreens = {
    AdminHome: NavigatorScreenParams<AdminHomeStackScreens>;
    AdminBusiness: NavigatorScreenParams<AdminBusinessStackScreens>;
    AdminReports: NavigatorScreenParams<AdminReportsStackScreens>;
    AdminSettings: NavigatorScreenParams<AdminSettingsStackScreens>;
};

export type AdminHomeStackScreens = {
    Home: undefined;
};
export type AdminBusinessStackScreens = {
    Business: undefined;
};
export type AdminReportsStackScreens = {
    Reports: undefined;
};
export type AdminSettingsStackScreens = {
    Settings: undefined;
};
