import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useAuthStore, useNotificationStore, useUserStore } from '@/store';
import { Href, router } from 'expo-router';
import { icons } from '@/constants';
import { Button } from '@/components/Button';
import { LogoutResponseType } from '@/schemaValidations/auth.schema';
import authApiRequest from '@/lib/apiRequest/auth';
import { Image } from 'react-native';
import * as Updates from 'expo-updates';

const Settings = () => {
    const { removeUserProfile } = useUserStore((state) => state);
    const { accessToken, userLogout } = useAuthStore((state) => state);
    const { setNotifications } = useNotificationStore((state) => state);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        if (loading) return;
        const response: LogoutResponseType =
            await authApiRequest.logout(accessToken);
        setLoading(false);
        if (response.statusCode === 200) {
            userLogout();
            removeUserProfile();
            setNotifications([]);
            return await Updates.reloadAsync();
        }
    };

    return (
        <View className="h-screen bg-black p-8">
            <TouchableOpacity
                onPress={() => {
                    router.push('/(root)/edit-address' as Href);
                }}
            >
                <View className="flex flex-row mt-4 px-4 w-full bg-white h-12 justify-between items-center">
                    <Text className="text-black">Địa chỉ</Text>
                    <Image
                        source={icons.chevronRight}
                        tintColor="black"
                        resizeMode="contain"
                        className="w-8 h-8"
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    router.push('/(root)/change-password' as Href);
                }}
            >
                <View className="flex flex-row mt-4 px-4 w-full bg-white h-12 justify-between items-center">
                    <Text className="text-black">Đổi mật khẩu</Text>
                    <Image
                        source={icons.chevronRight}
                        tintColor="black"
                        resizeMode="contain"
                        className="w-8 h-8"
                    />
                </View>
            </TouchableOpacity>
            {loading ? (
                <View className="mt-10 font-JakartaBold bg-white text-black px-5 py-3 min-w-[120px] rounded-md">
                    <ActivityIndicator size="small" color="#000" />
                </View>
            ) : (
                <Button
                    onPress={handleLogout}
                    label="Đăng xuất"
                    labelClasses="font-JakartaBold text-black"
                    className="mt-10 bg-white min-w-[120px] rounded-md"
                />
            )}
        </View>
    );
};

export default Settings;
