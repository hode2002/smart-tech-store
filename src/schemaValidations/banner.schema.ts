import z from 'zod';

export const BannerImageResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            image: z.string(),
            link: z.string(),
            slug: z.string(),
            status: z.string(),
        }),
    ),
});
export type BannerImageResponseType = z.TypeOf<typeof BannerImageResponse>;

export const BannerImage = z.object({
    id: z.string(),
    title: z.string(),
    image: z.string(),
    link: z.string(),
    slug: z.string(),
    status: z.string(),
});
export type BannerImageType = z.TypeOf<typeof BannerImage>;
