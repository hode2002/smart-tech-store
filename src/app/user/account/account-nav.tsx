'use client';

import Link from 'next/link';
import { Avatar } from '@radix-ui/react-avatar';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '@/lib/store';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountNav() {
    const router = useRouter();
    const profile = useAppSelector((state) => state.user.profile);
    const token = useAppSelector((state) => state.auth.accessToken);

    const currentPath = usePathname();
    const isActive = (path: string) => currentPath.includes(path);
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
        <nav className="grid gap-2 text-sm text-muted-foreground">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                {isCLient ? (
                    <div className="flex items-center gap-2 py-2 pr-4 pl-3 text-gray-700 text-[14px] md:text-[16px] hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                        <Avatar>
                            <Image
                                className="w-[50px] h-[50px] rounded-[50%]"
                                width={50}
                                height={50}
                                src={profile?.avatar}
                                alt="Avatar"
                            />
                        </Avatar>

                        <p className="font-bold">{profile.email}</p>
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
            <Link
                href="/user/account/profile"
                className={`ms-5 ${isActive('/user/account/profile') ? 'font-semibold text-primary' : ''}`}
            >
                Hồ sơ
            </Link>
            <Link
                href="/user/account/address"
                className={`ms-5 ${isActive('/user/account/address') ? 'font-semibold text-primary' : ''}`}
            >
                Địa chỉ
            </Link>
            <Link
                href="/user/account/password"
                className={`ms-5 ${isActive('/user/account/password') ? 'font-semibold text-primary' : ''}`}
            >
                Đổi mật khẩu
            </Link>
            <Link href="/user/purchase">Đơn mua</Link>
        </nav>
    );
}
