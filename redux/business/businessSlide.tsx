import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessDay } from '../../types';
import { createBusiness, getBusiness } from './businessActions';

export interface Coors {
    lat: number;
    lng: number;
}

export enum BUSINESS_ORDER_TYPE {
    deliveryOnly = 'deliveryOnly',
    both = 'both'
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
    hours: BusinessDay | null;
    charges_enabled: boolean;
    minimumDelivery: number | null;
    orderType?: BUSINESS_ORDER_TYPE;
    isOpen: boolean;
    distance?: number | null;
    eta?: number;
    zips: number[];
}
interface IState {
    business: Business | null;
    businesses: Business[];
    loading: boolean;
}
const initialState: IState = {
    business: null,
    businesses: [],
    loading: false
};

const businessSlide = createSlice({
    name: 'business',
    initialState,
    reducers: {
        setBusiness: (state, { payload }: PayloadAction<Business | null>) => {
            state.business = payload;
        },
        setBusinesses: (state, { payload }: PayloadAction<Business[]>) => {
            state.businesses = payload;
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
export const { setBusiness, setBusinesses } = businessSlide.actions;

export default businessSlide.reducer;
