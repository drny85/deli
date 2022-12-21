import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getFirestore,
    CollectionReference,
    DocumentData,
    collection
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { AppUser } from './redux/auth/authSlide';
import { Business } from './redux/business/businessSlide';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APPID,
    measurementId:process.env.FIREBASE_MEASUREMENT_ID
};
console.log(process.env.FIREBASE_APIKEY)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>;
};
//const storage = getStorage(initializeApp(firebaseConfig));
const functions = getFunctions(app, 'us-central1');
// const func = (name: string) =>
//     httpsCallable<Referral, { success: boolean }>(functions, name);

// const quoteFunc = (name: string) =>
//     httpsCallable<WirelessQuote, { success: boolean }>(functions, name);

// export const referralsCollection = (userId: string) =>
//     createCollection<Referral>(`referrals/${userId}/referrals`);
export const usersCollection = createCollection<AppUser>('users');
export const businessCollection = createCollection<Business>('business');



export { db, auth, storage };
