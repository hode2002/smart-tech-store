'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import moment from 'moment';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import adminApiRequest, {
    BannersResponseType,
    DeleteBannerResponseType,
    UpdateBannerResponseType,
} from '@/apiRequests/admin';
import { useEffect, useState } from 'react';
import { EditBannerModal } from './edit-banner-modal';
import { useAppSelector } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
import { ScrollBar } from '@/components/ui/scroll-area';

type Props = {
    status: string;
    banners: BannersResponseType[];
};

const TableBanners = (props: Props) => {
    const token = useAppSelector((state) => state.auth.accessToken);

    const { status, banners } = props;

    const [filterBanners, setFilterBanners] = useState<BannersResponseType[]>(
        [],
    );

    useEffect(() => {
        if (status === 'all') {
            setFilterBanners(banners);
        } else {
            setFilterBanners(
                banners?.filter((banner) => banner.status === status),
            );
        }
    }, [banners, setFilterBanners, status]);

    const handleDeleteBanner = async (bannerId: string) => {
        const response = (await adminApiRequest.deleteBanner(
            token,
            bannerId,
        )) as DeleteBannerResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
        }
    };

    const handleUpdateBanner = async (
        banner: BannersResponseType,
        status?: string,
        image?: File,
        link?: string,
        type?: string,
    ) => {
        const response: UpdateBannerResponseType =
            await adminApiRequest.updateBanner(token, banner.id, {
                status,
                image,
                link,
                type,
            });

        if (response?.statusCode === 200) {
            setFilterBanners([
                ...filterBanners.map((banner) => {
                    if (banner.id === response.data.id) {
                        banner = response.data;
                    }
                    return banner;
                }),
            ]);

            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    return filterBanners && filterBanners?.length > 0 ? (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="table-cell">
                        <span className="not-sr-only md:sr-only text-nowrap">
                            Hình ảnh
                        </span>
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Tiêu đề
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Link
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Type
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Trạng thái
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Created at
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filterBanners?.map((banner) => {
                    return (
                        <TableRow key={banner.id}>
                            <TableCell className="table-cell">
                                <Image
                                    alt="Banner image"
                                    className="aspect-square rounded-md object-cover"
                                    height="300"
                                    src={banner.image}
                                    width="300"
                                />
                            </TableCell>
                            <TableCell className="font-medium text-nowrap">
                                {banner.title}
                            </TableCell>
                            <TableCell className="font-medium text-nowrap">
                                {banner?.link}
                            </TableCell>
                            <TableCell className="font-medium text-nowrap">
                                {banner?.type}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        banner.status === 'show'
                                            ? 'outline'
                                            : 'destructive'
                                    }
                                >
                                    {banner.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="table-cell text-nowrap">
                                {moment(banner.created_at).format('DD-MM-YYYY')}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                                Toggle menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Thao tác
                                        </DropdownMenuLabel>
                                        <EditBannerModal
                                            banner={banner}
                                            handleUpdateBanner={
                                                handleUpdateBanner
                                            }
                                        />
                                        <AlertDialog>
                                            {banner.status === 'show' ? (
                                                <>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="flex justify-start px-2 w-full"
                                                        >
                                                            Ẩn hình ảnh
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Chắc chắn ẩn
                                                                hình ảnh này
                                                                khỏi trang chủ?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Sau khi ẩn, hình
                                                                ảnh sẽ không
                                                                được hiển thị ở
                                                                trang chủ khi có
                                                                người dùng truy
                                                                cập
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Hủy
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleUpdateBanner(
                                                                        banner,
                                                                        'hide',
                                                                    )
                                                                }
                                                            >
                                                                Xác nhận
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        className="flex justify-start px-2 w-full"
                                                        onClick={() =>
                                                            handleUpdateBanner(
                                                                banner,
                                                                'show',
                                                            )
                                                        }
                                                    >
                                                        Hiển thị
                                                    </Button>
                                                </>
                                            )}
                                        </AlertDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="flex justify-start px-2 w-full"
                                                >
                                                    Xóa
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Xóa vĩnh viễn?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Ảnh sẽ được xóa khỏi cơ
                                                        sở dữ liệu.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteBanner(
                                                                banner.id,
                                                            )
                                                        }
                                                    >
                                                        Xác nhận
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <ScrollBar orientation="horizontal" />
        </Table>
    ) : (
        <p className="text-center">Không tìm thấy</p>
    );
};

export default TableBanners;
