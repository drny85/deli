import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveCart } from '../../utils/saveCart';
import { P_Size } from '../../utils/sizes';
import { Product } from '../business/productsSlice';

export interface CartItem extends Product {
    quantity: number;
    size: P_Size | null;
}
export interface IState {
    items: CartItem[];
    quantity: number;
    total: number;
}
const initialState: IState = {
    items: [],
    quantity: 0,
    total: 0
};

const cartSlide = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }: PayloadAction<CartItem>) => {
            // IF PRODUCT IS ALREADY IN  CART AND COME IN SIZES
            if (payload.size) {
                const productIndex = state.items.findIndex(
                    (item) =>
                        item.size?.id === payload.size?.id &&
                        payload.id === item.id
                );
                if (productIndex !== -1) {
                    //handle if product already in cart
                    state.items[productIndex].quantity += payload.quantity;
                    state.total += payload.quantity * payload.size.price;
                    state.quantity += payload.quantity;
                    saveCart(state);
                } else {
                    //handle if product not in cart

                    state.items.push(payload);
                    state.quantity += payload.quantity;
                    state.total += payload.size.price * payload.quantity;
                    saveCart(state);
                }

                //handle product with size
            } else {
                console.log('NOT FOUND EXISTING PRODUCT WITH SIZE');
                //handle product with no size
                const pIndex = state.items.findIndex(
                    (item) => payload.id === item.id
                );
                if (pIndex !== -1) {
                    state.items[pIndex].quantity += payload.quantity;
                    state.total += +payload.price * payload.quantity;
                    state.quantity += payload.quantity;
                    saveCart(state);
                } else {
                    state.items.push(payload);
                    state.quantity += payload.quantity;
                    state.total += +payload.price * payload.quantity;
                    saveCart(state);
                }
                //handle if product already in cart)
            }
        },
        removeFromCart: (state, { payload }: PayloadAction<CartItem>) => {
            if (payload.size) {
                //handle delete product with size
                const productIndex = state.items.findIndex(
                    (item) =>
                        payload.id === item.id &&
                        payload.size?.id === item.size?.id
                );
                if (productIndex !== -1) {
                    //found product
                    console.log('TTT', payload);

                    console.log('found product');
                    if (state.items[productIndex].quantity > 1) {
                        state.items[productIndex].quantity -= 1;
                        state.quantity -= 1;
                        state.total -= payload.size.price;
                        saveCart(state);
                    } else {
                        console.log('no found product');
                        state.items.splice(productIndex, 1);
                        state.total -= payload.size.price;
                        state.quantity -= 1;
                        saveCart(state);
                    }
                }
            } else {
                //handle delete product with no size
                const index = state.items.findIndex(
                    (item) => item.id === payload.id
                );
                if (state.items[index].quantity > 1) {
                    state.items[index].quantity -= 1;
                    state.quantity -= 1;
                    state.total -= +payload.price;
                    saveCart(state);
                } else {
                    state.items.splice(index, 1);
                    state.quantity -= 1;
                    state.total -= +payload.price;
                    saveCart(state);
                }
            }
        },
        setCart: (state, { payload }: PayloadAction<IState>) => {
            return payload;
        }
    }
});
export const { addToCart, removeFromCart, setCart } = cartSlide.actions;

export default cartSlide.reducer;
