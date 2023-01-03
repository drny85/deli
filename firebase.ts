import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getFirestore,
    CollectionReference,
    DocumentData,
    collection
} from 'firebase/firestore';
import { getAuth, User, UserCredential } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { AppUser } from './redux/auth/authSlide';
import { Business } from './redux/business/businessSlide';
import { ConnectedAccountParams } from './types';
import { Product } from './redux/business/productsSlice';
import { Category } from './redux/business/categoriesSlice';
import { Order } from './redux/consumer/ordersSlide';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
console.log(process.env.FIREBASE_APIKEY);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

interface Response {
    success: boolean;
    result: string;
}

interface PaymentIntentParams {
    paymentIntentId: string;
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
}

const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>;
};
//const storage = getStorage(initializeApp(firebaseConfig));
const functions = getFunctions(app, 'us-central1');
// const func = (name: string) =>
//     httpsCallable<Referral, { success: boolean }>(functions, name);
export const emailVerifiedFunc = (name: string) =>
    httpsCallable<{ email: string }, User | null>(functions, name);

export const connectedStore = (name: string) =>
    httpsCallable<ConnectedAccountParams, Response>(functions, name);

export const checkForConnectedAccount = (name: string) =>
    httpsCallable<{ accountId: string }, Response>(functions, name);

export const fetchPaymentParams = (name: string) =>
    httpsCallable<
        { connectedId: string; total: number },
        { success: boolean; result: PaymentIntentParams }
    >(functions, name);

// const quoteFunc = (name: string) =>
//     httpsCallable<WirelessQuote, { success: boolean }>(functions, name);

// export const referralsCollection = (userId: string) =>
//     createCollection<Referral>(`referrals/${userId}/referrals`);
export const productsCollection = (businessId: string) =>
    createCollection<Product>(`products/${businessId}/products`);

export const categoriessCollection = (businessId: string) =>
    createCollection<Category>(`categories/${businessId}/categories`);
export const usersCollection = createCollection<AppUser>('users');
export const businessCollection = createCollection<Business>('business');
export const ordersCollection = createCollection<Order>('orders');

export { db, auth, storage };
