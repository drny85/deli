import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const TOP_UNITS = 5;

export const MY_TRANSACTION_FEE = 1.1; //remeber to change this in the cloud funtions  => shared.ts
export const SIZES = {
    base: 6,
    font: 14,
    radius: 12,
    padding: width <= 500 ? 16 : 18,
    statusBarHeight: Constants.statusBarHeight,
    isSmallDevice: width < 500 && width > 381,
    isVerySmall: width < 380,
    width,
    height
};
export const PREVIOUS_ROUTE = 'PREVIOUS_ROUTE';
export const IMAGE_PLACEHOLDER =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80';
