'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { NotificationType } from '@/apiRequests/notification';
import NotificationItem from '@/components/notification-item';
import { useMemo } from 'react';

type Props = {
    notifications: NotificationType[];
};

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
        <div className="mb-4">
            <p className="px-3 py-1 bg-black text-white">{title}</p>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                />
            ))}
        </div>
    );

export default function NotificationList({ notifications }: Props) {
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
        <ul className="left-0 pt-0 w-[400px] lg:w-[500px] h-[450px]">
            <ScrollArea className="h-[450px]">
                {Object.entries(NOTIFICATION_GROUPS).map(([type, title]) => (
                    <NotificationGroup
                        key={type}
                        title={title}
                        notifications={groupedNotifications[type] || []}
                    />
                ))}
            </ScrollArea>
        </ul>
    );
}
