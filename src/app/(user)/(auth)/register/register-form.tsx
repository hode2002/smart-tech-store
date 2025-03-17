'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
    RegisterBody,
    RegisterBodyType,
    RegisterResType,
} from '@/schemaValidations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import authApiRequest from '@/apiRequests/auth';
import { setRegisterEmail } from '@/lib/store/slices';
import { useAppDispatch } from '@/lib/store';

export function RegisterForm({ turnstileToken }: { turnstileToken: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async ({ email }: RegisterBodyType) => {
        if (loading) return;
        setLoading(true);
        const response: RegisterResType = await authApiRequest.register({
            email,
            turnstileToken
        });
        setLoading(false);
        if (response.statusCode === 200) {
            const { email } = response.data;
            router.push('/register/verify-otp');
            dispatch(setRegisterEmail(email));
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="email..."
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={!turnstileToken}>
                    Đăng ký
                </Button>
            </form>
        </Form>
    );
}
