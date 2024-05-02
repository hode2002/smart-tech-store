import z from 'zod';

export const CategoryResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            slug: z.string(),
            is_deleted: z.boolean().optional(),
            created_at: z.string().optional(),
            updated_at: z.string().optional(),
        }),
    ),
});
export type CategoryResponseType = z.TypeOf<typeof CategoryResponse>;

export const Category = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    slug: z.string(),
});
export type CategoryType = z.TypeOf<typeof Category>;
