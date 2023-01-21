import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Courier } from '../../types';
import { AppUser } from '../auth/authSlide';
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
    cancelled = 'cancelled',
    accepted_by_driver = 'accepted_by_driver',
    all = 'all orders',
    picked_up_by_driver = 'picked_up_by_driver',
    picked_up_by_client = 'picked_up_by_client'
}

export enum ORDER_TYPE {
    pickup = 'pickup',
    delivery = 'delivery'
}
export interface OrderAddress {
    street: string;
    apt?: string;
    coors: Coors;
    addedOn: string;
}
export interface Order {
    id?: string;
    orderNumber?: number;
    total: number;
    items: CartItem[];
    paymentIntent: string;
    orderDate: string;
    userId: string;
    businessId: string;
    contactPerson: ContactPerson;
    orderType: ORDER_TYPE;
    deliveryInstructions: string | null;
    address: OrderAddress | null;
    status: ORDER_STATUS;
    courier?: Courier | null;
    deliveredOn?: string | null;
    deliveredBy?: AppUser | null;
    pickedUpOn?: string | null;
    acceptedOn?: string | null;
}

interface OrdersState {
    orders: Order[];
    deliveryAdd: Order['address'] | null;
    order: Order | null;
    orderType: ORDER_TYPE;
    showPickupMap: boolean;
    loading: boolean;
    paymentSuccess: boolean;
}
const initialState: OrdersState = {
    orders: [],
    order: null,
    orderType: ORDER_TYPE.delivery,
    showPickupMap: false,
    deliveryAdd: null,
    loading: false,
    paymentSuccess: false
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
        },
        switchOrderType: (state, { payload }: PayloadAction<ORDER_TYPE>) => {
            state.orderType = payload;
        },

        setPaymentSuccess: (state, { payload }: PayloadAction<boolean>) => {
            state.paymentSuccess = payload;
        },
        tooglePickupMap: (state, { payload }: PayloadAction<boolean>) => {
            state.showPickupMap = payload;
        }
    }
});

export const {
    setOrder,
    saveDeliveryAddress,
    switchOrderType,
    setPaymentSuccess,
    tooglePickupMap
} = ordersSlice.actions;

export default ordersSlice.reducer;
