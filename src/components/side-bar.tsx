import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';

import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';

export default function SideBar({ token }: { token: string }) {
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
                                src={'/images/site-logo.png'}
                                width={50}
                                height={50}
                                className="h-8"
                                alt="Store"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Store
                            </span>
                        </Link>
                    </div>

                    <div className="flex my-3">
                        <ul
                            className={`bg-popover flex items-center font-medium p-2 md:p-0 w-full my-2 ${token ? 'justify-start' : 'justify-around'}`}
                        >
                            {token ? (
                                <li>
                                    <Link
                                        href="/user/account/profile"
                                        className="flex items-center gap-4"
                                    >
                                        <Avatar>
                                            <Image
                                                height={40}
                                                width={40}
                                                alt="avatar"
                                                src="https://ct466-project.s3.ap-southeast-2.amazonaws.com/default.jpg"
                                            />
                                        </Avatar>

                                        <p>54dhvd@gmail.com</p>
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href="/register"
                                            className="py-2 px-4 "
                                        >
                                            <Button variant={'outline'}>
                                                Đăng ký
                                            </Button>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/login"
                                            className="py-2 px-4 "
                                        >
                                            <Button variant={'outline'}>
                                                Đăng nhập
                                            </Button>
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link
                                    href="#"
                                    className="hidden md:block py-2 px-4 "
                                >
                                    <ModeToggle />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
