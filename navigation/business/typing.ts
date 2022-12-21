import { NavigatorScreenParams } from "@react-navigation/native"

export type BusinessnBottomTabScreens = {
    HomeScreens: NavigatorScreenParams<BusinessHomeStackScreens>
    OrdersScreens: NavigatorScreenParams<BusinessOrdersStackScreens>
    ProducsScreens: NavigatorScreenParams<BusinessProductsStackScreens>
    SettingsScreens:NavigatorScreenParams<BusinessSettingsStackScreens>
}

export type BusinessHomeStackScreens = {
    Home: undefined

}
export type BusinessOrdersStackScreens = {
    Orders: undefined
}
export type BusinessProductsStackScreens = {
    Products: undefined
}
export type BusinessSettingsStackScreens = {
    Settings: undefined
}