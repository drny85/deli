import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { businessCollection, usersCollection } from '../../firebase';
import { Business, setBusiness } from './businessSlide';

export interface ReturnResponse {
    business: Business | null;
}
export const createBusiness = createAsyncThunk(
    'business/create',
    async (business: Business): Promise<ReturnResponse> => {
        try {
            if (!business) {
                return { business: null };
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
    async (businessId: string, { dispatch }): Promise<ReturnResponse> => {
        try {
            const businessRef = doc(businessCollection, businessId);
            const data = await getDoc(businessRef);
            if (!data.exists()) return { business: null };
            dispatch(setBusiness({ id: data.id, ...data.data() }));
            return { business: { id: data.id, ...data.data() } };
        } catch (error) {
            return { business: null };
        }
    }
);

export const getCurrentBusiness = createAsyncThunk(
    'business/getCurrent',
    async (businessId: string, { dispatch }) => {
        try {
            const businessRef = doc(businessCollection, businessId);
            const data = await getDoc(businessRef);
            if (!data.exists()) return;
            dispatch(setBusiness({ id: data.id, ...data.data() }));
        } catch (error) {
            dispatch(setBusiness(null));
        }
    }
);

export const updateBusiness = createAsyncThunk(
    'business/update',
    async (businessData: Business, _): Promise<boolean> => {
        try {
            if (!businessData.id) return false;
            const businessRef = doc(businessCollection, businessData.id);
            const data = await getDoc(businessRef);
            if (!data.exists()) return false;

            await updateDoc(businessRef, { ...businessData });
            if (businessData.phone) {
                const userRef = doc(usersCollection, businessData.id);
                await updateDoc(userRef, { phone: businessData.phone });
            }

            getBusiness(businessData.id);
            return true;
        } catch (error) {
            const err = error as any;
            console.log('Error updating store => ', err.message);
            return false;
        }
    }
);
