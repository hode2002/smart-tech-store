import z from 'zod';

export const Category = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    is_deleted: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});
export type CategoryType = z.TypeOf<typeof Category>;

export const CategoryResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(Category),
});
export type CategoryResponseType = z.TypeOf<typeof CategoryResponse>;
