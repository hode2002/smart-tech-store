import envConfig from '@/config';
import { jwtDecode } from 'jwt-decode';
import { store } from '@/lib/store';
import {
    removeUserProfile,
    setAccessToken,
    setRefreshToken,
    userLogout,
} from '@/lib/store/slices';
import { redirect } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export type SuccessResponse<DataType> = {
    statusCode: number;
    message: string;
    data?: DataType;
};

export type ErrorResponse = {
    statusCode: number;
    message: string;
    error: string;
};

export type ApiResponse<DataType> = SuccessResponse<DataType> | ErrorResponse;

type CustomOptions = RequestInit & {
    baseUrl?: string | undefined;
};

const AUTHENTICATION_ERROR_STATUS = 401;

export class HttpError extends Error {
    status: number;
    payload: {
        message: string;
        [key: string]: any;
    };
    constructor({ status, payload }: { status: number; payload: any }) {
        super('Http Error');
        this.status = status;
        this.payload = payload;
    }
}

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined,
) => {
    const body = options?.body
        ? options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body)
        : undefined;

    const baseHeaders =
        body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    const baseUrl = envConfig.NEXT_PUBLIC_API_URL;
    const fullUrl = baseUrl + url;

    const res = await fetch(fullUrl, {
        ...options,
        method,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        } as any,
        body,
    });

    const payload: Response = await res.json();

    if (!res.ok) {
        if (res.status === AUTHENTICATION_ERROR_STATUS) {
            const rfTokenJson = window.localStorage.getItem('refreshToken');
            if (!rfTokenJson) return;

            const rfToken = JSON.parse(rfTokenJson);
            const decoded = jwtDecode(rfToken) as { exp: number; role: string };

            if (Date.now() >= decoded.exp * 1000) {
                store.dispatch(removeUserProfile());
                store.dispatch(userLogout());
                toast({
                    description: 'Phiên đăng nhập của bạn đã hết hạn',
                    variant: 'default',
                });
                return redirect('/login');
            }
            const refreshTokenUrl = baseUrl + '/auth/token/refresh';
            const refreshTokenResponse = await fetch(refreshTokenUrl, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + rfToken,
                },
            });

            if (refreshTokenResponse.ok) {
                const result: SuccessResponse<{
                    accessToken: string;
                    refreshToken: string;
                }> = await refreshTokenResponse.json();

                const { accessToken, refreshToken } = result.data!;

                const originalRequest = await fetch(fullUrl, {
                    ...options,
                    method,
                    headers: {
                        ...baseHeaders,
                        Authorization: 'Bearer ' + accessToken,
                    } as any,
                    body,
                });

                if (originalRequest.ok) {
                    store.dispatch(setAccessToken(accessToken));
                    store.dispatch(setRefreshToken(refreshToken));

                    return await originalRequest.json();
                }
            }
        } else {
            throw new HttpError({
                status: res.status,
                payload,
            });
        }
    }

    return { ...payload };
};

const http = {
    get<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined,
    ) {
        return request<Response>('GET', url, options);
    },
    post<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
    ) {
        return request<Response>('POST', url, { ...options, body });
    },
    put<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
    ) {
        return request<Response>('PUT', url, { ...options, body });
    },
    patch<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
    ) {
        return request<Response>('PATCH', url, { ...options, body });
    },
    delete<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
    ) {
        return request<Response>('DELETE', url, { ...options, body });
    },
};

export default http;
