import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Brand = {
    id: string;
    name: string;
    logo_url: string;
    description: string;
    slug: string;
};

export interface IBrandState {
    brands: Brand[];
}

const initialState: IBrandState = {
    brands: [],
};

export const brandSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        setBrands: (state, action: PayloadAction<Brand[]>) => {
            state.brands = action.payload;
        },
    },
});

export const { setBrands } = brandSlice.actions;
export const brandReducer = brandSlice.reducer;
