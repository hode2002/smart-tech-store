'use client';

import { OrderResponseType } from '@/apiRequests/order';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

type Props = {
    order: OrderResponseType;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleEditOrder: (orderId: string, status: number) => Promise<void>;
};
export function EditOrderModal(props: Props) {
    const { order, open, setOpen, handleEditOrder } = props;

    useEffect(() => {
        setSelectedStatus(order.status + '');
    }, [order]);

    const [selectedStatus, setSelectedStatus] = useState<string>('0');

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
                    Xem chi tiết
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] min-w-[825px]">
                <ScrollArea className="h-[700px] w-full p-3">
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex justify-center font-bold text-xl">
                            Thông tin khách hàng
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Tên</Label>
                            <Input
                                readOnly
                                value={order.name}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Số điện thoại</Label>
                            <Input
                                readOnly
                                value={order.phone}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Địa chỉ</Label>
                            <Input
                                readOnly
                                value={
                                    order.address +
                                    ', ' +
                                    order.ward +
                                    ', ' +
                                    order.district +
                                    ', ' +
                                    order.province
                                }
                                className="col-span-3"
                            />
                        </div>
                        <DropdownMenuSeparator />
                        <div className="flex flex-col gap-4 ms-10">
                            <div className="flex justify-center font-bold text-xl">
                                Chi tiết đơn hàng
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[100px] sm:table-cell">
                                            <span className="sr-only">
                                                Image
                                            </span>
                                        </TableHead>
                                        <TableHead>Tên sản phẩm</TableHead>
                                        <TableHead>Giá</TableHead>
                                        <TableHead className="table-cell">
                                            Số lượng
                                        </TableHead>
                                        <TableHead className="table-cell">
                                            Thành tiền
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
                                                        key={orderDetail.id}
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
                                                            {orderDetail.product
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
                                                    </TableRow>
                                                );
                                            },
                                        )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex gap-16 items-center justify-end">
                            <Label className="text-right">
                                Phí vận chuyển:
                            </Label>
                            <p>{formatPrice(order.fee)}</p>
                        </div>
                        <div className="flex gap-6 items-center justify-end">
                            <Label className="text-right">
                                Tổng thanh toán:
                            </Label>
                            <p className="font-bold">
                                {formatPrice(order.total_amount + order.fee)}
                            </p>
                        </div>
                        <DropdownMenuSeparator />
                        <div className="flex items-center gap-4 justify-end">
                            <Label className="text-right">Trạng thái</Label>
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={convertStatus(
                                            Number(selectedStatus),
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Trạng thái đơn hàng
                                        </SelectLabel>
                                        {Array.from({ length: 4 }).map(
                                            (_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={`${index}`}
                                                >
                                                    {convertStatus(index)}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant={'outline'}
                            onClick={() => setOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={() =>
                                handleEditOrder(
                                    order.id,
                                    Number(selectedStatus),
                                )
                            }
                        >
                            Lưu
                        </Button>
                    </DialogFooter>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
