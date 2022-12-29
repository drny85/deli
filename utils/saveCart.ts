import AsyncStorage from '@react-native-async-storage/async-storage';
import { IState } from '../redux/consumer/cartSlide';

export const CART_NAME = 'user-cart';
export const saveCart = async (data: IState) => {
    try {
        await AsyncStorage.setItem(CART_NAME, JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

export const loadCart = async (): Promise<IState | null> => {
    try {
        const data = await AsyncStorage.getItem(CART_NAME);

        if (data !== null) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const resetCart = async () => {
    try {
        await AsyncStorage.removeItem(CART_NAME);
    } catch (error) {
        console.log(error);
    }
};
