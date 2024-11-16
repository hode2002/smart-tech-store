'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
    CreatePassword,
    CreatePasswordResponseType,
    CreatePasswordType,
} from '@/schemaValidations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/ui/password-input';
import { useEffect, useState } from 'react';
import authApiRequest from '@/apiRequests/auth';
import { useAppSelector } from '@/lib/store';

export function CreatePasswordForm() {
    const router = useRouter();
    const registerEmail = useAppSelector((state) => state.auth.registerEmail);

    useEffect(() => {
        if (!registerEmail) {
            return router.push('/login');
        }
    }, [router, registerEmail]);

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const form = useForm<CreatePasswordType>({
        resolver: zodResolver(CreatePassword),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async ({ password }: CreatePasswordType) => {
        if (loading) return;
        setLoading(true);
        const response: CreatePasswordResponseType =
            await authApiRequest.createPassword({
                email: registerEmail,
                password,
            });
        setLoading(false);
        if (response.statusCode === 200) {
            router.push('/login');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={() => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    tabIndex={1}
                                    value={password}
                                    onChange={(e) => {
                                        const password = e.target.value;
                                        setPassword(password);
                                        form.setValue('password', password);
                                    }}
                                    placeholder="password..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={() => (
                        <FormItem>
                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    tabIndex={2}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        const confirmPassword = e.target.value;
                                        setConfirmPassword(confirmPassword);
                                        form.setValue(
                                            'confirmPassword',
                                            confirmPassword,
                                        );
                                    }}
                                    placeholder="password..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Xác nhận
                </Button>
            </form>
        </Form>
    );
}
