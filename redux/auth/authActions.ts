import { createAsyncThunk } from "@reduxjs/toolkit";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, usersCollection } from "../../firebase";
import { AppUser } from "./authSlide";

export const autoLogin = createAsyncThunk('auth/login',async(data:{userId:string, emailVerified:boolean, type:AppUser['type']}) :Promise<AppUser | null> => {
    try {
        if (!data.userId) return  null
        const userRef = doc(usersCollection, data.userId)
        const userData = await getDoc(userRef)
        if (!userData.exists()) {
            return null
        }
        const response = {id:userData.id, ...userData.data()}
        return {...response, emailVerified:data.emailVerified, type: data.type }

    } catch (error) {
        const err = error as any;
        console.log(err.message)
        return null
    }
})

export const createUser = createAsyncThunk('auth/create', async(userData:AppUser, {dispatch}) => {
    try {
        if (!userData || !userData.id) return
        const userRef = doc(usersCollection, userData.id)
        await setDoc(userRef, {...userData})
        dispatch(autoLogin({userId:userData.id, emailVerified:userData.emailVerified, type:userData.type}))
        
    } catch (error) {
        const err = error as any;
        console.log(err.message)
    }
})

export const logoutUser = createAsyncThunk('auth/logout', async(_):Promise<null> => {
    try {
        await signOut(auth)
       return null

    } catch (error) {
        const err = error as any;
        console.log(err.message)
        return null
    }
})