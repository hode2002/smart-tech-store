import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';
import { ProductFilterType } from '../schemaValidations/product.schema';
import {
    ProductPaginationResponseType,
    GetProductsResponseType,
    GetProductDetailResponseType,
} from '@/schemaValidations/product.schema';
import { convertFilterOptionToQueryString } from '@/lib/utils';

export type CreateProductReviewType = {
    product_option_id: string;
    star: number;
    comment: string;
    video_url?: string;
    images?: string[];
};

export type ProductReviewResponseType = {
    statusCode: number;
    message: string;
    data: ProductReview[];
};

export type ProductReview = {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
    };
    product_option: {
        id: string;
        sku: string;
        thumbnail: string;
        product: {
            id: string;
            name: string;
        };
    };
    star: number;
    comment: string;
    video_url?: string;
    review_images?: {
        image_url: string;
    }[];
    children: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
            role?: string;
        };
        comment: string;
        _count: {
            children: number;
        };
    }[];
    created_at: string;
    _count: {
        children: number;
    };
};

export type GetAllProductReviewResponseType = {
    statusCode: number;
    message: string;
    data: ProductReview[];
};

class ProductApiRequest {
    async getProducts() {
        try {
            const response: ProductPaginationResponseType =
                await http.get('/products?page=1');
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

    async getProductsByKeyword(keyword: string) {
        try {
            const response: ProductPaginationResponseType = await http.get(
                '/products/search?keyword=' + keyword,
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

    async getProductsByImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response: GetProductsResponseType = await http.post(
                '/products/closest',
                formData,
                {},
                'python',
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

    async getProductsSale() {
        try {
            const response: GetProductsResponseType =
                await http.get('/products/sale');
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

    async getProductsByBrand(slug: string) {
        try {
            const response: GetProductsResponseType = await http.get(
                '/products/brand/' + slug,
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

    async getProductsByCategory(slug: string) {
        try {
            const response: GetProductsResponseType = await http.get(
                '/products/category/' + slug,
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

    async getProductsById(id: string) {
        try {
            const response: GetProductDetailResponseType = await http.get(
                '/products/' + id,
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

    async getProductsBySlug(slug: string) {
        try {
            const response: GetProductDetailResponseType = await http.get(
                '/products/slug/' + slug,
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

    async getProductsByUserFilter(category: string, filter: ProductFilterType) {
        try {
            const response: GetProductsResponseType = await http.get(
                '/products/parameters?ca=' +
                    category +
                    convertFilterOptionToQueryString(filter),
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

    async createProductReview(
        token: string,
        reviewObject: CreateProductReviewType,
    ) {
        try {
            const response: ProductReviewResponseType = await http.post(
                '/reviews',
                reviewObject,
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

    async createReplyReview(token: string, id: string, comment: string) {
        try {
            const response: ProductReviewResponseType = await http.post(
                `/reviews/${id}/reply`,
                { comment },
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

    async deleteProductReview(token: string, id: string) {
        try {
            const response: ProductReviewResponseType = await http.delete(
                '/reviews/' + id,
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

const productApiRequest = new ProductApiRequest();
export default productApiRequest;
