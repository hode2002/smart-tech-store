import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { NotificationType } from '@/apiRequests/notification';
import NotificationItem from '@/components/notification-item';

type Props = {
    notifications: NotificationType[];
};

export default function NotificationList(props: Props) {
    const { notifications } = props;

    return (
        <ul className="left-0 pt-0 w-[400px] lg:w-[500px] h-[450px]">
            <ScrollArea className="h-[400px]">
                {notifications.map((notification) => {
                    return (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    );
                })}
            </ScrollArea>
        </ul>
    );
}
