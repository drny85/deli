import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { businessCollection } from '../../firebase';
import { Business } from './businessSlide';

export interface ReturnResponse {
    business: Business | null;
}
export const createBusiness = createAsyncThunk(
    'business/create',
    async (business: Business): Promise<ReturnResponse> => {
        try {
            if (!business) {
                business: null;
            }
            const businessRef = doc(businessCollection, business.userId);
            await setDoc(businessRef, { ...business });

            const data = await getDoc(businessRef);
            if (!data.exists()) return { business: null };
            return { business: { id: data.id, ...data.data() } };
        } catch (error) {
            const err = error as any;
            console.log('Error creating store => ', err.message);
            return { business: null };
        }
    }
);

export const getBusiness = createAsyncThunk(
    'business/getBusiness',
    async (businessId: string): Promise<ReturnResponse> => {
        try {
            const businessRef = doc(businessCollection, businessId);
            const data = await getDoc(businessRef);
            if (!data.exists()) return { business: null };
            return { business: { id: data.id, ...data.data() } };
        } catch (error) {
            return { business: null };
        }
    }
);
