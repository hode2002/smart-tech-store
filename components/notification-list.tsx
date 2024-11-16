import React, { useMemo } from 'react';
import NotificationItem from '@/components/notification-item';
import { ScrollView, Text, View } from 'react-native';
import { NotificationType } from '@/lib/apiRequest/notification';

const NOTIFICATION_GROUPS: Record<string, string> = {
    VOUCHER: 'Mã giảm giá',
    ORDER: 'Thông báo đơn hàng',
    COMMON: 'Thông báo hệ thống',
    COMMENT: 'Bình luận',
};

const NotificationGroup = ({
    title,
    notifications,
}: {
    title: string;
    notifications: NotificationType[];
}) =>
    notifications &&
    notifications?.length > 0 && (
        <View className="mb-4">
            <Text className="px-3 py-1 bg-black text-white font-JakartaBold">
                {title}
            </Text>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                />
            ))}
        </View>
    );

export default function NotificationList({
    notifications,
}: {
    notifications: NotificationType[];
}) {
    const groupedNotifications = useMemo(() => {
        return notifications.reduce(
            (acc, notification) => {
                if (!acc[notification.type]) {
                    acc[notification.type] = [];
                }
                acc[notification.type].push(notification);
                return acc;
            },
            {} as Record<string, NotificationType[]>,
        );
    }, [notifications]);

    return (
        <ScrollView>
            {Object.entries(NOTIFICATION_GROUPS).map(([type, title]) => (
                <NotificationGroup
                    key={type}
                    title={title}
                    notifications={groupedNotifications[type] || []}
                />
            ))}
        </ScrollView>
    );
}
