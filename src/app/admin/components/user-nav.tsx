'use client';

import authApiRequest from '@/apiRequests/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
    removeUserProfile,
    setBrands,
    setCategories,
    userLogout,
} from '@/lib/store/slices';
import { setDeliveryList } from '@/lib/store/slices/delivery-slice';
import { LogoutResponseType } from '@/schemaValidations/auth.schema';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function UserNav() {
    const [isCLient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

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

    return isCLient ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={profile?.avatar}
                            alt={profile.email}
                        />
                        <AvatarFallback>{profile.email}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {profile?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {profile.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/'}>Chuyển sang trang chủ</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
        </div>
    );
}
