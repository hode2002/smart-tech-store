import React, { useCallback, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useAuthStore, useNotificationStore } from '@/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import notificationApiRequest from '@/lib/apiRequest/notification';
import { router } from 'expo-router';
import NotificationList from '@/components/notification-list';

export default function Notification() {
    const { accessToken } = useAuthStore((state) => state);
    const { notifications, setNotifications } = useNotificationStore(
        (state) => state,
    );

    const handleReadAllNotify = useCallback(async () => {
        const response =
            await notificationApiRequest.userReadAllNotifications(accessToken);
        if (response?.statusCode === 200) {
            setNotifications(
                notifications.map((item) => ({ ...item, status: 1 })),
            );
        }
        return response;
    }, [accessToken, setNotifications]); //eslint-disable-line

    useEffect(() => {
        if (!accessToken) {
            return router.push('/(auth)/login');
        } else {
            handleReadAllNotify().then();
        }
    }, [accessToken, handleReadAllNotify]);

    return (
        <GestureHandlerRootView>
            <View className="relative h-screen bg-white">
                <ScrollView className="bg-white mb-[100px]">
                    {notifications && notifications?.length > 0 ? (
                        <NotificationList notifications={notifications} />
                    ) : (
                        <View className="h-24 justify-center items-center">
                            <Text>Không có thông báo</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
}
