import { NotificationType } from '@/apiRequests/notification';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface INotificationState {
    notificationList: NotificationType[];
}

const initialState: INotificationState = {
    notificationList: [],
};

export const notificationSlice = createSlice({
    name: 'notificationList',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<NotificationType>) => {
            const newList = state.notificationList.reverse();
            newList.push(action.payload);
            state.notificationList = newList.reverse();
        },
        setNotificationList: (
            state,
            action: PayloadAction<NotificationType[]>,
        ) => {
            state.notificationList = action.payload;
        },
    },
});

export const { setNotificationList, addNotification } =
    notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
