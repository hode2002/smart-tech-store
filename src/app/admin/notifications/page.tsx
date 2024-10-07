'use client';

import { PlusCircle, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useAppSelector } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import notificationApiRequest, {
    CreateNotificationBodyType,
    GetAllNotificationResponseType,
    NotificationResponseType,
    NotificationType,
} from '@/apiRequests/notification';
import NotificationTable from '@/app/admin/notifications/notification-table';
import { AddNotificationModal } from '@/app/admin/notifications/add-notification-modal';

const NotificationPage = () => {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [filterNotifications, setFilterNotifications] = useState<
        NotificationType[]
    >([]);

    useEffect(() => {
        (async () => {
            const response = (await notificationApiRequest.getAll(
                token,
            )) as GetAllNotificationResponseType;
            if (response?.statusCode === 200) {
                setNotifications(response.data);
                setFilterNotifications(response.data);
            }
        })();
    }, [token]);

    const handleAddNotification = async (data: CreateNotificationBodyType) => {
        const response: NotificationResponseType =
            await notificationApiRequest.create(token, data);

        if (response?.statusCode === 201) {
            setNotifications((prev) => [...prev, response.data]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        if (searchText) {
            setFilterNotifications(
                notifications.filter((item) =>
                    item.title.toLowerCase().includes(searchText.toLowerCase()),
                ),
            );
        } else {
            setFilterNotifications(notifications);
        }
    }, [notifications, setFilterNotifications, searchText]);

    return (
        <Tabs
            defaultValue="all"
            className="flex flex-col gap-4 px-6 bg-muted/40 p-4"
        >
            <div className="flex items-center w-full md:justify-end">
                <div className="flex items-center w-full justify-between">
                    <div className="relative md:ml-auto md:grow-0 flex gap-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            type="text"
                            placeholder="Tìm kiếm"
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        />
                    </div>
                    <Button
                        size="sm"
                        className="h-7 py-4 flex items-center gap-2 ms-4"
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <div className="whitespace-nowrap">
                            <AddNotificationModal
                                handleAddNotification={handleAddNotification}
                            />
                        </div>
                    </Button>
                </div>
            </div>
            <ScrollArea>
                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách thông báo</CardTitle>
                            <CardDescription>
                                Tạo mới và quản lý thông báo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NotificationTable
                                notifications={filterNotifications}
                                setNotifications={setNotifications}
                            />
                            <ScrollBar orientation="horizontal" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </ScrollArea>
        </Tabs>
    );
};

export default NotificationPage;
