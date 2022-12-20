import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export const SIZES = {
    base: 6,
    font: 14,
    radius: 12,
    padding: 18,
    statusBarHeight: Constants.statusBarHeight,
    isSmallDevice: width < 500,
    width,
    height

}