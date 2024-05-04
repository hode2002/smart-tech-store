'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/lib/store';
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
    UpdateProfile,
    UpdateProfileResponseType,
    UpdateProfileType,
} from '@/schemaValidations/account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import accountApiRequest from '@/apiRequests/account';
import { setProfile } from '@/lib/store/slices';

export default function UpdateProfileForm() {
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.user.profile);
    const token = useAppSelector((state) => state.auth.accessToken);
    const [loading, setLoading] = useState(false);

    const form = useForm<UpdateProfileType>({
        resolver: zodResolver(UpdateProfile),
        defaultValues: {
            name: profile?.name ?? '',
            phone: profile?.phone ?? '',
        },
    });

    const onSubmit = async ({ name, phone }: UpdateProfileType) => {
        if (loading) return;
        setLoading(true);
        const response: UpdateProfileResponseType =
            await accountApiRequest.updateProfile(token, {
                name,
                phone,
            });
        setLoading(false);
        if (response.statusCode === 200) {
            const profile = response.data;
            dispatch(setProfile(profile));
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full md:w-[60%] grid gap-4 p-0 md:pr-12 border-0 md:border-r"
            >
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        defaultValue={profile?.email}
                        readOnly={true}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel htmlFor="name">Họ tên</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Họ tên..."
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel htmlFor="phone">Số điện thoại</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Số điện thoại..."
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
                    <Button
                        type="submit"
                        className="w-full text-popover hover:text-popover-foreground bg-popover-foreground hover:cursor-pointer hover:bg-popover"
                    >
                        Lưu
                    </Button>
                )}
            </form>
        </Form>
    );
}
