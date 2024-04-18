'use client';
import { ModeToggle } from '@/components/mode-toggle';
import SideBar from './side-bar';
import { useState } from 'react';

import { useAppSelector, useAppDispatch } from '@/lib/store';
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

import { Avatar } from '@/components/ui/avatar';
import { setDeliveryList } from '@/lib/store/slices/delivery-slice';

export default function HeaderUserAccount() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const token = useAppSelector((state) => state.auth.accessToken);
    const profile = useAppSelector((state) => state.user.profile);
    const [loading, setLoading] = useState(false);

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
            return router.push('/login');
        }
    };

    return (
        <div className="bg-popover items-center justify-around flex font-medium p-2 md:p-0">
            {token ? (
                <NavigationMenu style={{ zIndex: 41 }}>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">
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
            <div>
                <Link href="#" className="hidden md:block py-2 px-4 ">
                    <ModeToggle />
                </Link>

                <SideBar token={token} />
            </div>
        </div>
    );
}
