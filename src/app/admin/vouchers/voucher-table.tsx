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
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
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
import voucherApiRequest, {
    UpdateVoucherBodyType,
    VoucherResponseType,
    VoucherType,
} from '@/apiRequests/voucher';
import { EditVoucherModal } from '@/app/admin/vouchers/edit-voucher-modal';

const VoucherTable = ({
    vouchers,
    setVouchers,
}: {
    vouchers: VoucherType[];
    setVouchers: Dispatch<SetStateAction<VoucherType[]>>;
}) => {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [filterVouchers, setFilterVouchers] = useState<VoucherType[]>([]);

    useEffect(() => {
        setFilterVouchers(vouchers);
    }, [vouchers]);

    const handleDeleteVoucher = async (voucher: VoucherType) => {
        const response = (await voucherApiRequest.delete(
            token,
            voucher.id,
        )) as VoucherResponseType;
        if (response?.statusCode === 200) {
            setFilterVouchers([
                ...filterVouchers.filter((item) => {
                    if (item.id === voucher.id) {
                        item.status = voucher.status === 0 ? 1 : 0;
                    }
                    return item;
                }),
            ]);
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
        }
    };

    const handleRestoreVoucher = async (voucher: VoucherType) => {
        const response = (await voucherApiRequest.restore(
            token,
            voucher.id,
        )) as VoucherResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
            setFilterVouchers([
                ...filterVouchers.filter((item) => {
                    if (item.id === voucher.id) {
                        item.status = voucher.status === 1 ? 0 : 1;
                    }
                    return item;
                }),
            ]);
        }
    };

    const [open, setOpen] = useState<boolean>(false);
    const handleEditVoucher = async (
        voucher: VoucherType,
        data: UpdateVoucherBodyType,
    ) => {
        setOpen(false);

        const response: VoucherResponseType = await voucherApiRequest.update(
            token,
            voucher.id,
            data,
        );

        if (response?.statusCode === 200) {
            const voucherUpdated = response.data;
            setVouchers([
                ...vouchers.map((item) => {
                    if (item.id === voucherUpdated.id) {
                        item = { ...voucherUpdated };
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
                    <TableHead className="table-cell">Code</TableHead>
                    <TableHead className="table-cell">Loại</TableHead>
                    <TableHead className="table-cell">Giá trị</TableHead>
                    <TableHead className="table-cell">Ngày áp dụng</TableHead>
                    <TableHead className="table-cell">Ngày hết hạn</TableHead>
                    <TableHead className="table-cell">
                        Số lượng còn lại
                    </TableHead>
                    <TableHead className="table-cell">
                        Đơn hàng tối thiểu
                    </TableHead>
                    <TableHead className="table-cell">Trạng thái</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vouchers &&
                    vouchers?.map((voucher) => {
                        return (
                            <TableRow key={voucher.id}>
                                <TableCell className="text-nowrap font-medium capitalize">
                                    {voucher.code}
                                </TableCell>
                                <TableCell className="text-nowrap">
                                    {voucher.type}
                                </TableCell>
                                <TableCell className="text-nowrap">
                                    {voucher.value}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {moment(voucher.start_date).format(
                                        'DD-MM-YYYY',
                                    )}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {moment(voucher.end_date).format(
                                        'DD-MM-YYYY',
                                    )}
                                </TableCell>
                                <TableCell className="text-nowrap">
                                    {voucher.available_quantity}
                                </TableCell>
                                <TableCell className="text-nowrap">
                                    {voucher.min_order_value}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {voucher.status === 1 ? (
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
                                            <EditVoucherModal
                                                voucher={voucher}
                                                open={open}
                                                setOpen={setOpen}
                                                handleEditVoucher={
                                                    handleEditVoucher
                                                }
                                            />
                                            <AlertDialog>
                                                {voucher.status === 1 ? (
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
                                                                    khôi phục mã
                                                                    giảm giá
                                                                    này?
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleRestoreVoucher(
                                                                            voucher,
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
                                                                    Xóa mã giảm
                                                                    giá này?
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDeleteVoucher(
                                                                            voucher,
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

export default VoucherTable;
