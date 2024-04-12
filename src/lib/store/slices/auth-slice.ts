import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
    accessToken: string;
}

const initialState: IAuthState = {
    accessToken: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            const refreshTokenJson = JSON.stringify(action.payload);
            window.localStorage.setItem('refreshToken', refreshTokenJson);
        },
        userLogout: (state) => {
            state.accessToken = '';
            window.localStorage.removeItem('refreshToken');
        },
    },
});

export const { setAccessToken, setRefreshToken, userLogout } =
    authSlice.actions;
export const authReducer = authSlice.reducer;
