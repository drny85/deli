import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coors } from '../business/businessSlide';
import { CartItem } from './cartSlide';

export interface Order {
    id?: string;
    total: number;
    items: CartItem[];
    paymentIntent: string;
    orderDate: string;
    userId: string;
    businessId: string;
    orderType: 'pickup' | 'delivery';
    deliveryInstructions: string | null;
    address: { street: string; apt: string | null; coors: Coors } | null;
    status:
        | 'delivered'
        | 'picked_up'
        | 'new'
        | 'in_progress'
        | 'cancelled'
        | 'pending_pickup'
        | 'pending_delivery';
}

interface OrdersState {
    orders: Order[];
    order: Order | null;
    loading: boolean;
}
const initialState: OrdersState = {
    orders: [],
    order: null,
    loading: false
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrder: (state, { payload }: PayloadAction<Order | null>) => {
            state.order = payload;
        }
    }
});

export const { setOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
