import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import Image from 'next/image';
import moment from 'moment';
import { Info, MessageCircle, ShoppingBag, TicketCheck } from 'lucide-react';
import Link from 'next/link';
import { NotificationType } from '@/apiRequests/notification';

const NotificationItem = ({
    notification,
}: {
    notification: NotificationType;
}) => {
    const iconByNotificationType = () => {
        switch (notification.type) {
            case 'ORDER':
                return <ShoppingBag width={40} height={40} />;
            case 'COMMENT':
                return <MessageCircle width={40} height={40} />;
            case 'COMMON':
                return <Info width={40} height={40} />;
            case 'VOUCHER':
                return <TicketCheck width={40} height={40} />;
        }
    };
    return (
        <li key={notification.id}>
            <NavigationMenuLink asChild>
                <div
                    className={`${
                        notification.status === 0 ? 'bg-accent' : ''
                    } block p-4 space-y-1 rounded-md leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`}
                >
                    <Link
                        href={notification.link}
                        className="flex gap-3 items-start capitalize"
                    >
                        <div>{iconByNotificationType()}</div>
                        <div className="items-start">
                            <p className="font-bold text-md leading-none">
                                {notification.title}
                            </p>
                            <p
                                className="text-sm my-2"
                                dangerouslySetInnerHTML={{
                                    __html: notification.content,
                                }}
                            ></p>
                            <p className="text-sm leading-none mb-2">
                                {moment(notification.created_at).format(
                                    'DD-MM-YYYY',
                                )}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {JSON.parse(notification?.images).map(
                                    (image: string, index: number) => (
                                        <Image
                                            key={index}
                                            src={image}
                                            alt=""
                                            width={80}
                                            height={80}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
            </NavigationMenuLink>
        </li>
    );
};

export default NotificationItem;
