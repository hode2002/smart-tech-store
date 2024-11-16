'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/app/(user)/(auth)/login/login-form';
import {
    FacebookLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons';
import { useEffect } from 'react';
import { setRegisterEmail } from '@/lib/store/slices';
import { useAppDispatch } from '@/lib/store';

export default function Login() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(setRegisterEmail(''));
        };
    }, [dispatch]);

    return (
        <div className="py-10 bg-popover min-h-screen">
            <Card className="mx-auto max-w-sm ">
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <LoginForm />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Hoặc tiếp tục với
                                </span>
                            </div>
                        </div>
                        <div className="flex">
                            <Link
                                href={apiUrl + '/auth/facebook'}
                                className="w-[50%]"
                            >
                                <FacebookLoginButton
                                    text="Facebook"
                                    align="center"
                                    size="41px"
                                />
                            </Link>
                            <Link
                                href={apiUrl + '/auth/google'}
                                className="w-[50%]"
                            >
                                <GoogleLoginButton
                                    text="Google"
                                    align="center"
                                    size="41px"
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="underline">
                            Đăng ký
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
