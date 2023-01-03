import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc } from 'firebase/firestore';
import { ordersCollection } from '../../firebase';
import { resetCart } from '../../utils/saveCart';
import { setCart } from './cartSlide';
import { Order } from './ordersSlide';

export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async (order: Order, { dispatch }): Promise<boolean> => {
        try {
            console.log(order);
            if (!order.items.length) return false;
            await addDoc(ordersCollection, { ...order });
            dispatch(setCart({ quantity: 0, items: [], total: 0 }));
            resetCart();
            return true;
        } catch (error) {
            console.log('Error placing Order', error);
            return false;
        }
    }
);
