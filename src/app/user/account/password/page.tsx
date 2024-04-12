'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import accountApiRequest from '@/apiRequests/account';
import {
    ChangePassword,
    ChangePasswordResponseType,
    ChangePasswordType,
} from '@/schemaValidations/account.schema';
import { PasswordInput } from '@/components/ui/password-input';
import { useAppSelector } from '@/lib/store';

export default function PasswordPage() {
    const token = useAppSelector((state) => state.auth.accessToken);

    const [loading, setLoading] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');

    const form = useForm<ChangePasswordType>({
        resolver: zodResolver(ChangePassword),
        defaultValues: {
            oldPass,
            newPass,
            confirmNewPass,
        },
    });

    const onSubmit = async (values: ChangePasswordType) => {
        if (loading) return;
        setLoading(true);
        const response: ChangePasswordResponseType =
            await accountApiRequest.changePassword(token, values);
        setLoading(false);
        if (response.statusCode === 200) {
            setOldPass('');
            setNewPass('');
            setConfirmNewPass('');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <Card className="">
                    <CardHeader>
                        <CardTitle className="text-xl px-5">
                            Đổi mật khẩu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex">
                        <div className="w-full grid gap-6 p-5">
                            <FormField
                                control={form.control}
                                name="oldPass"
                                render={() => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="oldPass">
                                            Mật khẩu cũ
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                value={oldPass}
                                                onChange={(e) => {
                                                    const oldPass =
                                                        e.target.value;
                                                    setOldPass(oldPass);
                                                    form.setValue(
                                                        'oldPass',
                                                        oldPass,
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPass"
                                render={() => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="newPass">
                                            Mật khẩu mới
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                value={newPass}
                                                onChange={(e) => {
                                                    const newPass =
                                                        e.target.value;
                                                    setNewPass(newPass);
                                                    form.setValue(
                                                        'newPass',
                                                        newPass,
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmNewPass"
                                render={() => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="confirmNewPass">
                                            {' '}
                                            Nhập lại mật khẩu mới
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                value={confirmNewPass}
                                                onChange={(e) => {
                                                    const confirmNewPass =
                                                        e.target.value;
                                                    setConfirmNewPass(
                                                        confirmNewPass,
                                                    );
                                                    form.setValue(
                                                        'confirmNewPass',
                                                        confirmNewPass,
                                                    );
                                                }}
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
                                <Button type="submit" className="w-full">
                                    Xác nhận
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
