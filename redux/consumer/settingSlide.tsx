import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingState {
    previousRoute: string | null;
}

const initialState: SettingState = {
    previousRoute: null
};
const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setPreviosRoute: (state, { payload }: PayloadAction<string | null>) => {
            state.previousRoute = payload;
        }
    },
    extraReducers: (builder) => {}
});

export const { setPreviosRoute } = settingSlice.actions;

export default settingSlice.reducer;
