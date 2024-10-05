import z from 'zod';

export const Brand = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    logo_url: z.string(),
    slug: z.string(),
    is_deleted: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});
export type BrandType = z.TypeOf<typeof Brand>;

export const BrandResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(Brand),
});
export type BrandResponseType = z.TypeOf<typeof BrandResponse>;
