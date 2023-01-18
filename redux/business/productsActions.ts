import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
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
                ...product
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

export const updateProduct = createAsyncThunk(
    'products/update',
    async (product: Product): Promise<boolean> => {
        try {
            if (!product) return false;
            const productRef = doc(
                productsCollection(product.businessId),
                product.id
            );
            await updateDoc(productRef, { ...product });

            return true;
        } catch (error) {
            const err = error as Error;
            console.log(err.message);
            return false;
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (product: Product): Promise<boolean> => {
        try {
            if (!product) return false;
            const productRef = doc(
                productsCollection(product.businessId),
                product.id
            );
            await deleteDoc(productRef);

            return true;
        } catch (error) {
            const err = error as Error;
            console.log(err.message);
            return false;
        }
    }
);
