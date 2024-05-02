import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Category = {
    id: string;
    name: string;
    description: string;
    slug: string;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
};

export interface ICategoryState {
    categories: Category[];
}

const initialState: ICategoryState = {
    categories: [],
};

export const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
    },
});

export const { setCategories } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
