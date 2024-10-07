'use client';

import { ListFilter, Search } from 'lucide-react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderDetailInfo from '@/app/admin/orders/order-detail-info';
import OrderTable from '@/app/admin/orders/order-table';
import OrderStatisticCard from '@/app/admin/orders/order-statistic-card';

import { useAppSelector } from '@/lib/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import adminApiRequest from '@/apiRequests/admin';
import {
    GetOrderStatusResponseType,
    OrderResponseType,
    UpdateOrderResponseType,
} from '@/apiRequests/order';

import { Button } from '@/components/ui/button';
import { formatPrice, notifyContentByStatus } from '@/lib/utils';
import moment, { unitOfTime } from 'moment';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import notificationApiRequest from '@/apiRequests/notification';

export default function Order() {
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseType>();
    const [status, setStatus] = useState<number>(5);

    const token = useAppSelector((state) => state.auth.accessToken);
    const [orders, setOrders] = useState<OrderResponseType[]>([]);
    const [filterOrders, setFilterOrders] = useState<OrderResponseType[]>([]);

    const getStatistic = useCallback(
        (statisticBy: unitOfTime.StartOf = 'week') => {
            let total = 0;
            orders?.forEach((order) => {
                if (
                    order.status === 2 &&
                    moment(order.estimate_date).isSameOrAfter(
                        moment(new Date()),
                        statisticBy,
                    )
                ) {
                    total += order.total_amount;
                }
            });
            return total;
        },
        [orders],
    );

    const statisticWeek = useMemo<number>(() => getStatistic(), [getStatistic]);
    const statisticMonth = useMemo<number>(
        () => getStatistic('month'),
        [getStatistic],
    );

    const fetchOrders = useCallback(async () => {
        const response = (await adminApiRequest.getAllOrders(
            token,
        )) as GetOrderStatusResponseType;
        if (response?.statusCode === 200) {
            return response.data;
        }
        return [];
    }, [token]);

    useEffect(() => {
        fetchOrders().then((orders) => {
            setOrders(orders);
            setFilterOrders(orders);
            setSelectedOrder(undefined);
        });
    }, [fetchOrders, setSelectedOrder, status]);

    const [open, setOpen] = useState<boolean>(false);
    const handleEditOrder = async (orderId: string, status: number) => {
        setOpen(false);
        const response = (await adminApiRequest.updateOrderStatus(
            token,
            orderId,
            status,
        )) as UpdateOrderResponseType;

        if (response?.statusCode === 200) {
            if (status !== 0) {
                const notify = notifyContentByStatus(status as 0 | 1 | 2 | 3);
                const jsonImages = JSON.stringify(
                    response.data.order_details?.map(
                        (item) => item.product_option.thumbnail,
                    ),
                );
                await notificationApiRequest.createUserNotify(token, {
                    user_id: response.data.userId!,
                    title: notify.title,
                    content: notify.content,
                    images: jsonImages,
                    link: '/user/purchase',
                });
            }

            setOrders([
                ...orders.map((item) => {
                    if (item.id === orderId) {
                        item.status = status;
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

    const [searchText, setSearchText] = useState<string>('');
    useEffect(() => {
        if (searchText) {
            setFilterOrders(
                orders.filter((order) => order.phone.includes(searchText)),
            );
        } else {
            setFilterOrders(orders);
        }
    }, [setFilterOrders, searchText, orders]);

    return (
        <section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 bg-muted/40">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    <Card
                        className="sm:col-span-2"
                        x-chunk="dashboard-05-chunk-0"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle>Quản lý đơn hàng</CardTitle>
                            <CardDescription className="max-w-lg text-balance leading-relaxed">
                                Xem thông tin các đơn đặt hàng của khách hàng và
                                thống kê doanh số bán hàng
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <OrderStatisticCard
                        title={formatPrice(statisticWeek)}
                        subtitle="Tuần này"
                    />
                    <OrderStatisticCard
                        title={formatPrice(statisticMonth)}
                        subtitle="Tháng này"
                    />
                </div>
                <ScrollArea>
                    <Tabs defaultValue="week">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <TabsList>
                                <TabsTrigger value="week">Tuần</TabsTrigger>
                                <TabsTrigger value="month">Tháng</TabsTrigger>
                                <TabsTrigger value="year">Năm</TabsTrigger>
                            </TabsList>
                            <div className="flex mt-4 gap-6">
                                <div className="relative px-2 md:px-0">
                                    <Search className="absolute left-3.5 md:left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={searchText}
                                        onChange={(e) =>
                                            setSearchText(e.target.value)
                                        }
                                        type="search"
                                        placeholder="Nhập số điện thoại để tìm đơn hàng"
                                        className="rounded-lg bg-background pl-7 md:pl-8 w-[290px] md:w-[300px]"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 gap-1 text-sm py-4"
                                            >
                                                <ListFilter className="h-3.5 w-3.5" />
                                                <span className="not-sr-only">
                                                    Lọc
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Trạng thái
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                                onClick={() => setStatus(5)}
                                                checked={status === 5}
                                            >
                                                Tất cả
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() => setStatus(0)}
                                                checked={status === 0}
                                            >
                                                Chờ xác nhận
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() => setStatus(1)}
                                                checked={status === 1}
                                            >
                                                Đang giao
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() => setStatus(2)}
                                                checked={status === 2}
                                            >
                                                Thành công
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                onClick={() => setStatus(3)}
                                                checked={status === 3}
                                            >
                                                Đã bị hủy
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                        <TabsContent value="week">
                            <OrderTable
                                status={status}
                                orders={filterOrders.filter((order) =>
                                    moment(order.order_date).isSame(
                                        moment(new Date()),
                                        'week',
                                    ),
                                )}
                                selectedOrder={selectedOrder}
                                setSelectedOrder={setSelectedOrder}
                                open={open}
                                setOpen={setOpen}
                                handleEditOrder={handleEditOrder}
                            />
                            <ScrollBar orientation="horizontal" />
                        </TabsContent>
                        <TabsContent value="month">
                            <OrderTable
                                status={status}
                                orders={filterOrders.filter((order) =>
                                    moment(order.order_date).isSame(
                                        moment(new Date()),
                                        'month',
                                    ),
                                )}
                                selectedOrder={selectedOrder}
                                setSelectedOrder={setSelectedOrder}
                                open={open}
                                setOpen={setOpen}
                                handleEditOrder={handleEditOrder}
                            />
                            <ScrollBar orientation="horizontal" />
                        </TabsContent>
                        <TabsContent value="year">
                            <OrderTable
                                status={status}
                                orders={filterOrders.filter((order) =>
                                    moment(order.order_date).isSame(
                                        moment(new Date()),
                                        'year',
                                    ),
                                )}
                                selectedOrder={selectedOrder}
                                setSelectedOrder={setSelectedOrder}
                                open={open}
                                setOpen={setOpen}
                                handleEditOrder={handleEditOrder}
                            />
                            <ScrollBar orientation="horizontal" />
                        </TabsContent>
                    </Tabs>
                </ScrollArea>
            </div>
            <div>
                <OrderDetailInfo
                    order={selectedOrder}
                    open={open}
                    setOpen={setOpen}
                    handleEditOrder={handleEditOrder}
                />
            </div>
        </section>
    );
}
