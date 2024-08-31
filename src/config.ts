import { z } from 'zod';

const configSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_GHN_URL: z.string(),
    NEXT_PUBLIC_GHN_KEY: z.string(),
    NEXT_PUBLIC_TINY_EDITOR_KEY: z.string(),
});

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GHN_URL: process.env.NEXT_PUBLIC_GHN_URL,
    NEXT_PUBLIC_GHN_KEY: process.env.NEXT_PUBLIC_GHN_KEY,
    NEXT_PUBLIC_TINY_EDITOR_KEY: process.env.NEXT_PUBLIC_TINY_EDITOR_KEY,
});

if (!configProject.success) {
    console.error(configProject.error.issues);
    throw new Error('Các giá trị khai báo trong file .env không hợp lệ');
}

const envConfig = configProject.data;
export default envConfig;
