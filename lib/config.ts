import { z } from 'zod';

const configSchema = z.object({
    EXPO_PUBLIC_API_URL: z.string(),
    EXPO_PUBLIC_GHN_URL: z.string(),
    EXPO_PUBLIC_GHN_KEY: z.string(),
    EXPO_PUBLIC_SUBIZ_ACCOUNT_ID: z.string(),
    EXPO_PUBLIC_TINY_EDITOR_KEY: z.string(),
    EXPO_PUBLIC_FRONTEND_URL: z.string(),
    EXPO_PUBLIC_PYTHON_API_URL: z.string(),
    EXPO_PUBLIC_GOOGLE_APP_ID: z.string(),
});

const configProject = configSchema.safeParse({
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_GHN_URL: process.env.EXPO_PUBLIC_GHN_URL,
    EXPO_PUBLIC_GHN_KEY: process.env.EXPO_PUBLIC_GHN_KEY,
    EXPO_PUBLIC_SUBIZ_ACCOUNT_ID: process.env.EXPO_PUBLIC_SUBIZ_ACCOUNT_ID,
    EXPO_PUBLIC_TINY_EDITOR_KEY: process.env.EXPO_PUBLIC_TINY_EDITOR_KEY,
    EXPO_PUBLIC_FRONTEND_URL: process.env.EXPO_PUBLIC_FRONTEND_URL,
    EXPO_PUBLIC_PYTHON_API_URL: process.env.EXPO_PUBLIC_PYTHON_API_URL,
    EXPO_PUBLIC_GOOGLE_APP_ID: process.env.EXPO_PUBLIC_GOOGLE_APP_ID,
});

if (!configProject.success) {
    console.error(configProject.error.issues);
    throw new Error('Các giá trị khai báo trong file .env không hợp lệ');
}

const envConfig = configProject.data;
export default envConfig;
