import http from '@/lib/http';
import {
    CreatePasswordBodyType,
    CreatePasswordResponseType,
    ForgotPasswordResponseType,
    ForgotPasswordType,
    LoginBodyType,
    LoginResponseType,
    LogoutResponseType,
    RegisterBodyType,
    RegisterResType,
} from '@/schemaValidations/auth.schema';
import Toast from 'react-native-toast-message';

export type ActiveUserEmailType = {
    email: string;
    otpCode: string;
};

export type ActiveUserEmailResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
    };
};

class AuthApiRequest {
    async login(body: LoginBodyType) {
        try {
            const response: LoginResponseType = await http.post(
                '/auth/login',
                body,
            );
            Toast.show({
                type: 'success',
                text1: response.message,
                visibilityTime: 2000,
            });
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async logout(token: string) {
        try {
            const response: LogoutResponseType = await http.post(
                '/auth/logout',
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            Toast.show({
                type: 'success',
                text1: response.message,
            });
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async register(body: RegisterBodyType) {
        try {
            const response: RegisterResType = await http.post<RegisterResType>(
                '/auth/register',
                body,
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async activeUserEmail(body: ActiveUserEmailType) {
        try {
            const response: ActiveUserEmailResponseType =
                await http.post<RegisterResType>(
                    '/auth/active-user-email',
                    body,
                );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async resendOtp(body: RegisterBodyType) {
        try {
            const response: RegisterResType = await http.post<RegisterResType>(
                '/auth/otp/resend',
                body,
            );
            Toast.show({
                type: 'success',
                text1: response.message,
            });
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async createPassword(body: CreatePasswordBodyType) {
        try {
            const response: CreatePasswordResponseType = await http.post(
                '/auth/create-password',
                body,
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async forgotPassword(body: ForgotPasswordType) {
        try {
            const response: ForgotPasswordResponseType = await http.post(
                '/users/reset-password',
                body,
            );
            Toast.show({
                type: 'success',
                text1: response.message,
            });
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async getDataFromGoogleToken(token: string) {
        try {
            const response: LoginResponseType = await http.post(
                '/auth/google/token',
                { token },
            );
            Toast.show({
                type: 'success',
                text1: response.message,
            });
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }
}

const authApiRequest = new AuthApiRequest();
export default authApiRequest;
