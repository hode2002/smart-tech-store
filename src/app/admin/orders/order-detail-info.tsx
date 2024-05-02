import { Copy, CreditCard, MoreVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderResponseType } from '@/apiRequests/order';
import moment from 'moment';
import { formatPrice } from '@/lib/utils';
import { EditOrderModal } from '@/app/admin/orders/edit-order-modal';
import { Dispatch, SetStateAction } from 'react';

type Props = {
    order: OrderResponseType | undefined;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleEditOrder: (orderId: string, status: number) => Promise<void>;
};
const OrderDetailInfo = (props: Props) => {
    const { order, open, setOpen, handleEditOrder } = props;

    return (
        order && (
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Đơn hàng {order?.tracking_number}
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">Copy Order ID</span>
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            <div>
                                Ngày đặt:{' '}
                                {moment(order?.order_date).format('DD-MM-YYYY')}
                            </div>
                            <div>
                                Ngày giao dự kiến:{' '}
                                {moment(order?.estimate_date).format(
                                    'DD-MM-YYYY',
                                )}
                            </div>
                        </CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        {/* <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1"
                        >
                            <Truck className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                Track Order
                            </span>
                        </Button> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                    <span className="sr-only">More</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <EditOrderModal
                                    order={order}
                                    open={open}
                                    setOpen={setOpen}
                                    handleEditOrder={handleEditOrder}
                                />
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Đóng</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Chi tiết đơn hàng</div>

                        <ul className="grid gap-3">
                            {order?.order_details?.map((item) => {
                                return (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-muted-foreground capitalize">
                                            {item.product.name +
                                                ' ' +
                                                item.product.sku
                                                    .toLowerCase()
                                                    .replaceAll('-', ' ')}{' '}
                                            x <span>{item.quantity}</span>
                                        </span>
                                        <span>
                                            {formatPrice(item.subtotal)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Tiền hàng
                                </span>
                                <span>
                                    {formatPrice(
                                        order.total_amount - order.fee,
                                    )}
                                </span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Phí vận chuyển
                                </span>
                                <span>{formatPrice(order.fee)}</span>
                            </li>
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">
                                    Tổng thanh toán
                                </span>
                                <span>{formatPrice(order.total_amount)}</span>
                            </li>
                        </ul>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <div className="font-semibold">
                                Đơn vị vận chuyển
                            </div>
                            <div className="text-muted-foreground capitalize">
                                {order.delivery.name}
                            </div>
                        </div>
                        <div className="grid auto-rows-max gap-3">
                            <div className="font-semibold">Địa chỉ</div>
                            <address className="grid gap-0.5 not-italic text-muted-foreground">
                                <span>{order.address}</span>
                                <span>
                                    {order.ward +
                                        ', ' +
                                        order.district +
                                        ', ' +
                                        order.province}
                                </span>
                            </address>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                        <div className="font-semibold">
                            Thông tin khách hàng
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">
                                    Họ tên
                                </dt>
                                <dd>{order.name}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{order.email}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">
                                    Số điện thoại
                                </dt>
                                <dd>
                                    <a href="tel:">{order.phone}</a>
                                </dd>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                        <div className="font-semibold">
                            Thông tin thanh toán
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                                {order.payment_method === 'cod' ? (
                                    <dt className="flex items-center gap-1 text-muted-foreground">
                                        {order.payment_method}
                                    </dt>
                                ) : (
                                    <>
                                        <dt className="flex items-center gap-1 text-muted-foreground uppercase">
                                            <CreditCard className="h-4 w-4" />
                                            {order.payment_method}
                                        </dt>
                                        <dd>{order.transaction_id}</dd>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    );
};

export default OrderDetailInfo;
