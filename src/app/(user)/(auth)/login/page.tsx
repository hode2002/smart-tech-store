'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/app/(user)/(auth)/login/login-form';
import {
    FacebookLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons';
import { useEffect, useState } from 'react';
import { setRegisterEmail } from '@/lib/store/slices';
import { useAppDispatch } from '@/lib/store';
import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from '@/components/ui/button';

export default function Login() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useAppDispatch();

    const [turnstileToken, setTurnstileToken] = useState("");

    useEffect(() => {
        return () => {
            dispatch(setRegisterEmail(''));
        };
    }, [dispatch]);

    const handleLogin = async (type: 'google' | 'facebook') => {
        const turnstileToken = (window as any).turnstile.getResponse();
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
        <div className="py-10 bg-popover min-h-screen">
            <Card className="mx-auto max-w-sm ">
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <LoginForm turnstileToken={turnstileToken} />
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
