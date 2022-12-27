import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from './categoriesSlice';

export interface Product {
    id?: string;
    name: string;
    category: Category | null;
    price: string;
    image: string | null;
    description: string | null;
}
interface IState {
    productImage: string | null;
    products: Product[];
    product: Product | null;
}
const initialState: IState = {
    productImage: null,
    product: null,
    products: []
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProductImage: (state, { payload }: PayloadAction<string | null>) => {
            state.productImage = payload;
        }
    }
});

export const { setProductImage } = productsSlice.actions;
export default productsSlice.reducer;
