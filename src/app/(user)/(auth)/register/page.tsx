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
import { Turnstile } from '@marsidev/react-turnstile';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Register() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [turnstileToken, setTurnstileToken] = useState("");

    const handleLogin = async (type: 'google' | 'facebook') => {
        if (!turnstileToken) {
            alert("Please complete the CAPTCHA!");
            return;
        }

        const response = await fetch(`${apiUrl}/auth/validate-turnstile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ turnstileToken }),
        });

        const { data } = await response.json();
        if (data.success) {
            window.location.href = `${apiUrl}/auth/${type}`
        } else {
            alert("CAPTCHA verification failed!");
        }
    };

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
                        <RegisterForm turnstileToken={turnstileToken} />
                    </div>
                    <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                        onSuccess={(token) => setTurnstileToken(token)}
                    />
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
                        <Button className="w-[50%]" asChild disabled={!turnstileToken} onClick={() => handleLogin('facebook')}>
                            <FacebookLoginButton
                                text="Facebook"
                                align="center"
                                size="41px"
                            />
                        </Button>
                        <Button className="w-[50%]" asChild disabled={!turnstileToken} onClick={() => handleLogin('google')}>
                            <GoogleLoginButton
                                text="Google"
                                align="center"
                                size="41px"
                            />
                        </Button>
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
