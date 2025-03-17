'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import authApiRequest from '@/apiRequests/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';
import {
    ForgotPasswordBody,
    ForgotPasswordResponseType,
    ForgotPasswordType,
} from '@/schemaValidations/auth.schema';
import { Turnstile } from '@marsidev/react-turnstile';
export function ForgotPasswordForm() {
    const router = useRouter();
    const [turnstileToken, setTurnstileToken] = useState("");
    const [loading, setLoading] = useState(false);

    const form = useForm<ForgotPasswordType>({
        resolver: zodResolver(ForgotPasswordBody),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async ({ email }: ForgotPasswordType) => {
        if (loading) return;
        setLoading(true);
        const response: ForgotPasswordResponseType =
            await authApiRequest.forgotPassword({
                email,
                turnstileToken
            });
        setLoading(false);
        if (response.statusCode === 200) {
            router.push('/login');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
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

                    {loading ? (
                        <Button disabled className="w-full">
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full" disabled={!turnstileToken}>
                            Gửi
                        </Button>
                    )}

                    <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                        onSuccess={(token) => setTurnstileToken(token)}
                    />
                </div>
            </form>
        </Form>
    );
}
