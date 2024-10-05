import Toast from 'react-native-toast-message';
import http from '@/lib/http';
import { SuccessResponse } from '@/lib/http';
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
import { CartItem, HistorySearchItem } from '@/types/type';

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
        const GHN_URL = process.env.EXPO_PUBLIC_GHN_URL as string;
        const GHN_KEY = process.env.EXPO_PUBLIC_GHN_KEY as string;

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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
    async updateAvatar(token: string, body: { avatar: any }) {
        try {
            const formData = new FormData();
            const avatar: any = {
                uri: body.avatar.uri,
                name: body.avatar.fileName,
                type: body.avatar.mimeType,
            };
            formData.append('avatar', avatar);
            const response: UpdateAvatarResponseType = await http.patch(
                '/users/avatar',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
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
        }
    }

    async createHistorySearch(token: string, body: HistorySearchItem) {
        try {
            const response = await http.post('/history-search', body, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            });
            return response.data;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
        }
    }
}

const accountApiRequest = new AccountApiRequest();
export default accountApiRequest;
