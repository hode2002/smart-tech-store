'use client';

import { ListFilter, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useAppSelector } from '@/lib/store';
import adminApiRequest, {
    ActiveUserResponseType,
    FetchAllUsersResponseType,
    UserResponseType,
} from '@/apiRequests/admin';
import { useCallback, useEffect, useState } from 'react';
import TableCustomers from '@/app/admin/customers/table-customer';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Customer() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [users, setUsers] = useState<UserResponseType[]>([]);
    const [filterUsers, setFilterUsers] = useState<UserResponseType[]>([]);
    const [status, setStatus] = useState<string>('all');

    const fetchUsers = useCallback(async () => {
        const response = (await adminApiRequest.getAllUsers(
            token,
        )) as FetchAllUsersResponseType;
        if (response?.statusCode === 200) {
            return response.data;
        }
        return [];
    }, [token]);

    useEffect(() => {
        fetchUsers().then((users) => {
            setUsers(users);
            setFilterUsers(users);
        });
    }, [fetchUsers, status]);

    const handleActiveUser = async (
        user: UserResponseType,
        isActive: boolean = true,
    ) => {
        const response = (await adminApiRequest.handleActiveUser(token, {
            email: user.email,
            is_active: isActive,
        })) as ActiveUserResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });

            setUsers([
                ...users.filter((user) => {
                    if (user.email === response.data.email) {
                        user.is_active = response.data.is_active;
                    }
                    return user;
                }),
            ]);
        }
    };

    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        if (searchText) {
            setFilterUsers(
                users.filter((user) => user.phone + ''.includes(searchText)),
            );
        } else {
            setFilterUsers(users);
        }
    }, [users, setFilterUsers, searchText]);

    return (
        <Tabs
            defaultValue="all"
            className="flex flex-col gap-4 px-6 bg-muted/40 p-4"
        >
            <div className="flex items-center md:justify-end">
                <div className="flex items-center w-full justify-between">
                    <div className="relative md:ml-auto md:grow-0 flex gap-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            type="text"
                            placeholder="Nhập số điện thoại để tìm khách hàng"
                            className="w-full rounded-lg bg-background pl-8 min-w-[300px] lg:w-[320px]"
                        />
                    </div>
                    <div className="flex items-center gap-2 md:ms-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 gap-1 text-sm py-4"
                                >
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span>Lọc</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    Trạng thái
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus('all')}
                                    checked={status === 'all'}
                                >
                                    Tất cả
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus('active')}
                                    checked={status === 'active'}
                                >
                                    Đã kích hoạt
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus('inactive')}
                                    checked={status === 'inactive'}
                                >
                                    Chưa kích hoạt
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <ScrollArea>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách khách hàng</CardTitle>
                            <CardDescription>
                                Xem thông tin và quản lý khách hàng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TableCustomers
                                status={status}
                                users={filterUsers}
                                handleActiveUser={handleActiveUser}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </ScrollArea>
        </Tabs>
    );
}
