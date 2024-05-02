'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import moment from 'moment';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserResponseType } from '@/apiRequests/admin';
import { useEffect, useState } from 'react';

type Props = {
    status: string;
    users: UserResponseType[];
    handleActiveUser: (
        user: UserResponseType,
        isActive?: boolean,
    ) => Promise<void>;
};

const TableCustomers = (props: Props) => {
    const { status, users, handleActiveUser } = props;
    const [filterUsers, setFilterUsers] = useState<
        UserResponseType[] | undefined
    >(users);

    const convertStatus = (status: string) => {
        return status === 'active' ? true : false;
    };

    useEffect(() => {
        if (status === 'all') {
            setFilterUsers(users);
        } else {
            setFilterUsers(
                users?.filter(
                    (users) => users.is_active === convertStatus(status),
                ),
            );
        }
    }, [users, setFilterUsers, status]);

    return filterUsers && filterUsers?.length > 0 ? (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Created at
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filterUsers?.map((user) => {
                    return (
                        <TableRow key={user.email}>
                            <TableCell className="hidden sm:table-cell">
                                <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="40"
                                    src={user.avatar}
                                    width="40"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                {user.email}
                            </TableCell>
                            <TableCell className="font-medium">
                                {user?.name}
                            </TableCell>
                            <TableCell>{user?.phone}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                {user?.address &&
                                    Object.values(user?.address)
                                        .reverse()
                                        .join(', ')}
                            </TableCell>
                            <TableCell>
                                {user.is_active ? (
                                    <Badge variant="outline">Active</Badge>
                                ) : (
                                    <Badge variant="destructive">
                                        Inactive
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {moment(user.created_at).format('DD-MM-YYYY')}
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
                                        <DropdownMenuItem>
                                            Edit
                                        </DropdownMenuItem>
                                        <AlertDialog>
                                            {user.is_active ? (
                                                <>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="flex justify-start px-2 w-full"
                                                        >
                                                            Khóa tài khoản
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Chắc chắn khóa
                                                                tài khoản người
                                                                dùng này?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Sau khi khóa tài
                                                                khoản thì người
                                                                dùng không thể
                                                                đăng nhập vào hệ
                                                                thống.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Hủy
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleActiveUser(
                                                                        user,
                                                                        false,
                                                                    )
                                                                }
                                                            >
                                                                Xác nhận
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="flex justify-start px-2 w-full"
                                                        >
                                                            Kích hoạt
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Kích hoạt tài
                                                                khoản người dùng
                                                                này?
                                                            </AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Hủy
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleActiveUser(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                Xác nhận
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </>
                                            )}
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    ) : (
        <p className="text-center">Không tìm thấy</p>
    );
};

export default TableCustomers;
