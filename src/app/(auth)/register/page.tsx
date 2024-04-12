import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FaGoogle, FaFacebookF } from 'react-icons/fa6';
import { RegisterForm } from '@/app/(auth)/register/register-form';

export default function Register() {
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
                    <div className="flex my-2">
                        <Button variant="outline" className="w-[50%]">
                            <FaFacebookF />
                        </Button>
                        <Button variant="outline" className="w-[50%]">
                            <FaGoogle />
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
