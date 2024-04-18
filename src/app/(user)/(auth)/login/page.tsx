import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaGoogle, FaFacebookF } from 'react-icons/fa6';
import { LoginForm } from '@/app/(user)/(auth)/login/login-form';

export default function Login() {
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
                        <div className="flex my-2">
                            <Link
                                href={
                                    process.env.NEXT_PUBLIC_API_URL +
                                    '/auth/facebook'
                                }
                                className="w-[50%]"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full text-center"
                                >
                                    <FaFacebookF />
                                </Button>
                            </Link>

                            <Link
                                href={
                                    process.env.NEXT_PUBLIC_API_URL +
                                    '/auth/google'
                                }
                                className="w-[50%]"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full text-center"
                                >
                                    <FaGoogle />
                                </Button>
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
