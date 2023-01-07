import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import { businessCollection, productsCollection } from '../../firebase';
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
            await addDoc(productsCollection(business?.id!), {
                ...product,
                unitSold: 0
            });
            if (!business.profileCompleted) {
                const docRef = doc(businessCollection, business.id);

                await setDoc(docRef, { hasItems: true }, { merge: true });
            }

            return true;
        } catch (error) {
            const err = error as Error;
            console.log(err.message);
            return false;
        }
    }
);
