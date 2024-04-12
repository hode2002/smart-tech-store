import z from 'zod';

export const HistorySearchBody = z.object({
    search_content: z.string(),
});
export type HistorySearchBodyType = z.TypeOf<typeof HistorySearchBody>;

export const HistorySearchResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(
        z.object({
            id: z.string(),
            search_content: z.string(),
        }),
    ),
});
export type HistorySearchResponseType = z.TypeOf<typeof HistorySearchResponse>;

export const UpdateAddressResponse = z
    .object({
        statusCode: z.number(),
        message: z.string(),
        data: z.object({
            address: z.string().nullable(),
            province: z.string(),
            district: z.string(),
            ward: z.string(),
        }),
    })
    .strict();
export type UpdateAddressResponseType = z.TypeOf<typeof UpdateAddressResponse>;

export const UpdateAddressBody = z.object({
    address: z.string().nullable(),
    province: z.string(),
    district: z.string(),
    ward: z.string(),
});
export type UpdateAddressBodyType = z.TypeOf<typeof UpdateAddressBody>;

export const UpdateProfileResponse = z
    .object({
        statusCode: z.number(),
        message: z.string(),
        data: z.object({
            email: z.string().email(),
            name: z.string(),
            avatar: z.string().url(),
            phone: z.string(),
        }),
    })
    .strict();

export type UpdateProfileResponseType = z.TypeOf<typeof UpdateProfileResponse>;
export type GetProfileResponseType = UpdateProfileResponseType;

export const UpdateProfile = z.object({
    name: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự').max(256),
    phone: z
        .string()
        .trim()
        .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
        .max(10, 'Số điện thoại tối đa 10 số'),
});
export type UpdateProfileType = z.TypeOf<typeof UpdateProfile>;

export const ChangePasswordResponse = z
    .object({
        statusCode: z.number(),
        message: z.string(),
        data: z.object({
            is_success: z.boolean(),
        }),
    })
    .strict();

export type ChangePasswordResponseType = z.TypeOf<
    typeof ChangePasswordResponse
>;

export const ChangePassword = z
    .object({
        oldPass: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{6,}$/,
                'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số từ 1 - 9 và có ít nhất 6 ký tự.',
            ),
        newPass: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{6,}$/,
                'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số từ 1 - 9 và có ít nhất 6 ký tự.',
            ),
        confirmNewPass: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{6,}$/,
                'Mật khẩu phải chứa một chữ hoa, một chữ thường, một số từ 1 - 9 và có ít nhất 6 ký tự.',
            ),
    })
    .strict()
    .superRefine(({ oldPass, newPass }, ctx) => {
        if (oldPass === newPass) {
            ctx.addIssue({
                code: 'custom',
                message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
                path: ['newPass'],
            });
        }
    })
    .superRefine(({ newPass, confirmNewPass }, ctx) => {
        if (newPass !== confirmNewPass) {
            ctx.addIssue({
                code: 'custom',
                message: 'Mật khẩu mới không khớp',
                path: ['confirmNewPass'],
            });
        }
    });
export type ChangePasswordType = z.TypeOf<typeof ChangePassword>;

export const UpdateAvatarResponse = z
    .object({
        statusCode: z.number(),
        message: z.string(),
        data: z.object({
            email: z.string().email(),
            name: z.string(),
            avatar: z.string().url(),
            phone: z.string(),
        }),
    })
    .strict();

export type UpdateAvatarResponseType = z.TypeOf<typeof UpdateAvatarResponse>;
