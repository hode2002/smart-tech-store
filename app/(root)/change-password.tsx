import { View, TextInput, Text, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useAuthStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
    ChangePassword,
    ChangePasswordType,
} from '@/schemaValidations/account.schema';
import { Button } from '@/components/Button';
import accountApiRequest from '@/lib/apiRequest/account';
import { router } from 'expo-router';

const ChangePasswordScreen = () => {
    const { accessToken } = useAuthStore((state) => state);

    const [loading, setLoading] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ChangePasswordType>({
        resolver: zodResolver(ChangePassword),
        defaultValues: {
            oldPass,
            newPass,
            confirmNewPass,
        },
    });

    const onSubmit = async () => {
        if (loading) return;
        setLoading(true);
        const response = await accountApiRequest.changePassword(accessToken, {
            oldPass: getValues('oldPass'),
            newPass: getValues('newPass'),
            confirmNewPass: getValues('confirmNewPass'),
        });
        setLoading(false);
        if (response?.statusCode === 200) {
            setOldPass('');
            setNewPass('');
            setConfirmNewPass('');
            router.back();
        }
    };

    return (
        <View className="h-screen py-10 items-center bg-white">
            <View className="w-11/12 bg-white rounded-lg">
                <Controller
                    control={control}
                    name="oldPass"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-2 font-JakartaMedium">
                                Mật khẩu hiện tại
                            </Text>
                            <TextInput
                                inputMode="text"
                                secureTextEntry
                                onChangeText={onChange}
                                className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                            />
                            {errors.oldPass && (
                                <Text style={{ color: 'red' }}>
                                    {errors.oldPass.message}
                                </Text>
                            )}
                        </View>
                    )}
                />
                <Controller
                    control={control}
                    name="newPass"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-2 font-JakartaMedium">
                                Mật khẩu mới
                            </Text>
                            <TextInput
                                inputMode="text"
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                                className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                            />
                            {errors.newPass && (
                                <Text style={{ color: 'red' }}>
                                    {errors.newPass.message}
                                </Text>
                            )}
                        </View>
                    )}
                />
                <Controller
                    control={control}
                    name="confirmNewPass"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-2 font-JakartaMedium">
                                Nhập lại
                            </Text>
                            <TextInput
                                inputMode="text"
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                                className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                            />
                            {errors.confirmNewPass && (
                                <Text style={{ color: 'red' }}>
                                    {errors.confirmNewPass.message}
                                </Text>
                            )}
                        </View>
                    )}
                />
                <View>
                    {loading ? (
                        <View className="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    ) : (
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            label="Xác nhận"
                            labelClasses="font-JakartaBold text-white"
                            className="mt-4 min-w-[120px] rounded-md bg-black"
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default ChangePasswordScreen;
