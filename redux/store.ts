import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlide from './auth/authSlide';
import themeSlide from './themeSlide';

const reducer = {
    theme: themeSlide,
    auth:authSlide
   
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
