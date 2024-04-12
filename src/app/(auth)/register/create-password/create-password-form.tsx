'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
    CreatePassword,
    CreatePasswordType,
} from '@/schemaValidations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

export function CreatePasswordForm() {
    const router = useRouter();

    const form = useForm<CreatePasswordType>({
        resolver: zodResolver(CreatePassword),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    function onSubmit(values: CreatePasswordType) {
        console.log(values);
        router.push('/');
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    autoComplete="off"
                                    placeholder="Mật khẩu..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    autoComplete="off"
                                    placeholder="Nhập lại..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Xác nhận
                </Button>
            </form>
        </Form>
    );
}
