import { Brand } from '@/schemaValidations/brand.schema';
import { Category } from '@/schemaValidations/category.schema';
import { z } from 'zod';

export const ProductFilter = z.object({
    brands: z.array(z.string()),
    prices: z.array(z.string()),
    operatingSystems: z.array(z.string()),
    screenSize: z.array(z.string()),
    cpu: z.array(z.string()),
    rams: z.array(z.string()),
    roms: z.array(z.string()),
    specialFeatures: z.array(z.string()),
    charger: z.array(z.string()),
    pin: z.array(z.string()),
});

export type ProductFilterType = z.TypeOf<typeof ProductFilter>;

export type RatingType = {
    total_reviews: number;
    details: Array<number>;
    overall: number;
};
export type ReviewItem = {
    id: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        avatar: string;
    };
    star: number;
    comment: string;
    children: {
        id: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
        comment: string;
        created_at: string;
    }[];
    created_at: string;
    _count: {
        children: number;
    };
};

export type TechnicalSpecsItem = { name: string; value: string };

export const ProductDescription = z.object({
    id: z.string().optional(),
    content: z.string(),
});
export type ProductDescriptionType = z.TypeOf<typeof ProductDescription>;

export const ProductImages = z.array(
    z.object({
        id: z.string().optional(),
        image_url: z.string(),
        image_alt_text: z.string(),
    }),
);

export type ProductImagesType = z.TypeOf<typeof ProductImages>;

export const ProductOption = z.object({
    id: z.string(),
    sku: z.string(),
    thumbnail: z.string(),
    price_modifier: z.number(),
    stock: z.number(),
    discount: z.number(),
    is_sale: z.boolean(),
    slug: z.string(),
    label_image: z.string(),
    is_deleted: z.boolean().optional(),
    created_at: z.string().optional(),
    product_images: z.array(
        z.object({
            id: z.string(),
            image_url: z.string(),
            image_alt_text: z.string(),
        }),
    ),
    technical_specs: z.array(
        z.object({
            name: z.string(),
            value: z.string(),
        }),
    ),
    reviews: z.array(
        z.object({
            id: z.string(),
            user: z.object({
                id: z.string(),
                email: z.string(),
                name: z.string(),
                avatar: z.string(),
            }),
            star: z.number(),
            comment: z.string(),
            children: z.array(
                z.object({
                    user: z.object({
                        id: z.string(),
                        email: z.string(),
                        name: z.string(),
                        avatar: z.string(),
                    }),
                    comment: z.string(),
                    created_at: z.string(),
                }),
            ),
            created_at: z.string(),
            _count: z.object({
                children: z.number(),
            }),
        }),
    ),
    options: z.array(
        z.object({
            name: z.string(),
            value: z.string(),
            adjust_price: z.number(),
        }),
    ),
    rating: z.object({
        total_reviews: z.number(),
        details: z.array(z.number()),
        overall: z.number(),
    }),
});

export type ProductOptionType = z.TypeOf<typeof ProductOption>;

export const ProductDetail = z.object({
    id: z.string(),
    name: z.string(),
    main_image: z.string(),
    price: z.number(),
    promotions: z.array(z.string()),
    warranties: z.array(z.string()),
    label: z.string(),
    descriptions: z.array(
        z.object({
            id: z.string(),
            content: z.string(),
        }),
    ),
    brand: Brand,
    category: Category,
    created_at: z.string().optional(),
    product_options: z.array(ProductOption),
});

export type ProductDetailType = z.TypeOf<typeof ProductDetail>;

export const GetProductDetailResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: ProductDetail,
});
export type GetProductDetailResponseType = z.TypeOf<
    typeof GetProductDetailResponse
>;

export const GetProductsResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(ProductDetail),
});

export type GetProductsResponseType = z.TypeOf<typeof GetProductsResponse>;

export const ProductPaginationResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        totalPages: z.number(),
        nextPage: z.number().optional(),
        previousPage: z.number().optional(),
        products: z.array(ProductDetail),
    }),
});

export type ProductPaginationResponseType = z.TypeOf<
    typeof ProductPaginationResponse
>;
