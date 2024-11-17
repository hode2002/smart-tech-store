'use client';

import { Bell } from 'lucide-react';
import SideBar from './side-bar';
import { useEffect, useState } from 'react';
import {
    userLogout,
    removeUserProfile,
    setBrands,
    setCategories,
} from '@/lib/store/slices';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import authApiRequest from '@/apiRequests/auth';
import { LogoutResponseType } from '@/schemaValidations/auth.schema';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { setDeliveryList } from '@/lib/store/slices/delivery-slice';
import { setNotificationList } from '@/lib/store/slices/notification-slice';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import NotificationList from '@/components/notification-list';
import notificationApiRequest, {
    GetUserNotificationResponseType,
} from '@/apiRequests/notification';

export default function HeaderUserAccount() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const token = useAppSelector((state) => state.auth.accessToken);
    const profile = useAppSelector((state) => state.user.profile);
    const cartProducts = useAppSelector((state) => state.user.cart);
    const notificationList = useAppSelector(
        (state) => state.notifications.notificationList,
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            notificationApiRequest
                .getUserNotification(token)
                .then((response: GetUserNotificationResponseType) =>
                    dispatch(
                        setNotificationList(
                            response?.data?.map((i) => ({
                                ...i.notification,
                                status: i.status,
                            })),
                        ),
                    ),
                );
        }
    }, [dispatch, token]);

    const handleReadAllNotify = async () => {
        const response =
            await notificationApiRequest.userReadAllNotifications(token);
        if (response?.statusCode === 200) {
            dispatch(
                setNotificationList(
                    notificationList.map((item) => ({ ...item, status: 1 })),
                ),
            );
        }
    };

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);
        const response: LogoutResponseType = await authApiRequest.logout(token);
        setLoading(false);
        if (response.statusCode === 200) {
            dispatch(userLogout());
            dispatch(removeUserProfile());
            dispatch(setDeliveryList([]));
            dispatch(setCategories([]));
            dispatch(setBrands([]));
            dispatch(setNotificationList([]));
            return router.push('/login');
        }
    };

    return (
        <div className="bg-popover items-center justify-around flex font-medium p-2 md:p-0">
            <div className="md:hidden px-4 dark:bg-popover">
                <div className="relative flex justify-center items-center">
                    <div className="absolute left-5 bottom-4">
                        <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-popover dark:text-popover-foreground">
                            {cartProducts?.length ?? 0}
                        </p>
                    </div>
                    <Link href={'/user/cart'}>
                        <ShoppingCart width={'35px'} height={'35px'} />
                    </Link>
                </div>
            </div>
            <div>
                <div className="hidden md:block">
                    <div className="w-0 md:w-[25%] hidden md:flex">
                        <NavigationMenu className="z-50">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="flex justify-center items-center">
                                        <div className="dark:bg-popover flex justify-center items-center">
                                            <div className="relative">
                                                {notificationList &&
                                                    notificationList?.length >
                                                        0 &&
                                                    notificationList?.filter(
                                                        (item) =>
                                                            item.status !== 1,
                                                    )?.length > 0 && (
                                                        <div className="absolute left-5 bottom-4">
                                                            <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                                                                {
                                                                    notificationList?.filter(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            !item.status,
                                                                    )?.length
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                <Link
                                                    href="#"
                                                    className="flex text-sm gap-4 p-2 justify-center items-center"
                                                >
                                                    <Bell />
                                                    Thông báo
                                                </Link>
                                            </div>
                                        </div>
                                    </NavigationMenuTrigger>
                                    {notificationList &&
                                    notificationList.length > 0 ? (
                                        <NavigationMenuContent>
                                            <>
                                                <div className="flex justify-end p-2">
                                                    <Button
                                                        onClick={
                                                            handleReadAllNotify
                                                        }
                                                        variant={'link'}
                                                        className="text-md"
                                                    >
                                                        Đánh dấu đã đọc
                                                    </Button>
                                                </div>
                                                <NotificationList
                                                    notifications={
                                                        notificationList
                                                    }
                                                />
                                            </>
                                        </NavigationMenuContent>
                                    ) : (
                                        <NavigationMenuContent>
                                            <div className="p-4 w-[400px] lg:w-[500px] h-[400px] flex justify-center items-center">
                                                <p>Chưa có thông báo</p>
                                            </div>
                                        </NavigationMenuContent>
                                    )}
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                <SideBar handleLogout={handleLogout} />
            </div>

            {token ? (
                <NavigationMenu style={{ zIndex: 41 }}>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent flex items-center">
                                <div className="flex flex-col md:flex-row pr-1 md:gap-2">
                                    <Link href="/user/account/profile">
                                        <Avatar>
                                            <Image
                                                className="w-[36px] h-[36px] rounded-[50%]"
                                                width={36}
                                                height={36}
                                                src={profile?.avatar}
                                                alt="Avatar"
                                            />
                                        </Avatar>
                                    </Link>
                                    <Link
                                        href="/user/account/profile"
                                        className="hidden md:block py-2"
                                    >
                                        <p>{profile?.email}</p>
                                    </Link>
                                </div>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="left-0 p-4">
                                    {profile && profile?.role === 'ADMIN' && (
                                        <div>
                                            <NavigationMenuLink asChild>
                                                <Link href={'/admin/dashboard'}>
                                                    <Button
                                                        className="w-full"
                                                        variant={'ghost'}
                                                    >
                                                        <span className="text-popover-foreground">
                                                            Admin Dashboard
                                                        </span>
                                                    </Button>
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                    )}
                                    <div>
                                        <NavigationMenuLink asChild>
                                            <Button
                                                className="w-full"
                                                variant={'ghost'}
                                            >
                                                <Link
                                                    href={
                                                        '/user/account/profile'
                                                    }
                                                >
                                                    <span className="text-popover-foreground">
                                                        Thông tin tài khoản
                                                    </span>
                                                </Link>
                                            </Button>
                                        </NavigationMenuLink>
                                    </div>
                                    <div>
                                        <NavigationMenuLink asChild>
                                            <Button
                                                className="w-full"
                                                variant={'ghost'}
                                            >
                                                <Link href={'/user/purchase'}>
                                                    <span className="text-popover-foreground">
                                                        Đơn mua
                                                    </span>
                                                </Link>
                                            </Button>
                                        </NavigationMenuLink>
                                    </div>
                                    <div>
                                        <NavigationMenuLink asChild>
                                            {loading ? (
                                                <Button
                                                    disabled
                                                    className="w-full"
                                                >
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full"
                                                    variant={'ghost'}
                                                    onClick={handleLogout}
                                                >
                                                    Đăng xuất
                                                </Button>
                                            )}
                                        </NavigationMenuLink>
                                    </div>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            ) : (
                <>
                    <div>
                        <Link
                            href="/register"
                            className="hidden md:block py-2 px-4 "
                        >
                            Đăng ký
                        </Link>
                    </div>
                    <div>
                        <Link
                            href="/login"
                            className="hidden md:block py-2 px-4 "
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
