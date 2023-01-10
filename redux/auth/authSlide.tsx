import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coors } from '../business/businessSlide';
import { logoutUser, autoLogin } from './authActions';
import { MapViewDirectionsMode } from 'react-native-maps-directions';

export interface UserPreferences {
    shippingAddress: string[];
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
}
interface IState {
    user: AppUser | null;
    loading: boolean;
}
const initialState: IState = {
    user: null,
    loading: false
};
const authSlide = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, { payload }: PayloadAction<IState['user']>) => {
            state.user = payload;
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
export const { setUserData } = authSlide.actions;

export default authSlide.reducer;
