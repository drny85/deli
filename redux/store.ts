import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlide from './auth/authSlide';
import businessSlide from './business/businessSlide';
import categoriesSlice from './business/categoriesSlice';
import productsSlice from './business/productsSlice';
import cartSlide from './consumer/cartSlide';
import ordersSlide from './consumer/ordersSlide';
import setttingSlide from './consumer/settingSlide';
import themeSlide from './themeSlide';

const reducer = {
    theme: themeSlide,
    auth: authSlide,
    business: businessSlide,
    categories: categoriesSlice,
    products: productsSlice,
    cart: cartSlide,
    settings: setttingSlide,
    orders: ordersSlide
};

const store = configureStore({
    reducer,
    devTools: false
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
