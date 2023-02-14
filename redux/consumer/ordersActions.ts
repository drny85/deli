import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { db, ordersCollection } from '../../firebase';
import { resetCart } from '../../utils/saveCart';
import { setCart } from './cartSlide';
import { Order } from './ordersSlide';

export const placePendingOrder = createAsyncThunk(
    'orders/placePendingOrder',
    async (
        order: Order,
        { dispatch }
    ): Promise<{ success: boolean; pendingOrder: Order | null }> => {
        try {
            if (!order.items.length)
                return { success: false, pendingOrder: null };
            const orderRef = collection(db, 'pendingOrders');
            const { id } = await addDoc(orderRef, { ...order });
            const docRef = doc(orderRef, id);
            const data = await getDoc(docRef);

            if (!data.exists()) return { success: false, pendingOrder: null };
            return {
                success: true,
                pendingOrder: { ...data.data(), id: data.id } as Order
            };
        } catch (error) {
            console.log('Error placing Pending Order', error);
            return { success: false, pendingOrder: null };
        }
    }
);
export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async (
        order: Order,
        { dispatch }
    ): Promise<{ success: boolean; orderId: string | null }> => {
        try {
            if (!order.items.length) return { success: false, orderId: null };
            const docRef = doc(ordersCollection, order.id);
            await setDoc(docRef, { ...order });
            dispatch(setCart({ quantity: 0, items: [], total: 0 }));
            resetCart();

            return { success: true, orderId: order.id! };
        } catch (error) {
            console.log('Error placing Order', error);
            return { success: false, orderId: null };
        }
    }
);

export const updateOrder = createAsyncThunk(
    'orders/updateOrder',
    async (order: Order, { dispatch }): Promise<boolean> => {
        try {
            if (!order) return false;
            const docRef = doc(ordersCollection, order.id);
            await updateDoc(docRef, { ...order });
            return true;
        } catch (error) {
            console.log('Error updating Order', error);
            return false;
        }
    }
);
