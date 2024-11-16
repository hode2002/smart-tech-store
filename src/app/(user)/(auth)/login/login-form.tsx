'use client';

import { Input } from '@/components/ui/input';
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
    LoginBody,
    LoginBodyType,
    LoginResponseType,
} from '@/schemaValidations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import authApiRequest from '@/apiRequests/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';
import { PasswordInput } from '@/components/ui/password-input';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
    setAccessToken,
    setProfile,
    setRefreshToken,
} from '@/lib/store/slices';
import Link from 'next/link';

export function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const registerEmail = useAppSelector((state) => state.auth.registerEmail);

    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: registerEmail ?? '',
            password,
        },
    });

    const onSubmit = async ({ email, password }: LoginBodyType) => {
        if (loading) return;
        setLoading(true);
        const response: LoginResponseType = await authApiRequest.login({
            email,
            password,
        });
        setLoading(false);
        if (response.statusCode === 200) {
            const {
                tokens: { accessToken, refreshToken },
                profile,
            } = response.data;
            dispatch(setAccessToken(accessToken));
            dispatch(setRefreshToken(refreshToken));
            dispatch(setProfile(profile));
            if (profile.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="email..."
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={() => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <PasswordInput
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

                <div className="text-right">
                    <FormLabel>
                        <Link href="/forgot-password">Quên mật khẩu?</Link>
                    </FormLabel>
                </div>

                {loading ? (
                    <Button disabled className="w-full">
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    </Button>
                ) : (
                    <Button type="submit" className="w-full">
                        Đăng nhập
                    </Button>
                )}
            </form>
        </Form>
    );
}
