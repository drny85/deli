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

            const productIndex = state.items.findIndex(
                (item) =>
                    item.id === payload.id &&
                    item.size &&
                    payload.size &&
                    item.size.id === payload.size.id
            );
            if (productIndex !== -1) {
                // FOUND ITEM IN CART WITH SAME SIZE
                state.items[productIndex].quantity += payload.quantity;
                state.quantity += payload.quantity;
                state.total +=
                    payload.size === null ? +payload.price : payload.size.price;
                saveCart(state);
            } else {
                // CART OR COME IN SIZES
                const index = state.items.findIndex(
                    (item) => item.id === payload.id
                );
                if (index !== -1) {
                    console.log('abc');
                    state.items[index].quantity += payload.quantity;
                    state.quantity += payload.quantity;
                    state.total +=
                        payload.size === null
                            ? +payload.price
                            : payload.size.price;
                    saveCart(state);
                } else {
                    console.log('123');
                    state.items = [...state.items, payload];
                    state.quantity = state.quantity + payload.quantity;
                    state.total =
                        payload.size === null
                            ? +payload.price * payload.quantity + state.total
                            : state.total +
                              payload.size.price * payload.quantity;

                    saveCart(state);
                }
            }
        },
        removeFromCart: (state, { payload }: PayloadAction<CartItem>) => {
            const productIndex = state.items.findIndex(
                (item) =>
                    item.id === payload.id &&
                    item.size &&
                    item.size === payload.size
            );
            if (productIndex !== -1) {
                if (state.items[productIndex].quantity > 1) {
                    state.items[productIndex].quantity -= 1;
                    state.quantity -= 1;
                    state.total -=
                        payload.size === null
                            ? +payload.price
                            : payload.size.price;
                    saveCart(state);
                } else {
                    state.items = state.items.filter(
                        (item) => item.id !== payload.id
                    );
                    state.quantity -= 1;
                    state.total -=
                        payload.size === null
                            ? +payload.price
                            : payload.size.price;
                    saveCart(state);
                }
            } else {
                const indexP = state.items.findIndex(
                    (item) => item.id === payload.id
                );
                if (indexP !== -1) {
                    if (state.items[indexP].quantity > 1) {
                        state.items[indexP].quantity -= 1;
                        state.quantity -= 1;
                        state.total -=
                            payload.size === null
                                ? +payload.price
                                : payload.size.price;
                        saveCart(state);
                    } else {
                        state.items = state.items.filter(
                            (item) => item.id !== payload.id
                        );
                        state.quantity -= 1;
                        state.total -=
                            payload.size === null
                                ? +payload.price
                                : payload.size.price;
                        saveCart(state);
                    }
                } else {
                    console.log('DOWM HERE');
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
