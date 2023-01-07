import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coors } from '../business/businessSlide';
import { CartItem } from './cartSlide';

export interface ContactPerson {
    name: string;
    lastName: string;
    phone: string;
}

export enum ORDER_STATUS {
    delivered = 'delivered',
    in_progress = 'in_progress',
    new = 'new',
    marked_ready_for_delivery = 'marked_ready_for_delivery',
    marked_ready_for_pickup = 'marked_ready_for_pickup',
    cancelled = 'cancelled'
}

export enum ORDER_TYPE {
    pickup = 'pickup',
    delivery = 'delivery'
}
export interface Order {
    id?: string;
    total: number;
    items: CartItem[];
    paymentIntent: string;
    orderDate: string;
    userId: string;
    businessId: string;
    contactPerson: ContactPerson;
    orderType: ORDER_TYPE;
    deliveryInstructions: string | null;
    address: { street: string; apt: string | null; coors: Coors } | null;
    status: ORDER_STATUS;
}

interface OrdersState {
    orders: Order[];
    deliveryAdd: Order['address'] | null;
    order: Order | null;
    loading: boolean;
}
const initialState: OrdersState = {
    orders: [],
    order: null,
    deliveryAdd: null,
    loading: false
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrder: (state, { payload }: PayloadAction<Order | null>) => {
            state.order = payload;
        },
        saveDeliveryAddress: (
            state,
            { payload }: PayloadAction<Order['address']>
        ) => {
            state.deliveryAdd = payload;
        }
    }
});

export const { setOrder, saveDeliveryAddress } = ordersSlice.actions;

export default ordersSlice.reducer;
