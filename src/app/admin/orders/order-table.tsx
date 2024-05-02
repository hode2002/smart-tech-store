'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OrderResponseType } from '@/apiRequests/order';
import moment from 'moment';
import { formatPrice } from '@/lib/utils';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { EditOrderModal } from '@/app/admin/orders/edit-order-modal';

type Props = {
    orders: OrderResponseType[] | undefined;
    selectedOrder: OrderResponseType | undefined;
    setSelectedOrder: Dispatch<SetStateAction<OrderResponseType | undefined>>;
    status: number;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleEditOrder: (orderId: string, status: number) => Promise<void>;
};
const OrderTable = (props: Props) => {
    const {
        orders,
        selectedOrder,
        setSelectedOrder,
        status,
        open,
        setOpen,
        handleEditOrder,
    } = props;
    const [filterOrders, setFilterOrders] = useState<
        OrderResponseType[] | undefined
    >(orders);

    useEffect(() => {
        if (status === 5) {
            setFilterOrders(orders);
        } else {
            setFilterOrders(orders?.filter((order) => order.status === status));
        }
    }, [orders, status]);

    const convertStatus = (status: number) => {
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
    };

    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Đơn đặt hàng</CardTitle>
                <CardDescription>Các đơn đặt hàng gần đây</CardDescription>
            </CardHeader>
            <CardContent>
                {filterOrders && filterOrders?.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Địa chỉ
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Ngày đặt hàng
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Ngày giao dự kiến
                                </TableHead>
                                <TableHead className="hidden sm:table-cell text-center">
                                    Trạng thái
                                </TableHead>
                                <TableHead className="text-right">
                                    Thành tiền
                                </TableHead>
                                <TableHead>
                                    <span className="sr-only">Thao tác</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterOrders?.map((order) => {
                                return (
                                    <TableRow
                                        key={order.id}
                                        className={`cursor-pointer ${order.id === selectedOrder?.id
                                                ? 'bg-accent'
                                                : ''
                                            }`}
                                        onClick={() =>
                                            setSelectedOrder(
                                                order.id === selectedOrder?.id
                                                    ? undefined
                                                    : order,
                                            )
                                        }
                                    >
                                        <TableCell>
                                            <div className="font-medium">
                                                {order.name}
                                            </div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                {order.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {order.address +
                                                ', ' +
                                                order.ward +
                                                ', ' +
                                                order.district +
                                                ', ' +
                                                order.province}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-center">
                                            {moment(order.order_date).format(
                                                'DD-MM-YYYY',
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-center">
                                            {moment(order.estimate_date).format(
                                                'DD-MM-YYYY',
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge
                                                className="font-bold text-md"
                                                variant="outline"
                                            >
                                                {convertStatus(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-bold">
                                                {formatPrice(
                                                    order.total_amount +
                                                    order.fee,
                                                )}
                                            </span>
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
                                                    <EditOrderModal
                                                        order={order}
                                                        open={open}
                                                        setOpen={setOpen}
                                                        handleEditOrder={
                                                            handleEditOrder
                                                        }
                                                    />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center">Không có đơn hàng</p>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderTable;
