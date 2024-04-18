import InputOtpForm from '@/app/(user)/(auth)/register/verify-otp/input-otp-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function page() {
    return (
        <Card className="mx-auto max-w-sm my-10">
            <CardHeader>
                <CardTitle className="text-2xl text-center">
                    Xác thực OTP
                </CardTitle>
            </CardHeader>
            <CardContent>
                <InputOtpForm />
            </CardContent>
        </Card>
    );
}
