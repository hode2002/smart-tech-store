import React from 'react';
import NotificationItem from '@/components/notification-item';
import { ScrollView } from 'react-native';
import { NotificationType } from '@/lib/apiRequest/notification';

type Props = {
    notifications: NotificationType[];
};

export default function NotificationList(props: Props) {
    const { notifications } = props;

    return (
        <ScrollView>
            {notifications.map((notification) => {
                return (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                );
            })}
        </ScrollView>
    );
}
