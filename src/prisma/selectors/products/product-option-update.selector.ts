import { Prisma } from '@prisma/client';

export const PRODUCT_OPTION_UPDATE_SELECT = {
    product: {
        select: { category: true },
    },
    thumbnail: true,
    label_image: true,
    technical_specs: true,
    product_images: {
        select: {
            image_url: true,
        },
    },
} as const;

export type ProductOptionUpdate = Prisma.ProductOptionGetPayload<{
    select: typeof PRODUCT_OPTION_UPDATE_SELECT;
}>;
