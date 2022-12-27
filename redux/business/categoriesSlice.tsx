import { createSlice } from '@reduxjs/toolkit';

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
    reducers: {}
});
export default categoriesSlice.reducer;
