'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import orderApiRequest, {
    OrderResponseType,
    UpdateOrderResponseType,
} from '@/apiRequests/order';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { formatPrice, notifyContentByStatus } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import {
    addNotification,
    CartItem,
    ProductCheckout,
    setCartProducts,
    setProductCheckout,
} from '@/lib/store/slices';
import { useRouter } from 'next/navigation';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/apiRequests/account';
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
import notificationApiRequest, {
    CreateUserNotificationResponseType,
} from '@/apiRequests/notification';

export default function PurchasePage() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.accessToken);
    const cartProducts = useAppSelector((state) => state.user.cart);
    const router = useRouter();

    const [currStatus, setCurrStatus] = useState<number>(5);

    const fetchCurrentOrders = useCallback(async () => {
        const response = await orderApiRequest.getOrdersByStatus(
            token,
            currStatus,
        );
        if (response?.statusCode === 200) {
            setOrders(response.data);
        } else {
            setOrders([]);
        }
    }, [token, currStatus]);

    useEffect(() => {
        (async () => await fetchCurrentOrders())();
    }, [fetchCurrentOrders]);

    const [orders, setOrders] = useState<OrderResponseType[]>([]);

    const convertStatus = (status: number) => {
        switch (status) {
            case 0:
                return 'Chờ xác nhận';
            case 1:
                return 'Đơn hàng đang trên đường giao';
            case 2:
                return 'Đơn hàng đã được giao thành công';
            case 3:
                return 'Đơn hàng đã bị hủy';
        }
    };

    const createNotification = async (
        images: string,
        userId: string,
        status: 0 | 1 | 2 | 3,
    ) => {
        await fetchCurrentOrders();
        const notification = notifyContentByStatus(status);
        const response: CreateUserNotificationResponseType =
            await notificationApiRequest.createUserNotify(token, {
                user_id: userId,
                title: notification.title,
                content: notification.content,
                images,
                link: '/user/purchase',
            });
        dispatch(addNotification(response.data.notification));
    };

    const handleUpdateOrderStatus = async (orderId: string, status: number) => {
        const response = (await orderApiRequest.updateOrderStatus(
            token,
            orderId,
            status,
        )) as UpdateOrderResponseType;
        if (response?.statusCode === 200) {
            const jsonImages = JSON.stringify(
                response.data.order_details?.map(
                    (item) => item.product_option.thumbnail,
                ),
            );
            await createNotification(jsonImages, response.data.userId!, 2);

            toast({
                description: response.message,
            });
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        const response = (await orderApiRequest.cancelOrder(
            token,
            orderId,
        )) as UpdateOrderResponseType;
        if (response?.statusCode === 200) {
            const jsonImages = JSON.stringify(
                response.data.order_details?.map(
                    (item) => item.product_option.thumbnail,
                ),
            );
            await createNotification(jsonImages, response.data.userId!, 3);

            toast({
                description: response.message,
            });
        }
    };

    const handleRepurchase = async (order: OrderResponseType) => {
        const cartItemsCheckout: CartItem[] = [];
        const productsCheckout: ProductCheckout[] = [];

        for (const o of order.order_details) {
            const productOptionId = o.product.id;

            const response = (await accountApiRequest.addToCart(token, {
                productOptionId,
                quantity: o.quantity,
            })) as AddToCartResponseType;

            if (response?.statusCode === 201) {
                cartItemsCheckout.push(response.data);

                const productCheckout: ProductCheckout = {
                    id: productOptionId,
                    name: o.product.name,
                    thumbnail: o.product.thumbnail,
                    unitPrice: o.product.price,
                    priceModifier: o.product.price_modifier,
                    quantity: o.quantity,
                    weight: o.product.weight,
                    discount: o.product.discount,
                };

                productsCheckout.push(productCheckout);
            }
        }

        const cartItems: CartItem[] = cartItemsCheckout.map((item) => {
            const isExist = cartProducts.find(
                (product) => product.id === item.id,
            );

            if (!isExist) {
                return item;
            }

            return {
                ...item,
                quantity: item.quantity,
            };
        });

        dispatch(
            setCartProducts([
                ...cartProducts.filter(
                    (product) =>
                        !cartItemsCheckout.some(
                            (item) => item.id === product.id,
                        ),
                ),
                ...cartItems,
            ]),
        );

        dispatch(setProductCheckout(productsCheckout));
        router.push('/user/checkout');
    };

    const totalOrderAmount = useCallback((order: OrderResponseType) => {
        const orderPaymentMethod = order.payment_method;
        if (orderPaymentMethod === 'cod') {
            return [formatPrice(order.fee), formatPrice(order.total_amount)];
        }

        const isPaymentOnlineSuccess = order.transaction_id;
        const orderStatus = order.status;
        if (isPaymentOnlineSuccess && orderStatus !== 2) {
            return [formatPrice(0), formatPrice(0)];
        }

        return [formatPrice(order.fee), formatPrice(order.total_amount)];
    }, []);

    return (
        <div>
            <ScrollArea className="w-96 sm:w-full">
                <Card className="mb-4">
                    <div className="flex gap-3 md:gap-0 items-center justify-between font-semibold">
                        <Button
                            variant={currStatus === 5 ? 'default' : 'link'}
                            className="w-[20%] text-center text-nowrap rounded"
                            onClick={() => setCurrStatus(5)}
                        >
                            Tất cả
                        </Button>
                        <Button
                            variant={currStatus === 0 ? 'default' : 'link'}
                            className="w-[20%] text-center text-nowrap rounded"
                            onClick={() => setCurrStatus(0)}
                        >
                            Chờ xác nhận
                        </Button>
                        <Button
                            variant={currStatus === 1 ? 'default' : 'link'}
                            className="w-[20%] text-center text-nowrap rounded"
                            onClick={() => setCurrStatus(1)}
                        >
                            Vận chuyển
                        </Button>
                        <Button
                            variant={currStatus === 2 ? 'default' : 'link'}
                            className="w-[20%] text-center text-nowrap rounded"
                            onClick={() => setCurrStatus(2)}
                        >
                            Hoàn thành
                        </Button>
                        <Button
                            variant={currStatus === 3 ? 'default' : 'link'}
                            className="w-[20%] text-center text-nowrap rounded"
                            onClick={() => setCurrStatus(3)}
                        >
                            Đã hủy
                        </Button>
                    </div>
                </Card>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {orders && orders?.length > 0 ? (
                orders.map((order) => {
                    return (
                        <Card key={order.id} className="w-96 sm:w-full mb-4">
                            <CardHeader className="border-b">
                                <div className="flex justify-end gap-4 items-center">
                                    <p className="font-semibold">
                                        {convertStatus(order.status)}
                                        {order.status === 2 && (
                                            <span className="mx-2 uppercase">
                                                [{order.payment_method}]
                                            </span>
                                        )}
                                    </p>
                                    {/* {order.status === 2 && (
                                        <Button
                                            variant={'link'}
                                            className="underline text-popover-foreground "
                                        >
                                            Đánh giá
                                        </Button>
                                    )} */}
                                </div>
                            </CardHeader>
                            {order?.order_details &&
                                order?.order_details.map((orderDetail) => {
                                    return (
                                        <CardContent
                                            key={orderDetail.id}
                                            className="px-6 pt-6 border-b transition-colors hover:bg-accent hover:text-accent-foreground "
                                        >
                                            <Link
                                                href={`/${orderDetail.product.category.slug}/${orderDetail.product.slug}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-3 items-center">
                                                        <Image
                                                            src={
                                                                orderDetail
                                                                    .product
                                                                    .thumbnail
                                                            }
                                                            width={70}
                                                            height={70}
                                                            alt={
                                                                orderDetail
                                                                    .product
                                                                    .name
                                                            }
                                                        />

                                                        <div className="items-start">
                                                            <p className=" font-bold text-md leading-none">
                                                                {
                                                                    orderDetail
                                                                        .product
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="my-2 text-sm leading-snug text-muted-foreground flex gap-1">
                                                                {
                                                                    orderDetail
                                                                        .product
                                                                        .name
                                                                }
                                                                {orderDetail.product.options.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                option.name
                                                                            }
                                                                        >
                                                                            {
                                                                                option.value
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </p>
                                                            <p className=" font-bold text-md leading-none">
                                                                <span>
                                                                    {
                                                                        orderDetail.quantity
                                                                    }
                                                                </span>
                                                                <span> x </span>
                                                                <span>
                                                                    {formatPrice(
                                                                        orderDetail.price,
                                                                    )}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="whitespace-nowrap font-bold text-md leading-none">
                                                            {formatPrice(
                                                                orderDetail.subtotal,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </CardContent>
                                    );
                                })}
                            <CardFooter className="flex flex-col pt-6">
                                <div className="justify-end w-full">
                                    <div className="flex gap-6 items-center justify-end">
                                        <p className="text-right">
                                            Phí vận chuyển:
                                        </p>
                                        <p>{totalOrderAmount(order)[0]}</p>
                                    </div>
                                    <div className="flex gap-6 items-center justify-end">
                                        <p className="text-right">
                                            Tổng thanh toán:
                                        </p>
                                        <p className="font-bold">
                                            {totalOrderAmount(order)[1]}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right w-full pt-6">
                                    {(order.status === 0 ||
                                        order.status === 5) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button>Hủy</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Xác nhận hủy đặt hàng?
                                                    </AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleCancelOrder(
                                                                order.id,
                                                            )
                                                        }
                                                    >
                                                        Xác nhận
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    {order.status === 1 && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button>Đã nhận hàng</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Bạn đã nhận được hàng?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-black">
                                                        Xác nhận đã thanh toán{' '}
                                                        <span className="font-bold">
                                                            {
                                                                totalOrderAmount(
                                                                    order,
                                                                )[1]
                                                            }
                                                        </span>
                                                        ?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleUpdateOrderStatus(
                                                                order.id,
                                                                2,
                                                            )
                                                        }
                                                    >
                                                        Xác nhận
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    {(order.status === 2 ||
                                        order.status === 3) && (
                                        <Button
                                            onClick={() =>
                                                handleRepurchase(order)
                                            }
                                        >
                                            Mua lại
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })
            ) : (
                <Card className="w-96 sm:w-full mb-4">
                    <CardContent className="px-6 pt-6 border-b transition-colors hover:bg-accent hover:text-accent-foreground ">
                        <div className="flex justify-center items-center">
                            <p>Không có đơn hàng</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
