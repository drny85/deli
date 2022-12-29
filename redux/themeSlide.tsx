import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { lightTheme } from '../Theme';
import { Theme } from '../types';

const initialState: Theme = lightTheme;

const themeSlide = createSlice({
   name: 'theme',
   initialState,
   reducers: {
      switchTheme: (state: Theme, { payload }: PayloadAction<Theme>) => payload
   }
});

export const { switchTheme } = themeSlide.actions;

export default themeSlide.reducer;
