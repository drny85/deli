import { createSlice } from '@reduxjs/toolkit';
import { createBusiness, getBusiness } from './businessActions';

export interface Business {
    id?: string;
    name: string;
    email: string;
    owner: { name: string; lastName: string };
    stripeAccount: string | null;
    address?: string;
    phone?: string;
    isActive: boolean;
    userId: string;
}
interface IState {
    business: Business | null;
    loading: boolean;
}
const initialState: IState = {
    business: null,
    loading: false
};

const businessSlide = createSlice({
    name: 'business',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createBusiness.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBusiness.rejected, (state) => {
                state.business = null;
                state.loading = false;
            })
            .addCase(createBusiness.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.business = payload.business;
            })
            .addCase(getBusiness.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBusiness.rejected, (state) => {
                state.loading = false;
                state.business = null;
            })
            .addCase(getBusiness.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.business = payload.business;
            });
    }
});

export default businessSlide.reducer;