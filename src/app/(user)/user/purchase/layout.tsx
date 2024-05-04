'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentPath = usePathname();
    const isActive = (path: string) => currentPath.includes(path);
    const router = useRouter();

    const profile = useAppSelector((state) => state.user.profile);
    const token = useAppSelector((state) => state.auth.accessToken);

    const [isCLient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!token) {
            toast({
                description: 'Vui lòng đăng nhập để tiếp tục',
                variant: 'default',
            });
            router.push('/login');
        }
    }, []); //eslint-disable-line

    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[250px_1fr]">
                    <nav className="grid gap-2 text-sm text-muted-foreground">
                        <div className="mx-auto grid w-full max-w-6xl gap-2">
                            {isCLient ? (
                                <div className="flex items-center gap-2 py-2 pr-4 pl-3 text-gray-700 text-[14px] md:text-[16px] hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                                    <Avatar>
                                        <AvatarImage
                                            width={50}
                                            height={50}
                                            src={profile?.avatar}
                                        />
                                        <AvatarFallback>avatar</AvatarFallback>
                                    </Avatar>
                                    <p className="font-bold truncate w-[50%]">
                                        {profile.email}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/user/account/profile"
                            className={`${isActive('/user/account/profile') ? 'font-semibold text-primary' : ''}`}
                        >
                            Thông tin tài khoản
                        </Link>
                        <Link href="/user/account/profile" className="ms-5">
                            Hồ sơ
                        </Link>
                        <Link href="/user/account/address" className="ms-5">
                            Địa chỉ
                        </Link>
                        <Link href="/user/account/password" className="ms-5">
                            Đổi mật khẩu
                        </Link>
                        <Link
                            href="/user/purchase"
                            className={`${isActive('/user/purchase') ? 'font-semibold text-primary' : ''}`}
                        >
                            Đơn mua
                        </Link>
                    </nav>
                    {children}
                </div>
            </div>
        </div>
    );
}
