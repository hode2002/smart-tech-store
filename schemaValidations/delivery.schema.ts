import z from 'zod';

export const DeliveryResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            slug: z.string(),
        }),
    ),
});
export type DeliveryResponseType = z.TypeOf<typeof DeliveryResponse>;
