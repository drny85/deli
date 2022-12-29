import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createBusiness, getBusiness } from './businessActions';

export interface Coors {
    lat: number;
    lng: number;
}
export interface hour {
    [key: string]: string;
}
export interface Business {
    id?: string;
    name: string;
    email: string;
    owner: { name: string; lastName: string };
    stripeAccount: string | null;
    address: string | null;
    coors: Coors | null;
    phone: string | null;
    isActive: boolean;
    userId: string;
    profileCompleted: boolean;
    hasItems: boolean;
    image: string | null;
    hours: hour[] | null;
    minimunDelivery: number | null;
    charges_enabled: boolean;
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
    reducers: {
        setBusiness: (state, { payload }: PayloadAction<Business | null>) => {
            state.business = payload;
        }
    },
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
export const { setBusiness } = businessSlide.actions;

export default businessSlide.reducer;
