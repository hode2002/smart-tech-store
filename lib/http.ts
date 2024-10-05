import envConfig from '@/lib/config';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuthStore, useUserStore } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    server: 'node' | 'python' = 'node',
) => {
    const body = options?.body
        ? options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body)
        : undefined;

    const baseHeaders =
        body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    const baseUrl =
        server === 'node'
            ? envConfig.EXPO_PUBLIC_API_URL
            : envConfig.EXPO_PUBLIC_PYTHON_API_URL;
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
            const rfTokenJson = await AsyncStorage.getItem('refreshToken');
            if (!rfTokenJson) return;

            const { removeUserProfile } = useUserStore.getState();
            const { userLogout, setAccessToken, setRefreshToken } =
                useAuthStore.getState();

            const rfToken = JSON.parse(rfTokenJson);
            const decoded = jwtDecode(rfToken) as { exp: number; role: string };

            if (Date.now() >= decoded.exp * 1000) {
                removeUserProfile();
                userLogout();
                Toast.show({
                    type: 'info',
                    text1: 'Phiên đăng nhập của bạn đã hết hạn',
                });
                return router.replace('/(auth)/login');
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
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);
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
        server: 'node' | 'python' = 'node',
    ) {
        return request<Response>('GET', url, options, server);
    },
    post<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
        server: 'node' | 'python' = 'node',
    ) {
        return request<Response>('POST', url, { ...options, body }, server);
    },
    put<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
        server: 'node' | 'python' = 'node',
    ) {
        return request<Response>('PUT', url, { ...options, body }), server;
    },
    patch<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
        server: 'node' | 'python' = 'node',
    ) {
        return request<Response>('PATCH', url, { ...options, body }, server);
    },
    delete<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
        server: 'node' | 'python' = 'node',
    ) {
        return request<Response>('DELETE', url, { ...options, body }, server);
    },
};

export default http;
