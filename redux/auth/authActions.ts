import { createAsyncThunk } from "@reduxjs/toolkit";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, usersCollection } from "../../firebase";
import { AppUser } from "./authSlide";

export const autoLogin = createAsyncThunk('auth/login',async(data:{userId:string, emailVerified:boolean, type:AppUser['type']}, {dispatch, rejectWithValue}) :Promise<AppUser | null> => {
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
        return null
    }
})

export const logoutUser = createAsyncThunk('auth/logout', async(_):Promise<null> => {
    try {
        await signOut(auth)
       return null

    } catch (error) {
        return null
    }
})