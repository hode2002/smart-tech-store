import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Delivery = {
    id: string;
    name: string;
    slug: string;
};

export interface IDeliveryState {
    deliveryList: Delivery[];
}

const initialState: IDeliveryState = {
    deliveryList: [],
};

export const deliverySlice = createSlice({
    name: 'deliveryList',
    initialState,
    reducers: {
        setDeliveryList: (state, action: PayloadAction<Delivery[]>) => {
            state.deliveryList = action.payload;
        },
    },
});

export const { setDeliveryList } = deliverySlice.actions;
export const deliveryReducer = deliverySlice.reducer;
