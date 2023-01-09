import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREVIOUS_ROUTE } from '../constants';

export const isTherePreviousRoute = async (): Promise<{
    success: boolean;
    route: string;
}> => {
    try {
        const data = await AsyncStorage.getItem(PREVIOUS_ROUTE);
        if (data === null) return { success: false, route: '' };
        return { success: true, route: data };
    } catch (error) {
        console.log(error);
        return { success: false, route: '' };
    }
};
