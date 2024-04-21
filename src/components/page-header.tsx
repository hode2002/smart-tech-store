import Navbar from '@/components/navbar';
import Link from 'next/link';
import { Bell, CircleHelp } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const HeaderUserAccount = dynamic(
    () => import('@/components/header-user-account'),
    { ssr: false },
);

export function PageHeader() {
    return (
        <>
            <header className="py-1 border-b min-w-[400px]">
                <div className="bg-popover max-w-screen-xl flex items-center justify-between mx-auto">
                    <ul className="bg-popover items-center justify-around flex font-medium p-2 md:p-0">
                        <Link
                            className="block md:hidden space-x-3 pr-2"
                            href="/"
                        >
                            <Image
                                src={'/images/site-logo.png'}
                                width={50}
                                height={50}
                                className="h-8"
                                alt="Store"
                            />
                        </Link>
                        <li>
                            <Link href="#" className="flex text-sm gap-2 p-2">
                                <Bell />
                                Thông báo
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex text-sm gap-2 p-2">
                                <CircleHelp />
                                Hỗ trợ
                            </Link>
                        </li>
                    </ul>

                    <HeaderUserAccount />
                </div>
            </header>
            <Navbar />
        </>
    );
}