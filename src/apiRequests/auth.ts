import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';
import {
    ForgotPasswordResponseType,
    ForgotPasswordType,
    LoginBodyType,
    LoginResponseType,
    LogoutResponseType,
    RegisterBodyType,
    RegisterResType,
} from '@/schemaValidations/auth.schema';

class AuthApiRequest {
    async login(body: LoginBodyType) {
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

    register(body: RegisterBodyType) {
        http.post<RegisterResType>('/auth/register', body);
    }

    async forgotPassword(body: ForgotPasswordType) {
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
