import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc } from 'firebase/firestore';
import { productsCollection } from '../../firebase';
import { RootState } from '../store';
import { Product } from './productsSlice';

export const addProduct = createAsyncThunk(
    'products/add',
    async (product: Product, { getState }): Promise<boolean> => {
        try {
            const {
                business: { business }
            } = getState() as RootState;
            if (!business) return false;
            await addDoc(productsCollection(business?.id!), { ...product });
            return true;
        } catch (error) {
            const err = error as Error;
            console.log(err.message);
            return false;
        }
    }
);
