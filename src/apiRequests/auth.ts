import { toast } from '@/components/ui/use-toast';
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
    async login(body: LoginBodyType & { turnstileToken: string }) {
        try {
            const response: LoginResponseType = await http.post(
                '/auth/login',
                body,
            );
            toast({
                title: 'Success',
                description: response.message,
            });
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
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
            toast({
                title: 'Success',
                description: response.message,
            });
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }

    async register(body: RegisterBodyType & { turnstileToken: string }) {
        try {
            const response: RegisterResType = await http.post<RegisterResType>(
                '/auth/register',
                body,
            );

            toast({
                title: 'Success',
                description: response.message,
            });
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
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

            toast({
                title: 'Success',
                description: response.message,
            });
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
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

            toast({
                title: 'Success',
                description: response.message,
            });
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
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
            toast({
                title: 'Success',
                description: response.message,
            });
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }

    async forgotPassword(
        body: ForgotPasswordType & { turnstileToken: string },
    ) {
        try {
            const response: ForgotPasswordResponseType = await http.post(
                '/users/reset-password',
                body,
            );
            toast({
                title: 'Success',
                description: response.message,
            });
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }
}

const authApiRequest = new AuthApiRequest();
export default authApiRequest;
