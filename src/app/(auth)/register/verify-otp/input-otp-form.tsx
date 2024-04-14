'use client';

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

import {
    InputOtp,
    InputOtpType,
    RegisterResType,
} from '@/schemaValidations/auth.schema';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { timeConvert } from '@/lib/utils';
import { useAppSelector } from '@/lib/store';
import authApiRequest, {
    ActiveUserEmailResponseType,
} from '@/apiRequests/auth';

export default function InputOtpForm() {
    const router = useRouter();
    const registerEmail = useAppSelector((state) => state.auth.registerEmail);

    useEffect(() => {
        if (!registerEmail) {
            return router.push('/login');
        }
    }, [router, registerEmail]);

    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [timeCounter, setTimeCounter] = useState<number>(300);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timeCounter > 0) {
            interval = setInterval(() => {
                setTimeCounter(timeCounter - 1);
            }, 1000);
        } else {
            router.push('/register');
        }

        return () => clearInterval(interval);
    }, [timeCounter, router]);

    const form = useForm<InputOtpType>({
        resolver: zodResolver(InputOtp),
        defaultValues: {
            pin: '',
        },
    });

    const onSubmit = async (data: InputOtpType) => {
        if (loading) return;
        setLoading(true);
        const response: ActiveUserEmailResponseType =
            await authApiRequest.activeUserEmail({
                email: registerEmail,
                otpCode: data.pin,
            });
        setLoading(false);
        if (response.statusCode === 200) {
            router.push('/register/create-password');
        }
    };

    const resendOtp = async () => {
        const response: RegisterResType = await authApiRequest.resendOtp({
            email: registerEmail,
        });
        if (response.statusCode === 200) {
            setTimeCounter(300);
            toast({
                description: response.message,
            });
        }
    };

    return (
        <div className="flex justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 pb-8"
                >
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="text-center">
                        <p>{timeConvert(timeCounter)}</p>
                        <p
                            onClick={resendOtp}
                            className="underline hover:cursor-pointer"
                        >
                            Gửi lại
                        </p>
                    </div>

                    <Button type="submit" className="mt-5 w-full">
                        Xác nhận
                    </Button>
                </form>
            </Form>
        </div>
    );
}
