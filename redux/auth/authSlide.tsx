import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutUser, autoLogin } from './authActions';

export interface UserPreferences {
    shippingAddress: string[];
}
export interface AppUser {
    id?: string;
    name: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    type: 'admin' | 'business' | 'consumer';
    preferences?: UserPreferences;
    pushToken?: string;
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

export default authSlide.reducer;
