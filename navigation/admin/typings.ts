import { NavigatorScreenParams } from "@react-navigation/native"

export type AdminBottomTabScreens = {
    HomeScreens: NavigatorScreenParams<AdminHomeStackScreens>
    BusinessScreens: NavigatorScreenParams<AdminBusinessStackScreens>
    ReportsScreens: NavigatorScreenParams<AdminReportsStackScreens>
    SettingsScreens: NavigatorScreenParams<AdminSettingsStackScreens>
}

export type AdminHomeStackScreens = {
    Home: undefined
}
export type AdminBusinessStackScreens = {
    Business: undefined
}
export type AdminReportsStackScreens = {
    Reports: undefined
}
export type AdminSettingsStackScreens = {
    Settings: undefined
}
