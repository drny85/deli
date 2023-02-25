import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coors } from '../business/businessSlide';
import { logoutUser, autoLogin } from './authActions';
import { MapViewDirectionsMode } from 'react-native-maps-directions';
import { Order } from '../consumer/ordersSlide';
import { Courier } from '../../types';

export interface UserPreferences {
    favoritesBusiness: string[];
}
export interface AppUser {
    id?: string;
    name: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    phone: string | null;
    type: 'admin' | 'business' | 'consumer' | 'courier';
    preferences?: UserPreferences;
    pushToken?: string;
    coors?: Coors;
    transportation?: MapViewDirectionsMode;
    favoritesStores: string[];
    deliveryAddresses: Order['address'][];
}
interface IState {
    user: AppUser | Courier | null;
    loading: boolean;
    screen: 'login' | 'signup' | 'business' | 'courier';
}
const initialState: IState = {
    user: null,
    loading: false,
    screen: 'login'
};
const authSlide = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, { payload }: PayloadAction<IState['user']>) => {
            state.user = payload;
        },
        switchScreen: (state, { payload }: PayloadAction<IState['screen']>) => {
            state.screen = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(autoLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(autoLogin.rejected, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(autoLogin.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(logoutUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
            });
    }
});
export const { setUserData, switchScreen } = authSlide.actions;

export default authSlide.reducer;
