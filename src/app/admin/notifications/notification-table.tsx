import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
import notificationApiRequest, {
    NotificationResponseType,
    NotificationType,
    UpdateNotificationBodyType,
} from '@/apiRequests/notification';
import { EditNotificationModal } from '@/app/admin/notifications/edit-notification-modal';
import Image from 'next/image';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const NotificationTable = ({
    notifications,
    setNotifications,
}: {
    notifications: NotificationType[];
    setNotifications: Dispatch<SetStateAction<NotificationType[]>>;
}) => {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [open, setOpen] = useState<boolean>(false);

    const [filterNotifications, setFilterNotifications] = useState<
        NotificationType[]
    >([]);

    useEffect(() => {
        setFilterNotifications(notifications);
    }, [notifications]);

    const handleEditNotification = async (
        notification: NotificationType,
        data: UpdateNotificationBodyType,
    ) => {
        setOpen(false);

        const response: NotificationResponseType =
            await notificationApiRequest.update(token, notification.id, data);

        if (response?.statusCode === 200) {
            const notificationUpdated = response.data;
            setNotifications([
                ...notifications.map((item) => {
                    if (item.id === notificationUpdated.id) {
                        item = { ...notificationUpdated };
                        return item;
                    }
                    return item;
                }),
            ]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const handleDeleteNotification = async (notification: NotificationType) => {
        const response = (await notificationApiRequest.delete(
            token,
            notification.id,
        )) as NotificationResponseType;
        if (response?.statusCode === 200) {
            setFilterNotifications([
                ...filterNotifications.filter(
                    (item) => item.id !== notification.id,
                ),
            ]);
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="table-cell">Tiêu đề</TableHead>
                    <TableHead className="table-cell">Nội dung</TableHead>
                    <TableHead className="table-cell">Hình ảnh</TableHead>
                    <TableHead className="table-cell px-2">Loại</TableHead>
                    <TableHead className="table-cell">link</TableHead>
                    <TableHead className="table-cell">Ngày tạo</TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Ngày cập nhật
                    </TableHead>
                    <TableHead className="table-cell">Trạng thái</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {notifications &&
                    notifications?.map((notification) => {
                        return (
                            <TableRow key={notification.id}>
                                <TableCell className="text-nowrap max-w-[200px] truncate font-medium capitalize">
                                    {notification.title}
                                </TableCell>
                                <TableCell>
                                    <div
                                        className="text-nowrap max-w-[350px] truncate"
                                        dangerouslySetInnerHTML={{
                                            __html: notification.content,
                                        }}
                                    ></div>
                                </TableCell>
                                <TableCell className="text-nowrap max-w-[350px] truncate">
                                    <div className="w-[90%] flex gap-2">
                                        {(
                                            JSON.parse(
                                                notification.images,
                                            ) as string[]
                                        )?.map((image, index) => (
                                            <Image
                                                key={index}
                                                alt="Product image"
                                                height={80}
                                                width={80}
                                                src={image}
                                            />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-nowrap px-2">
                                    {notification.type}
                                </TableCell>
                                <TableCell className="text-nowrap px-2">
                                    {notification.link}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {moment(notification.created_at).format(
                                        'DD-MM-YYYY',
                                    )}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {moment(notification.updated_at).format(
                                        'DD-MM-YYYY',
                                    )}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {notification.status === 1 ? (
                                        <Badge variant="destructive">
                                            Đã xóa
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            Đang hoạt động
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Toggle menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Thao tác
                                            </DropdownMenuLabel>
                                            <EditNotificationModal
                                                notification={notification}
                                                open={open}
                                                setOpen={setOpen}
                                                handleEditNotification={
                                                    handleEditNotification
                                                }
                                            />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="flex justify-start px-2 w-full"
                                                    >
                                                        Xóa
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Xóa mã giảm giá này?
                                                        </AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Hủy
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDeleteNotification(
                                                                    notification,
                                                                )
                                                            }
                                                        >
                                                            Xác nhận
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};

export default NotificationTable;
