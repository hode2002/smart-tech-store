import z from 'zod';

export const BrandResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            logo_url: z.string(),
            slug: z.string(),
        }),
    ),
});
export type BrandResponseType = z.TypeOf<typeof BrandResponse>;

export const Brand = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    logo_url: z.string(),
    slug: z.string(),
});
export type BrandType = z.TypeOf<typeof Brand>;
