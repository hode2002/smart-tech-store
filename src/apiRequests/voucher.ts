import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';

export type CheckValidVoucherResponseType = {
    statusCode: number;
    message: string;
    data: VoucherType;
};

export type VoucherResponseType = {
    statusCode: number;
    message: string;
    data: VoucherType;
};

export type GetAllVoucherResponseType = {
    statusCode: number;
    message: string;
    data: VoucherType[];
};

export type VoucherType = {
    id: string;
    code: string;
    type: 'FIXED' | 'PERCENT';
    value: number;
    start_date: Date;
    end_date: Date;
    available_quantity: number;
    min_order_value: number;
    status: number;
    created_at: Date;
    updated_at: Date;
};

export type CreateVoucherBodyType = {
    type: 'FIXED' | 'PERCENT';
    code?: string;
    value: number;
    start_date: Date;
    end_date: Date;
    available_quantity: number;
    min_order_value: number;
};

export type UpdateVoucherBodyType = {
    type?: 'FIXED' | 'PERCENT';
    code?: string;
    value?: number;
    start_date?: Date;
    end_date?: Date;
    available_quantity?: number;
    min_order_value?: number;
    status?: number;
};

class VoucherApiRequest {
    async create(token: string, body: CreateVoucherBodyType) {
        try {
            const response: VoucherResponseType = await http.post(
                '/vouchers',
                body,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error?.payload;
        }
    }

    async getAll(token: string) {
        try {
            const response: GetAllVoucherResponseType = await http.get(
                '/vouchers',
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error?.payload;
        }
    }

    async update(
        token: string,
        voucherId: string,
        body: UpdateVoucherBodyType,
    ) {
        try {
            const response: VoucherResponseType = await http.patch(
                '/vouchers/' + voucherId,
                body,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error?.payload;
        }
    }

    async delete(token: string, voucherId: string) {
        try {
            const response: VoucherResponseType = await http.delete(
                '/vouchers/' + voucherId,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error?.payload;
        }
    }

    async restore(token: string, voucherId: string) {
        try {
            const response: VoucherResponseType = await http.patch(
                '/vouchers/restore/' + voucherId,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error?.payload;
        }
    }

    async checkValidVoucher(
        token: string,
        voucherCode: string,
        totalOrderPrice: number,
    ) {
        try {
            const response: CheckValidVoucherResponseType = await http.post(
                '/vouchers/check',
                { voucherCode, totalOrderPrice },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error?.payload;
        }
    }
}

const voucherApiRequest = new VoucherApiRequest();
export default voucherApiRequest;
