import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
    id?: string;
    name: string;
}
interface IState {
    categories: Category[];
    category: Category | null;
}
const initialState: IState = {
    category: null,
    categories: []
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        fetchCategories(state, { payload }: PayloadAction<Category[]>) {
            state.categories = payload;
        },
        setCurrentCategory(state, { payload }: PayloadAction<Category | null>) {
            state.category = payload;
        }
    }
});
export const { fetchCategories, setCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
