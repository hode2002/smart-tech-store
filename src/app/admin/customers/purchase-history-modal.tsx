'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderResponseType } from '@/apiRequests/order';
import moment from 'moment';

type Props = {
    orders: OrderResponseType[];
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};
export function PurchaseHistoryModal(props: Props) {
    const { orders, open, setOpen } = props;

    const convertStatus = useCallback((status: number) => {
        switch (status) {
            case 0:
                return 'Chờ xác nhận';
            case 1:
                return 'Đang giao';
            case 2:
                return 'Thành công';
            case 3:
                return 'Đã bị hủy';
        }
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex justify-start px-2 w-full"
                >
                    Sản phẩm đã mua
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] min-w-[1025px]">
                {orders && orders?.length > 0 ? (
                    orders?.map((order) => (
                        <ScrollArea
                            key={order.id}
                            className="h-[700px] w-full p-3"
                        >
                            <DialogHeader>
                                <DialogTitle>Lịch sử mua hàng</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <DropdownMenuSeparator />
                                <div className="flex flex-col gap-4 ms-10">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">
                                                        Image
                                                    </span>
                                                </TableHead>
                                                <TableHead>
                                                    Tên sản phẩm
                                                </TableHead>
                                                <TableHead>Giá</TableHead>
                                                <TableHead className="table-cell">
                                                    Số lượng
                                                </TableHead>
                                                <TableHead className="table-cell">
                                                    Thành tiền
                                                </TableHead>
                                                <TableHead className="table-cell">
                                                    Ngày đặt
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order &&
                                                order?.order_details &&
                                                order?.order_details?.map(
                                                    (orderDetail) => {
                                                        return (
                                                            <TableRow
                                                                key={
                                                                    orderDetail.id
                                                                }
                                                            >
                                                                <TableCell className="hidden sm:table-cell">
                                                                    <Image
                                                                        alt="Product image"
                                                                        className="aspect-square rounded-md object-cover"
                                                                        height="64"
                                                                        src={
                                                                            orderDetail
                                                                                .product
                                                                                .thumbnail
                                                                        }
                                                                        width="64"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="font-medium capitalize">
                                                                    {orderDetail
                                                                        .product
                                                                        .name +
                                                                        ' ' +
                                                                        orderDetail.product.sku
                                                                            .toLowerCase()
                                                                            .replaceAll(
                                                                                '-',
                                                                                ' ',
                                                                            )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatPrice(
                                                                        orderDetail.price,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    {
                                                                        orderDetail.quantity
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="font-bold">
                                                                    {formatPrice(
                                                                        orderDetail.subtotal,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="font-bold">
                                                                    {moment(
                                                                        order.order_date,
                                                                    ).format(
                                                                        'DD-MM-YYYY',
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    },
                                                )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex gap-16 items-center justify-end">
                                    <div className="flex gap-2 text-right">
                                        Phí vận chuyển:
                                        <p>{formatPrice(order.fee)}</p>
                                    </div>
                                    <div className="flex gap-2 text-right">
                                        Tổng thanh toán:
                                        <p className="font-bold">
                                            {formatPrice(order.total_amount)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 text-right">
                                        Trạng thái:
                                        <p className="font-bold">
                                            {convertStatus(order.status)}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant={'outline'}
                                    onClick={() => setOpen(false)}
                                >
                                    Quay lại
                                </Button>
                            </DialogFooter>
                        </ScrollArea>
                    ))
                ) : (
                    <p className="text-center">Không có đơn hàng</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
