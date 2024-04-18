import { CreatePasswordForm } from '@/app/(user)/(auth)/register/create-password/create-password-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function page() {
    return (
        <Card className="mx-auto max-w-sm my-10">
            <CardHeader>
                <CardTitle className="text-2xl text-center">
                    Tạo mật khẩu
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CreatePasswordForm />
            </CardContent>
        </Card>
    );
}
