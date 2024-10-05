import { useState, useEffect, useCallback } from 'react';
import { ErrorResponse, SuccessResponse } from '@/lib/http';

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

export const fetchAPI = async <T>(url: string, options?: RequestInit) => {
    try {
        const response = await fetch(url, options);
        const payload = await response.json();

        if (!response.ok) {
            throw new HttpError({
                status: response.status,
                payload,
            });
        }

        return {
            statusCode: payload.statusCode,
            message: payload.message,
            data: payload.data,
        } as SuccessResponse<T>;
    } catch (error: any) {
        throw {
            statusCode: error?.status ?? 500,
            message: error?.payload?.message ?? 'Lỗi không xác định',
        } as ErrorResponse;
    }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
    const [result, setResult] = useState<SuccessResponse<T> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ErrorResponse | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchAPI<T>(url, options);
            setResult(response);
        } catch (err: any) {
            // setError((err as Error).message);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { result, loading, error, refetch: fetchData };
};
