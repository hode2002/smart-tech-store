import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';
import { SuccessResponse } from '../lib/http';
import {
    ChangePasswordResponseType,
    ChangePasswordType,
    GetProfileResponseType,
    HistorySearchResponseType,
    UpdateAddressBodyType,
    UpdateAddressResponseType,
    UpdateAvatarResponseType,
    UpdateProfileResponseType,
    UpdateProfileType,
} from '@/schemaValidations/account.schema';
import { CartItem, HistorySearchItem } from '@/lib/store/slices';

export type AddToCartBodyType = {
    productOptionId: string;
    quantity: number;
};

export type AddToCartResponseType = {
    statusCode: number;
    message: string;
    data: CartItem & {
        quantity: number;
    };
};

export type ChangeProductOptionBodyType = {
    oldOptionId: string;
    newOptionId: string;
};

export type ChangeProductOptionResponseType = AddToCartResponseType;

export type GetCartProductResponseType = {
    statusCode: number;
    message: string;
    data: CartItem[];
};

export type RemoveCartProductResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
    };
};

class AccountApiRequest {
    private async fetchAddress(
        type: 'province' | 'district' | 'ward',
        id?: string,
    ) {
        const GHN_URL = process.env.NEXT_PUBLIC_GHN_URL as string;
        const GHN_KEY = process.env.NEXT_PUBLIC_GHN_KEY as string;

        let query = '';
        switch (type) {
            case 'district':
                query = '?province_id=' + id;
                break;
            case 'ward':
                query = '?district_id=' + id;
                break;
        }

        try {
            const address: SuccessResponse<any> = await fetch(
                `${GHN_URL}/${type}` + query,
                {
                    headers: { Token: GHN_KEY },
                },
            ).then((response) => response.json());
            return address.data;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }
    async getProvinces() {
        const provinces = await this.fetchAddress('province');
        if (provinces?.length) return provinces;
        return [];
    }
    async getDistricts(provinceId: string | undefined) {
        if (provinceId) {
            return await this.fetchAddress('district', provinceId);
        }
        return [];
    }
    async getWards(districtId: string | undefined) {
        if (districtId) {
            return await this.fetchAddress('ward', districtId);
        }
        return [];
    }
    async getUserProfile(token: string) {
        try {
            const response: GetProfileResponseType = await http.get(
                '/users/profile',
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
            return error;
        }
    }
    async getUserAddress(token: string) {
        try {
            const response: UpdateAddressResponseType = await http.get(
                '/users/address',
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
            return error;
        }
    }
    async updateAddress(token: string, body: UpdateAddressBodyType) {
        try {
            const response: UpdateAddressResponseType = await http.patch(
                '/users/address',
                body,
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
    async updateProfile(token: string, body: UpdateProfileType) {
        try {
            const response: UpdateProfileResponseType = await http.patch(
                '/users/profile',
                body,
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
    async updateAvatar(token: string, body: { avatar: File }) {
        try {
            const formData = new FormData();
            formData.append('avatar', body.avatar);
            const response: UpdateAvatarResponseType = await http.patch(
                '/users/avatar',
                formData,
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
    async changePassword(token: string, body: ChangePasswordType) {
        try {
            const { oldPass, newPass } = body;
            const response: ChangePasswordResponseType = await http.post(
                '/users/change-password',
                { oldPass, newPass },
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
        }
    }

    async createHistorySearch(token: string, body: HistorySearchItem) {
        try {
            const { search_content } = body;
            const response = await http.post(
                '/history-search',
                { search_content },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
        }
    }

    async createHistorySearchList(token: string, body: HistorySearchItem[]) {
        try {
            const response = await http.post('/history-search/list', body, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            });
            return response.data;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
        }
    }

    async getHistorySearch(token: string) {
        try {
            const response = await http.get('/history-search', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            });
            return response.data;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
        }
    }

    async removeHistorySearch(token: string, body: HistorySearchItem) {
        try {
            const { id } = body;
            const response: HistorySearchResponseType = await http.delete(
                '/history-search/' + id,
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

    async getProductsFromCart(token: string) {
        try {
            const response: GetCartProductResponseType = await http.get(
                '/cart',
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

    async addToCart(token: string, body: AddToCartBodyType) {
        try {
            const response: AddToCartResponseType = await http.post(
                '/cart',
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

    async changeProductOption(
        token: string,
        body: ChangeProductOptionBodyType,
    ) {
        try {
            const response: ChangeProductOptionResponseType = await http.post(
                '/cart/change-product-option',
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

    async updateProductQuantityFromCart(
        token: string,
        body: AddToCartBodyType,
    ) {
        try {
            const response: AddToCartResponseType = await http.patch(
                '/cart',
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

    async removeProductFromCart(
        token: string,
        body: Omit<AddToCartBodyType, 'quantity'>,
    ) {
        try {
            const response: RemoveCartProductResponseType = await http.delete(
                '/cart',
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
}

const accountApiRequest = new AccountApiRequest();
export default accountApiRequest;
