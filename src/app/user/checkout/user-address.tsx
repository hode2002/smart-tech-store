'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/lib/store';
import { CreditCard, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function UserAddress() {
    const [isClient, setIsClient] = useState(false);
    const profile = useAppSelector((state) => state.user.profile);
    const address = useAppSelector((state) => state.user.address);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div>
            <p className="font-bold text-[32px] flex gap-2 items-center">
                <CreditCard />
                <span>Thanh toán</span>
            </p>
            <div className="py-4">
                <div className="text-sm text-muted-foreground flex gap-2 items-center">
                    <MapPin />
                    <p>Địa Chỉ Nhận Hàng</p>
                </div>
                <div className="mt-2 md:mt-1 text-sm text-muted-foreground flex flex-col md:flex-row items-start md:items-center md:gap-4">
                    {isClient ? (
                        <>
                            <p className="font-bold whitespace-nowrap">
                                <span>
                                    {profile?.name
                                        ? profile.name
                                        : profile.email}
                                </span>
                                <span> {profile.phone}</span>
                            </p>
                            <p>
                                <span>{address.address}, </span>
                                <span>{address.ward}, </span>
                                <span>{address.district}, </span>
                                <span>{address.province}</span>
                                <Link
                                    href={'/user/account/address'}
                                    className="text-blue-700 underline font-semibold ml-3"
                                >
                                    Thay đổi
                                </Link>
                            </p>
                        </>
                    ) : (
                        <Skeleton className="w-[600px] h-4 rounded-xl" />
                    )}
                </div>
            </div>
        </div>
    );
}
