import { z } from 'zod';

export const RegisterBody = z
    .object({
        email: z.string().email(),
    })
    .strict();

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        email: z.string(),
    }),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
    .object({
        email: z.string().email('Email không hợp lệ'),
        password: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{6,}$/,
                'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số từ 1 - 9 và có ít nhất 6 ký tự.',
            ),
    })
    .strict();
export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        profile: z.object({
            email: z.string().email(),
            name: z.string(),
            avatar: z.string().url(),
            phone: z.string(),
            role: z.string().optional(),
        }),
        tokens: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
        }),
    }),
});
export type LoginResponseType = z.TypeOf<typeof LoginResponse>;

export type CreatePasswordBodyType = z.TypeOf<typeof LoginBody>;
export type CreatePasswordResponseType = z.TypeOf<typeof LoginResponse>;

export const LogoutResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        is_success: z.boolean(),
    }),
});
export type LogoutResponseType = z.TypeOf<typeof LogoutResponse>;

export const InputOtp = z
    .object({
        pin: z.string().min(6),
    })
    .strict();

export type InputOtpType = z.TypeOf<typeof InputOtp>;

export const CreatePassword = z
    .object({
        password: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{6,}$/,
                'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số từ 1 - 9 và có ít nhất 6 ký tự.',
            ),
        confirmPassword: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{6,}$/,
                'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số từ 1 - 9 và có ít nhất 6 ký tự.',
            ),
    })
    .strict()
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Mật khẩu không khớp',
                path: ['confirmPassword'],
            });
        }
    });
export type CreatePasswordType = z.TypeOf<typeof CreatePassword>;

export const ForgotPasswordBody = z
    .object({
        email: z.string().email('Email không hợp lệ'),
    })
    .strict();
export type ForgotPasswordType = z.TypeOf<typeof ForgotPasswordBody>;

export const ForgotPasswordResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        is_success: z.boolean(),
    }),
});
export type ForgotPasswordResponseType = z.TypeOf<
    typeof ForgotPasswordResponse
>;
