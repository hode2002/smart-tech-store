import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';

export type CreateOrderType = {
    name: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    hamlet?: string;
    note?: string;
    delivery_id: string;
    payment_method: string;
    order_details: {
        product_option_id: string;
        quantity: number;
        price: number;
    }[];
};

export type CreateOrderResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
        order_id: string;
        GHTK_tracking_number: number;
        payment_id: string;
    };
};

export type UpdateOrderResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
    };
};

export type CancelOrderResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
        order_id: string;
    };
};

export type CalculateShippingFeeType = {
    province: string;
    district: string;
    ward: string;
    weight: number;
    value: number;
};

export type CalculateShippingFeeResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
        fee: number;
        delivery: boolean;
        include_vat: number;
    };
};

export type UpdatePaymentStatusResponseType = {
    is_success: boolean;
};

export type OrderResponseType = {
    id: string;
    email: string;
    name: string;
    avatar: string;
    phone: string;
    note: string;
    order_date: Date;
    status: number;
    total_amount: number;
    address: string;
    province: string;
    district: string;
    ward: string;
    hamlet: string;
    fee: number;
    estimate_date: string;
    tracking_number: string;
    payment_method: string;
    transaction_id: string;
    delivery: {
        name: string;
        slug: string;
    };
    order_details: OrderDetailResponseType[];
};

export type OrderDetailResponseType = {
    id: string;
    product: {
        id: string;
        sku: string;
        name: string;
        brand: {
            id: string;
            name: string;
            slug: string;
            logo_url: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
        };
        descriptions: {
            id: string;
            content: string;
        }[];
        label: string;
        price: number;
        promotions: [];
        warranties: [];
        thumbnail: string;
        options: {
            name: string;
            value: string;
            adjust_price: number;
        }[];
        weight: number;
        label_image: string;
        price_modifier: number;
        discount: number;
        slug: string;
    };
    price: number;
    quantity: number;
    subtotal: number;
};

export type GetOrderStatusResponseType = {
    statusCode: number;
    message: string;
    data: OrderResponseType[] | [];
};

class OrderApiRequest {
    async createVnpayPayment(
        token: string,
        {
            amount,
            bankCode = 'VNBANK',
            language = 'vn',
        }: { amount: number; bankCode?: string; language?: string },
    ) {
        try {
            const response: { payment_url: string } = await http.post(
                '/orders/vnpay',
                { amount, bankCode, language },
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
        }
    }

    async updateVnpayPaymentStatus(
        token: string,
        id: string,
        transactionId: string,
    ) {
        try {
            const response: UpdatePaymentStatusResponseType = await http.patch(
                '/orders/payment/' + id,
                { transaction_id: transactionId },
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
        }
    }

    async createOrder(token: string, body: CreateOrderType) {
        try {
            const response: CreateOrderResponseType = await http.post(
                '/orders',
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
        }
    }

    async cancelOrder(token: string, id: string) {
        try {
            const response: CancelOrderResponseType = await http.post(
                '/orders/cancel/' + id,
                {},
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
        }
    }

    async updateOrderStatus(token: string, id: string, status: number) {
        try {
            const response: UpdateOrderResponseType = await http.patch(
                `/orders/${id}/status`,
                { status },
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
                description:
                    typeof error?.payload?.message === 'object'
                        ? error?.payload?.message?.[0]?.status
                        : error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
        }
    }

    async calculateShippingFee(token: string, body: CalculateShippingFeeType) {
        try {
            const response: CalculateShippingFeeResponseType = await http.post(
                '/orders/shipping/fee',
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
        }
    }

    async getOrdersByStatus(token: string, status?: number) {
        try {
            const response: GetOrderStatusResponseType = await http.get(
                '/orders/status/' + status,
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
        }
    }
}

const orderApiRequest = new OrderApiRequest();
export default orderApiRequest;
