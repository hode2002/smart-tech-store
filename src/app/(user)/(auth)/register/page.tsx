'use client';
import Link from 'next/link';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RegisterForm } from '@/app/(user)/(auth)/register/register-form';
import {
    FacebookLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons';

export default function Register() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    return (
        <Card className="mx-auto max-w-sm my-10">
            <CardHeader>
                <CardTitle className="text-2xl">Đăng ký</CardTitle>
                <CardDescription>
                    Nhập email của bạn để tạo tài khoản
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <RegisterForm />
                    </div>
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
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="underline">
                        Đăng nhập
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
