'use client';

import {
    Smartphone,
    Laptop,
    TabletSmartphone,
    Headphones,
    Watch,
    ShoppingCart,
    LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { usePathname } from 'next/navigation';
import CartProductList from '@/components/cart-product-list';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';
import HeaderSearchBar from '@/components/header-search-bar';
import accountApiRequest from '@/apiRequests/account';
import { setCartProducts } from '@/lib/store/slices';

type NavItem = {
    name: string;
    link: string;
    icon: LucideIcon;
};

export default function Navbar() {
    const [isClient, setIsClient] = useState(false);

    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.accessToken);
    const cartProducts = useAppSelector((state) => state.user.cart);

    useEffect(() => {
        setIsClient(true);
        if (token && cartProducts.length < 1) {
            accountApiRequest.getProductsFromCart(token).then((response) => {
                if (response?.statusCode === 200) {
                    dispatch(setCartProducts(response?.data));
                }
            });
        }
    }, [cartProducts.length, dispatch, token]);

    const currentPath = usePathname();
    const isActive = (path: string) => currentPath.includes(path);

    const navItems: NavItem[] = [
        {
            name: 'Điện thoại',
            link: '/smartphone',
            icon: Smartphone,
        },
        {
            name: 'Laptop',
            link: '/laptop',
            icon: Laptop,
        },
        {
            name: 'Tablet',
            link: '/tablet',
            icon: TabletSmartphone,
        },
        {
            name: 'Phụ kiện',
            link: '/earphone',
            icon: Headphones,
        },
        {
            name: 'Đồng hồ',
            link: '/watch',
            icon: Watch,
        },
    ];

    return (
        <div className="sticky top-0 z-40 w-full min-w-[400px] border-b border-border bg-background">
            <div className="flex pt-2 items-center mx-auto max-w-screen-xl">
                <div className="hidden md:block w-[25%]">
                    <Link
                        className="flex items-center space-x-3 w-[50px] h-[50px]"
                        href="/"
                    >
                        <Image
                            src={'/images/site-logo.png'}
                            width={500}
                            height={500}
                            quality={100}
                            className="h-8"
                            alt="Store"
                        />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                            Store
                        </span>
                    </Link>
                </div>
                <div className="w-[75%]">
                    {isClient ? (
                        <HeaderSearchBar />
                    ) : (
                        <div className="flex items-center">
                            <Skeleton className="w-[90%] h-[42px] rounded-xl" />
                            <Skeleton className="w-[10%] h-[42px] rounded-xl" />
                        </div>
                    )}
                </div>
                <div className="w-[25%] flex justify-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                {isClient && (
                                    <NavigationMenuTrigger
                                        disabled={token ? false : true}
                                    >
                                        <Link href={'/user/cart'}>
                                            <ShoppingCart
                                                width={'35px'}
                                                height={'35px'}
                                            />
                                        </Link>
                                    </NavigationMenuTrigger>
                                )}
                                {cartProducts.length > 0 ? (
                                    <NavigationMenuContent>
                                        <CartProductList
                                            products={cartProducts}
                                        />
                                        <Link href={'/user/cart'}>
                                            <Button className="py-6 w-full">
                                                Xem giỏ hàng
                                            </Button>
                                        </Link>
                                    </NavigationMenuContent>
                                ) : (
                                    <NavigationMenuContent>
                                        <div className="p-4 w-[400px] lg:w-[500px] h-[400px] flex justify-center items-center">
                                            <p>Chưa Có Sản Phẩm</p>
                                        </div>
                                    </NavigationMenuContent>
                                )}
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            <div className="flex gap-4 flex-wrap justify-center items-center w-full">
                <div className="my-3">
                    <ul className="flex justify-around mt-4 font-medium lg:space-x-8 lg:mt-0">
                        {navItems.map((navItem) => (
                            <li key={navItem.name}>
                                <Link
                                    href={navItem.link}
                                    className={
                                        'flex text-[12px] md:text-[16px] items-center gap-2 py-2 px-4' +
                                        (isActive(`${navItem.link}`)
                                            ? 'text-popover-foreground font-extrabold'
                                            : 'text-popover-foreground opacity-60')
                                    }
                                >
                                    <span className="px-4 md:px-0">
                                        {<navItem.icon />}
                                    </span>
                                    <span className="hidden md:block">
                                        {navItem.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
