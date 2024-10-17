import {
    GetOrderStatusResponseType,
    UpdateOrderResponseType,
} from '@/apiRequests/order';
import productApiRequest, {
    ProductReviewResponseType,
} from '@/apiRequests/product';
import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';
import { BrandResponseType } from '@/schemaValidations/brand.schema';
import { CategoryResponseType } from '@/schemaValidations/category.schema';
import {
    ProductDescriptionType,
    ProductDetailType,
    ProductImagesType,
    ProductPaginationResponseType,
} from '@/schemaValidations/product.schema';

export type FetchAllUsersResponseType = {
    statusCode: number;
    message: string;
    data: UserResponseType[];
};

export type FetchAllBannersResponseType = {
    statusCode: number;
    message: string;
    data: BannersResponseType[];
};

export type UpdateBannerResponseType = {
    statusCode: number;
    message: string;
    data: BannersResponseType;
};

export type FetchNewsResponseType = {
    statusCode: number;
    message: string;
    data: NewsResponseType;
};

export type FetchAllNewsResponseType = {
    statusCode: number;
    message: string;
    data: NewsResponseType[];
};

export type UpdateNewsResponseType = {
    statusCode: number;
    message: string;
    data: NewsResponseType;
};

export type NewsResponseType = {
    id: string;
    title: string;
    content: string;
    slug: string;
    image: string;
    created_at: Date;
    updated_at: Date;
};

export type BannersResponseType = {
    id: string;
    title: string;
    image: string;
    link: string;
    slug: string;
    status: 'show' | 'hide';
    type: 'big' | 'side' | 'slide';
    created_at: string;
    updated_at: string;
};

export type DeleteBannerResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
    };
};

export type ActiveUserBodyType = {
    email: string;
    is_active: boolean;
};

export type UpdateBannerBodyType = {
    image?: File;
    link?: string;
    status?: string;
    type?: string;
};

export type UpdateBannerStatusBodyType = {
    status: 'hide' | 'show';
};

export type CreateBannerBodyType = {
    title: string;
    image: File;
    link: string;
    type: string;
};

export type CreateNewsBodyType = {
    title: string;
    content: string;
    image: File;
};

export type UpdateNewsBodyType = {
    title?: string;
    content?: string;
    image?: File;
};

export type DeleteNewsResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
    };
};

export type CreateBannerResponseType = {
    statusCode: number;
    message: string;
    data: BannersResponseType;
};

export type CreateNewsResponseType = {
    statusCode: number;
    message: string;
    data: NewsResponseType;
};

export type ActiveUserResponseType = {
    statusCode: number;
    message: string;
    data: UserResponseType;
};

export type UserResponseType = {
    email: string;
    name: string;
    avatar: string;
    phone: string;
    is_active: boolean;
    created_at: string;
    address: {
        address: string;
        province: string;
        district: string;
        ward: string;
    };
};

export type RemoveBrandResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
    };
};

export type CreateBrandBodyType = {
    logo_url: File;
    name: string;
    description?: string;
};

export type CreateBrandResponseType = {
    statusCode: number;
    message: string;
    data: {
        id: string;
        name: string;
        description: string;
        logo_url: string;
        slug: string;
        is_deleted?: boolean;
        created_at?: string;
        updated_at?: string;
    };
};
export type UpdateBrandBodyType = {
    logo_url?: string | Blob;
    description?: string;
};

export type UpdateBrandResponseType = {
    statusCode: number;
    message: string;
    data: {
        id: string;
        name: string;
        description: string;
        logo_url: string;
        slug: string;
        is_deleted?: boolean;
        created_at?: string;
        updated_at?: string;
    };
};

export type RestoreBrandResponseType = RemoveBrandResponseType;

export type CreateCategoryBodyType = {
    name: string;
    description?: string;
};

export type CreateCategoryResponseType = {
    statusCode: number;
    message: string;
    data: {
        id: string;
        name: string;
        description: string;
        slug: string;
        is_deleted?: boolean;
        created_at?: string;
        updated_at?: string;
    };
};
export type UpdateCategoryBodyType = {
    description?: string;
};

export type UpdateCategoryResponseType = {
    statusCode: number;
    message: string;
    data: {
        id: string;
        name: string;
        description: string;
        slug: string;
        is_deleted?: boolean;
        created_at?: string;
        updated_at?: string;
    };
};

export type RemoveCategoryResponseType = RemoveBrandResponseType;
export type RestoreCategoryResponseType = RestoreBrandResponseType;

export type UploadSingleFileResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
        key: string;
    };
};

export type UploadMultipleFilesResponseType = {
    statusCode: number;
    message: string;
    data: {
        is_success: boolean;
        key: string;
    }[];
};

export type CreateProductOptionType = {
    sku: string;
    thumbnail: string;
    product_images: ProductImagesType;
    product_option_value?: {
        option_id: string;
        value: string;
    }[];
    label_image: string;
    price_modifier?: number;
    stock: number;
    discount: number;
    is_deleted: boolean;
    is_sale: boolean;
    technical_specs: {
        key: string;
        value: string;
    }[];
};

export type CreateProductBodyType = {
    name: string;
    descriptions: ProductDescriptionType[];
    main_image: string;
    price: number;
    brand_id: string;
    category_id: string;
    label: string;
    promotions: string[];
    warranties: string[];
    product_options?: CreateProductOptionType[];
};

export type CreateProductResponseType = {
    statusCode: number;
    message: string;
    data: ProductDetailType;
};

export type UpdateProductBodyType = {
    name: string;
    descriptions: ProductDescriptionType[];
    promotions: string[];
    warranties: string[];
    brandId: string;
    cateId: string;
    price: number;
    label: string;
};

export type UpdateProductResponseType = {
    statusCode: number;
    message: string;
    data: UpdateProductBodyType;
};

export type UpdateProductOptionBodyType = {
    price_modifier: number;
    stock: number;
    discount: number;
    is_deleted: boolean;
    is_sale: boolean;
    technical_specs: {
        key: string;
        value: string;
    }[];
    product_images?: ProductImagesType | undefined;
    label_image?: string | undefined;
    thumbnail?: string | undefined;
};

export type UpdateProductOptionResponseType = {
    statusCode: number;
    message: string;
    data: UpdateProductOptionBodyType;
};

export type CreateProductOptionBodyType = {
    product_id: string;
    product_options: CreateProductOptionType[];
};
export type CreateProductOptionResponseType = {
    statusCode: number;
    message: string;
    data: ProductDetailType;
};

export type OptionValueType = {
    id: string;
    name: string;
};

export type GetOptionValueResponseType = {
    statusCode: number;
    message: string;
    data: OptionValueType[];
};

export type GetAllComboResponseType = {
    statusCode: number;
    message: string;
    data: ComboResponseType[];
};

export type CreateComboBodyType = {
    mainProductId: string;
    productCombos: { productComboId: string; discount: number }[];
};

export type CreateProductComboType = {
    comboId: string;
    productOptionId: string;
    discount: number;
};

export type CreateComboResponseType = {
    statusCode: number;
    message: string;
    data: ComboResponseType;
};

export type UpdateComboResponseType = {
    statusCode: number;
    message: string;
    data: {
        id: string;
        status: number;
    };
};

export type UpdateProductComboBodyType = {
    productCombos: {
        product_option_id: string;
        discount: number;
    }[];
};

export type UpdateProductComboResponseType = {
    statusCode: number;
    message: string;
    data: {
        productCombos: {
            product_option_id: string;
            discount: number;
        }[];
    };
};

export type ComboResponseType = {
    id: string;
    created_at: string;
    status: number;
    product_option: {
        thumbnail: string;
        price_modifier: number;
        stock: number;
        sku: string;
        discount: number;
        slug: string;
        product: {
            id: string;
            name: string;
            price: number;
        };
    };
    product_combos: {
        id: string;
        discount: number;
        product_option: {
            id: string;
            thumbnail: string;
            price_modifier: number;
            stock: number;
            sku: string;
            discount: number;
            slug: string;
            product: {
                id: string;
                name: string;
                price: number;
            };
        };
    }[];
};

class AdminApiRequest {
    async getAllUsers(token: string) {
        try {
            const response: FetchAllUsersResponseType = await http.get(
                '/users',
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

    async getAllBanners(token: string) {
        try {
            const response: FetchAllBannersResponseType = await http.get(
                '/banners/admin',
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

    async getAllNews() {
        try {
            const response: FetchAllNewsResponseType = await http.get('/news');
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

    async getNewsBySlug(slug: string) {
        try {
            const response: FetchNewsResponseType = await http.get(
                '/news/slug/' + slug,
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

    async createNews(token: string, body: CreateNewsBodyType) {
        try {
            const formData = new FormData();
            formData.append('title', body.title);
            formData.append('content', body.content);
            formData.append('image', body.image);
            const response: CreateNewsResponseType = await http.post(
                '/news',
                formData,
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

    async updateNews(token: string, newsId: string, body: UpdateNewsBodyType) {
        try {
            const formData = new FormData();
            body?.content && formData.append('content', body.content);
            body?.image && formData.append('image', body.image);
            const response: UpdateNewsResponseType = await http.patch(
                `/news/${newsId}`,
                formData,
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

    async deleteNews(token: string, newsId: string) {
        try {
            const response: DeleteNewsResponseType = await http.delete(
                `/news/${newsId}`,
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

    async getAllOrders(token: string) {
        try {
            const response: GetOrderStatusResponseType = await http.get(
                '/orders/admin',
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

    async getAllProducts(token: string, page: number = 1, limit: number = 10) {
        try {
            const response: ProductPaginationResponseType = await http.get(
                `/products/management?page=${page}&limit=${limit}`,
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

    async getCombos(token: string) {
        try {
            const response: GetAllComboResponseType = await http.get(
                '/products/combos',
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

    async createCombo(token: string, body: CreateComboBodyType) {
        try {
            const response: CreateComboResponseType = await http.post(
                '/products/combos',
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
            return error;
        }
    }

    async updateCombo(token: string, id: string, body: { status: number }) {
        try {
            const response: UpdateComboResponseType = await http.patch(
                '/products/combos/' + id,
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
            return error;
        }
    }

    async updateProductCombo(
        token: string,
        id: string,
        body: UpdateProductComboBodyType,
    ) {
        try {
            const response: UpdateProductComboResponseType = await http.patch(
                '/products/product-combos/' + id,
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
            return error;
        }
    }

    async getProductById(token: string, id: string) {
        try {
            const response: ProductPaginationResponseType = await http.get(
                `/products/${id}/management`,
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

    async getAllReviews(token: string) {
        try {
            const response: ProductReviewResponseType = await http.get(
                `/reviews`,
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

    async getOptionValue(token: string) {
        try {
            const response: GetOptionValueResponseType = await http.get(
                `/products/option-value`,
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

    async handleActiveUser(token: string, body: ActiveUserBodyType) {
        try {
            const response: ActiveUserResponseType = await http.post(
                '/users',
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
            return error;
        }
    }

    async createNewBanner(token: string, body: CreateBannerBodyType) {
        try {
            const formData = new FormData();
            formData.append('title', body.title);
            formData.append('type', body.type);
            formData.append('link', body.link);
            formData.append('image', body.image);
            const response: CreateBannerResponseType = await http.post(
                '/banners',
                formData,
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

    async updateBanner(
        token: string,
        bannerId: string,
        body: UpdateBannerBodyType,
    ) {
        try {
            const formData = new FormData();
            body?.type && formData.append('type', body.type);
            body?.link && formData.append('link', body.link);
            body?.image && formData.append('image', body.image);
            body?.status && formData.append('status', body.status);
            const response: UpdateBannerResponseType = await http.patch(
                `/banners/${bannerId}`,
                formData,
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

    async deleteBanner(token: string, bannerId: string) {
        try {
            const response: DeleteBannerResponseType = await http.delete(
                `/banners/${bannerId}`,
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

    async getAllBrands(token: string) {
        try {
            const response: BrandResponseType = await http.get(
                '/brands/admin',
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

    async createNewBrand(token: string, body: CreateBrandBodyType) {
        try {
            const formData = new FormData();
            formData.append('name', body.name);
            formData.append('logo_url', body.logo_url);
            if (body?.description) {
                formData.append('description', body.description);
            }
            const response: CreateBrandResponseType = await http.post(
                '/brands',
                formData,
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

    async updateBrand(token: string, id: string, body: UpdateBrandBodyType) {
        try {
            const formData = new FormData();
            if (body?.logo_url) {
                formData.append('logo_url', body.logo_url!);
            }
            if (body?.description) {
                formData.append('description', body.description!);
            }
            const response: UpdateBrandResponseType = await http.patch(
                '/brands/' + id,
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

    async removeBrand(token: string, brandId: string) {
        try {
            const response: RemoveBrandResponseType = await http.delete(
                '/brands/' + brandId,
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

    async restoreBrand(token: string, brandId: string) {
        try {
            const response: RestoreBrandResponseType = await http.post(
                '/brands/restore/' + brandId,
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

    async getAllCategories(token: string) {
        try {
            const response: CategoryResponseType = await http.get(
                '/categories/admin',
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

    async createNewCategory(token: string, body: CreateCategoryBodyType) {
        try {
            const response: CreateBrandResponseType = await http.post(
                '/categories',
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
            return error;
        }
    }

    async updateCategory(
        token: string,
        id: string,
        body: UpdateCategoryBodyType,
    ) {
        try {
            const response: UpdateBrandResponseType = await http.patch(
                '/categories/' + id,
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

    async removeCategory(token: string, cateId: string) {
        try {
            const response: RemoveCategoryResponseType = await http.delete(
                '/categories/' + cateId,
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

    async restoreCategory(token: string, cateId: string) {
        try {
            const response: RestoreCategoryResponseType = await http.post(
                '/categories/restore/' + cateId,
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

    async createReplyReview(token: string, id: string, comment: string) {
        return await productApiRequest.createReplyReview(token, id, comment);
    }

    async updateOrderStatus(token: string, id: string, status: number) {
        try {
            const response: UpdateOrderResponseType = await http.patch(
                `/orders/${id}/status/admin`,
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

    async uploadFile(token: string, file: File, folder?: string) {
        const formData = new FormData();
        const fileType = file.type?.split('/')[0] ?? 'image';
        formData.append(fileType, file);
        folder && formData.append('folder', folder);
        const url =
            fileType === 'image' ? '/medias/upload' : '/medias/upload/video';

        try {
            const response: UploadSingleFileResponseType = await http.post(
                url,
                formData,
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

    async uploadMultipleFiles(token: string, files: FileList, folder?: string) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('images', file);
        });
        folder && formData.append('folder', folder);

        try {
            const response: UploadMultipleFilesResponseType = await http.post(
                '/medias/uploads',
                formData,
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

    async createProduct(token: string, body: CreateProductBodyType) {
        try {
            const response: CreateProductResponseType = await http.post(
                '/products',
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
                variant: 'destructive',
                description:
                    typeof error?.payload?.message === 'object'
                        ? error?.payload?.message
                              ?.map((elem: { [key: string]: string }) =>
                                  Object.values(elem),
                              )
                              .join(', ')
                        : error?.payload?.message ?? 'Lỗi không xác định',
            });
        }
    }

    async createProductOption(
        token: string,
        body: CreateProductOptionBodyType,
    ) {
        try {
            const response: CreateProductOptionResponseType = await http.post(
                '/products/options',
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
                variant: 'destructive',
                description:
                    typeof error?.payload?.message === 'object'
                        ? error?.payload?.message
                              ?.map((elem: { [key: string]: string }) =>
                                  Object.values(elem),
                              )
                              .join(', ')
                        : error?.payload?.message ?? 'Lỗi không xác định',
            });
        }
    }

    async updateProduct(
        token: string,
        id: string,
        body: UpdateProductBodyType,
    ) {
        try {
            const response: UpdateProductResponseType = await http.patch(
                '/products/' + id,
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
                description:
                    typeof error?.payload?.message === 'object'
                        ? error?.payload?.message?.[0]?.status
                        : error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
        }
    }

    async updateProductOption(
        token: string,
        id: string,
        body: UpdateProductOptionBodyType,
    ) {
        try {
            const response: UpdateProductOptionResponseType = await http.patch(
                '/products/options/' + id,
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
                description:
                    typeof error?.payload?.message === 'object'
                        ? error?.payload?.message?.[0]?.status
                        : error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
        }
    }
}

const adminApiRequest = new AdminApiRequest();
export default adminApiRequest;
