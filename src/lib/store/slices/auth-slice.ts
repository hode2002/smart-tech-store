import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface IAuthState {
    accessToken: string;
    registerEmail: string;
}

const initialState: IAuthState = {
    accessToken: '',
    registerEmail: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRegisterEmail: (state, action: PayloadAction<string>) => {
            state.registerEmail = action.payload;
        },
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

export const { setRegisterEmail, setAccessToken, setRefreshToken, userLogout } =
    authSlice.actions;
export const authReducer = authSlice.reducer;
