import { createAsyncThunk } from '@reduxjs/toolkit';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, usersCollection } from '../../firebase';
import { Courier } from '../../types';
import { AppUser, setUserData } from './authSlide';

export const autoLogin = createAsyncThunk(
    'auth/login',
    async (
        data: {
            userId: string;
            emailVerified: boolean;
        },
        { dispatch }
    ): Promise<AppUser | null> => {
        try {
            if (!data.userId) return null;
            const userRef = doc(usersCollection, data.userId);
            const userData = await getDoc(userRef);
            if (!userData.exists()) {
                return null;
            }
            const response = { id: userData.id, ...userData.data() };

            return {
                ...response,
                emailVerified: data.emailVerified,
                type: response.type
            };
        } catch (error) {
            const err = error as any;
            console.log(err.message);
            return null;
        }
    }
);

export const updateUser = createAsyncThunk(
    'auth/update',
    async (userData: AppUser, { dispatch }) => {
        try {
            if (!userData) return;
            const docRef = doc(usersCollection, userData.id);
            await setDoc(docRef, { ...userData }, { merge: true });
            const user = await getDoc(docRef);
            //if (!user.exists) return null;
            console.log('UPDATING USER');
            setUserData({ id: user.id, ...user.data()! });
        } catch (error) {
            const err = error as any;
            console.log(err.message);
        }
    }
);

export const createUser = createAsyncThunk(
    'auth/create',
    async (userData: AppUser | Courier, { dispatch }) => {
        try {
            if (!userData || !userData.id) return;
            const userRef = doc(usersCollection, userData.id);
            await setDoc(userRef, { ...userData });
            dispatch(
                autoLogin({
                    userId: userData.id,
                    emailVerified: userData.emailVerified
                })
            );
        } catch (error) {
            const err = error as any;
            console.log(err.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_): Promise<null> => {
        try {
            await signOut(auth);
            return null;
        } catch (error) {
            const err = error as any;
            console.log(err.message);
            return null;
        }
    }
);
