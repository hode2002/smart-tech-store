import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/forgot-password-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ForgotPassword() {
    return (
        <div className="py-10 min-h-screen">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />

                    <div className="mt-4 text-center text-sm">
                        Quay lại
                        <Link href="/login" className="px-2 underline">
                            Đăng nhập
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
