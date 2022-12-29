import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { P_Size } from '../../utils/sizes';
import { Category } from './categoriesSlice';

export interface Product {
    id?: string;
    name: string;
    category: Category | null;
    price: string | number;
    image: string | null;
    description: string | null;
    sizes: P_Size[];
    priceMultiplier: number | null;
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
        },
        fetchProducts: (state, { payload }: PayloadAction<Product[]>) => {
            state.products = payload;
        },
        setCurrentProduct: (state, { payload }: PayloadAction<Product>) => {
            state.product = payload;
        }
    }
});

export const { setProductImage, fetchProducts, setCurrentProduct } =
    productsSlice.actions;
export default productsSlice.reducer;
