import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { Brand } from '@/lib/store/slices';
import { Badge } from '@/components/ui/badge';
import { EditBrandModal } from './edit-brand-modal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAppSelector } from '@/lib/store';
import adminApiRequest, {
    RemoveBrandResponseType,
    RestoreBrandResponseType,
    UpdateBrandResponseType,
} from '@/apiRequests/admin';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

type Props = {
    brands: Brand[];
};

const BrandTable = (props: Props) => {
    const { brands } = props;

    const [filterBrand, setFilterBrand] = useState<Brand[]>([]);
    const token = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        setFilterBrand(brands);
    }, [brands]);

    const handleRemoveBrand = async (brand: Brand) => {
        const response = (await adminApiRequest.removeBrand(
            token,
            brand.id,
        )) as RemoveBrandResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
            setFilterBrand([
                ...filterBrand.filter((item) => {
                    if (item.id === brand.id) {
                        item.is_deleted = !brand.is_deleted;
                    }
                    return item;
                }),
                // ...filterBrand.filter((item) => item.id !== brand.id),
                // brands.find((item) => item.id === brand.id)?.is_deleted = !brand.is_deleted,
            ]);
        }
    };

    const handleRestoreBrand = async (brand: Brand) => {
        const response = (await adminApiRequest.restoreBrand(
            token,
            brand.id,
        )) as RestoreBrandResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
            setFilterBrand([
                ...filterBrand.filter((item) => {
                    if (item.id === brand.id) {
                        item.is_deleted = !brand.is_deleted;
                    }
                    return item;
                }),
                // ...filterBrand.filter((item) => item.id !== brand.id),
                // brands.find((item) => item.id === brand.id)?.is_deleted = !brand.is_deleted,
            ]);
        }
    };

    const [open, setOpen] = useState<boolean>(false);
    const handleEditBrand = async (
        brand: Brand,
        description?: string,
        file?: File | undefined,
    ) => {
        setOpen(false);

        const response: UpdateBrandResponseType =
            await adminApiRequest.updateBrand(token, brand.id, {
                description,
                logo_url: file,
            });

        if (response?.statusCode === 200) {
            const brandUpdated = response.data;
            setFilterBrand([
                ...brands.map((item) => {
                    if (item.id === brandUpdated.id) {
                        item.description = brandUpdated.description;
                        return item;
                    }
                    return item;
                }),
            ]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="table-cell w-[200px]">Logo</TableHead>
                    <TableHead className="table-cell">Tên</TableHead>
                    <TableHead className="table-cell">Mô tả</TableHead>
                    <TableHead className="table-cell">Trạng thái</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Ngày tạo
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filterBrand &&
                    filterBrand?.map((brand) => {
                        return (
                            <TableRow key={brand.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt={brand.name}
                                        height="64"
                                        src={brand.logo_url}
                                        width="100"
                                    />
                                </TableCell>
                                <TableCell className="font-medium capitalize">
                                    {brand.name}
                                </TableCell>
                                <TableCell>
                                    {brand.description ?? '--'}
                                </TableCell>
                                <TableCell>
                                    {brand.is_deleted ? (
                                        <Badge variant="destructive">
                                            Đã xóa
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            Đang hoạt động
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {moment(brand.created_at).format(
                                        'DD-MM-YYYY',
                                    )}
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
                                            <EditBrandModal
                                                brand={brand}
                                                open={open}
                                                setOpen={setOpen}
                                                handleEditBrand={
                                                    handleEditBrand
                                                }
                                            />
                                            <AlertDialog>
                                                {brand.is_deleted ? (
                                                    <>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="flex justify-start px-2 w-full"
                                                            >
                                                                Khôi phục
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Chắc chắn
                                                                    khôi phục
                                                                    thương hiệu
                                                                    này?
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleRestoreBrand(
                                                                            brand,
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
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
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
                                                                    Xóa thương
                                                                    hiệu này?
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleRemoveBrand(
                                                                            brand,
                                                                        )
                                                                    }
                                                                >
                                                                    Xác nhận
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </>
                                                )}
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};

export default BrandTable;
