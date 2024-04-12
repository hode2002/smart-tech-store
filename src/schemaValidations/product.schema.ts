import { z } from 'zod';

export const ProductFilter = z.object({
    brands: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
    }),
    prices: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
    }),
    operatingSystems: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: 'You have to select at least one item.',
        }),
    screenSize: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: 'You have to select at least one item.',
        }),
    cpu: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
    }),
    rams: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
    }),
    roms: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
    }),
    specialFeatures: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: 'You have to select at least one item.',
        }),
});

export type ProductFilterType = z.TypeOf<typeof ProductFilter>;

export const ProductResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
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
            brand: z.object({
                id: z.string(),
                name: z.string(),
                logo_url: z.string(),
                slug: z.string(),
            }),
            category: z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
            }),
            product_options: z.array(
                z.object({
                    id: z.string(),
                    sku: z.string(),
                    thumbnail: z.string(),
                    price_modifier: z.number(),
                    stock: z.number(),
                    discount: z.number(),
                    is_sale: z.boolean(),
                    slug: z.string(),
                    label_image: z.string(),
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
                }),
            ),
        }),
    ),
});

export type ProductResponseType = z.TypeOf<typeof ProductResponse>;

export const ProductPaginationResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        totalPages: z.number(),
        products: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
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
                brand: z.object({
                    id: z.string(),
                    name: z.string(),
                    logo_url: z.string(),
                    slug: z.string(),
                }),
                category: z.object({
                    id: z.string(),
                    name: z.string(),
                    slug: z.string(),
                }),
                product_options: z.array(
                    z.object({
                        id: z.string(),
                        sku: z.string(),
                        thumbnail: z.string(),
                        price_modifier: z.number(),
                        stock: z.number(),
                        discount: z.number(),
                        is_sale: z.boolean(),
                        slug: z.string(),
                        label_image: z.string(),
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
                    }),
                ),
            }),
        ),
    }),
});

export type ProductPaginationResponseType = z.TypeOf<
    typeof ProductPaginationResponse
>;
