import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';

import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { useAppSelector } from '@/lib/store';
import { usePathname } from 'next/navigation';

type Props = {
    handleLogout: () => Promise<void>;
};
export default function SideBar(props: Props) {
    const { handleLogout } = props;
    const profile = useAppSelector((state) => state.user.profile);

    const currentPath = usePathname();
    const isActive = (path: string) => currentPath.includes(path);

    return (
        <Sheet>
            <SheetTrigger asChild className="block md:hidden">
                <Button
                    variant="outline"
                    className="flex justify-center items-center"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <div className="flex w-[65%] justify-between">
                        <ModeToggle />

                        <Link
                            href="/"
                            className="flex justify-center items-center space-x-3"
                        >
                            <Image
                                priority
                                src={'/images/site-logo.png'}
                                width={50}
                                height={50}
                                className="h-auto w-auto rounded-[50%]"
                                alt="Store"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Store
                            </span>
                        </Link>
                    </div>

                    <div
                        className={`bg-popover flex items-center font-medium p-2 md:p-0 w-full ${profile?.email ? 'justify-start' : 'justify-around'}`}
                    >
                        {profile?.email ? (
                            <div className="flex flex-col">
                                <Link
                                    href="/user/account/profile"
                                    className="flex items-center gap-4"
                                >
                                    <Avatar>
                                        <Image
                                            className="w-[36px] h-[36px] rounded-[50%]"
                                            width={36}
                                            height={36}
                                            src={profile.avatar}
                                            alt="Avatar"
                                        />
                                    </Avatar>

                                    <p className="truncate w-[65%]">
                                        {profile.email}
                                    </p>
                                </Link>
                                <div className="flex flex-col items-start py-2">
                                    {profile?.role === 'ADMIN' && (
                                        <div>
                                            <SheetClose asChild>
                                                <Link href={'/admin/dashboard'}>
                                                    <Button
                                                        type="submit"
                                                        className="w-full"
                                                        variant={'ghost'}
                                                    >
                                                        <span
                                                            className={`${isActive('/admin/dashboard') ? 'font-semibold text-primary' : 'text-popover-foreground'}`}
                                                        >
                                                            Admin Dashboard
                                                        </span>
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    )}
                                    <SheetClose asChild>
                                        <Button asChild variant={'ghost'}>
                                            <Link
                                                href={'/user/account/profile'}
                                            >
                                                <span
                                                    className={`${isActive('/user/account/profile') ? 'font-bold text-black' : 'text-popover-foreground'}`}
                                                >
                                                    Thông tin tài khoản
                                                </span>
                                            </Link>
                                        </Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button asChild variant={'ghost'}>
                                            <Link href={'/user/purchase'}>
                                                <span
                                                    className={`${isActive('/user/purchase') ? 'font-bold text-black' : 'text-popover-foreground'}`}
                                                >
                                                    Đơn mua
                                                </span>
                                            </Link>
                                        </Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button
                                            variant={'ghost'}
                                            onClick={handleLogout}
                                            className="text-popover-foreground"
                                        >
                                            Đăng xuất
                                        </Button>
                                    </SheetClose>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <Link
                                        href="/register"
                                        className="py-2 px-4 "
                                    >
                                        <Button variant={'outline'}>
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/login" className="py-2 px-4 ">
                                        <Button variant={'outline'}>
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
