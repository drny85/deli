import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Courier } from '../../types';
import { AppUser } from '../auth/authSlide';
import { Coors } from '../business/businessSlide';
import { CartItem } from './cartSlide';
import { placePendingOrder } from './ordersActions';

export interface ContactPerson {
    name: string;
    lastName: string;
    phone: string;
}

export enum ORDER_STATUS {
    new = 'new',
    delivered = 'delivered',
    in_progress = 'in_progress',
    marked_ready_for_delivery = 'marked_ready_for_delivery',
    marked_ready_for_pickup = 'marked_ready_for_pickup',
    cancelled = 'cancelled',
    accepted_by_driver = 'accepted_by_driver',
    picked_up_by_driver = 'picked_up_by_driver',
    picked_up_by_client = 'picked_up_by_client',
    all = 'all orders'
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

export interface Tip {
    amount: number;
    percentage: number;
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
    deliveredBy: Courier | null;
    pickedUpOn?: string | null;
    acceptedOn?: string | null;
    pickedByCourierOn?: string;
    tip?: Tip;
    deliveryPaid: boolean;
    transferId: string | null;
}

interface OrdersState {
    orders: Order[];
    deliveryAdd: Order['address'] | null;
    order: Order | null;
    orderType: ORDER_TYPE;
    showPickupMap: boolean;
    loading: boolean;
    paymentSuccess: boolean;
    tip: Tip;
    grandTotal: number;
    deliveryZip: number | null;
}
const initialState: OrdersState = {
    orders: [],
    order: null,
    orderType: ORDER_TYPE.delivery,
    showPickupMap: false,
    deliveryAdd: null,
    loading: false,
    paymentSuccess: false,
    tip: { amount: 0, percentage: 0 },
    grandTotal: 0,
    deliveryZip: null
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
        },
        setTipAmount: (
            state,
            { payload }: PayloadAction<OrdersState['tip']>
        ) => {
            state.tip = payload;
        },
        setGrandTotal: (state, { payload }: PayloadAction<number>) => {
            state.grandTotal = payload;
        },
        setAllOrders: (state, { payload }: PayloadAction<Order[]>) => {
            state.orders = payload;
        },
        setDeliveryZip: (state, { payload }: PayloadAction<number | null>) => {
            state.deliveryZip = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placePendingOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(placePendingOrder.rejected, (state) => {
                state.loading = false;
            })
            .addCase(placePendingOrder.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.order = payload.pendingOrder;
            });
    }
});

export const {
    setOrder,
    saveDeliveryAddress,
    switchOrderType,
    setPaymentSuccess,
    tooglePickupMap,
    setTipAmount,
    setGrandTotal,
    setAllOrders,
    setDeliveryZip
} = ordersSlice.actions;

export default ordersSlice.reducer;
