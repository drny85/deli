import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc } from 'firebase/firestore';
import { ordersCollection } from '../../firebase';
import { resetCart } from '../../utils/saveCart';
import { setCart } from './cartSlide';
import { Order } from './ordersSlide';

export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async (
        order: Order,
        { dispatch }
    ): Promise<{ success: boolean; orderId: string | null }> => {
        try {
            if (!order.items.length) return { success: false, orderId: null };
            const { id } = await addDoc(ordersCollection, { ...order });
            dispatch(setCart({ quantity: 0, items: [], total: 0 }));
            resetCart();
            return { success: true, orderId: id };
        } catch (error) {
            console.log('Error placing Order', error);
            return { success: false, orderId: null };
        }
    }
);
