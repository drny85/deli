import { NavigatorScreenParams } from "@react-navigation/native"

export type AdminBottomTabScreens = {
    HomeScreens: NavigatorScreenParams<AdminHomeStackScreens>
    BusinessScreens: NavigatorScreenParams<AdminBusinessStackScreens>
}

export type AdminHomeStackScreens = {
    Home: undefined

}
export type AdminBusinessStackScreens = {
    Business: undefined
}