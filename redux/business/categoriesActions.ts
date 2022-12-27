import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, doc } from 'firebase/firestore';
import { categoriessCollection } from '../../firebase';
import { RootState } from '../store';

export const addCategory = createAsyncThunk(
    'categories/add',
    async (category: { name: string }, { getState }) => {
        try {
            const {
                business: { business }
            } = getState() as RootState;
            if (!business) return null;

            await addDoc(categoriessCollection(business.id!), {
                name: category.name
            });
        } catch (error) {
            const err = error as any;
            console.log(err.message);
        }
    }
);
