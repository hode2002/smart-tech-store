'use client';

import React, { useEffect, useState } from 'react';

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
import { formatPrice } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import {
    CartItem,
    ProductCheckout,
    setCartProducts,
    setProductCheckout,
} from '@/lib/store/slices';
import { useRouter } from 'next/navigation';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/apiRequests/account';

export default function PurchasePage() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.accessToken);
    const cartProducts = useAppSelector((state) => state.user.cart);
    const router = useRouter();

    const [currStatus, setCurrStatus] = useState<number>(5);

    const fetchCurrentOrders = async () => {
        const response = await orderApiRequest.getOrdersByStatus(
            token,
            currStatus,
        );
        if (response?.statusCode === 200) {
            return setOrders(response.data);
        }
        setOrders([]);
    };

    useEffect(() => {
        fetchCurrentOrders().then();
    }, [token, currStatus]);

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

    const handleUpdateOrderStatus = async (orderId: string, status: number) => {
        if (status === 2) {
            const isConfirm = window.confirm('Xác nhận đã nhận được sản phẩm?');
            if (!isConfirm) return;
        }
        const response = (await orderApiRequest.updateOrderStatus(
            token,
            orderId,
            status,
        )) as UpdateOrderResponseType;
        if (response?.statusCode === 200) {
            await fetchCurrentOrders();
            toast({
                description: response.message,
            });
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        const isConfirm = window.confirm('Chắc chắn hủy?');
        if (!isConfirm) return;

        const response = (await orderApiRequest.cancelOrder(
            token,
            orderId,
        )) as UpdateOrderResponseType;
        if (response?.statusCode === 200) {
            await fetchCurrentOrders();
            toast({
                description: response.message,
            });
        }
    };

    const handleRepurchase = async (order: OrderResponseType) => {
        let cartItemsCheckout: CartItem[] = [];
        const productsCheckout: ProductCheckout[] = [];

        for (const o of order.order_details) {
            const productOptionId = o.product.id;

            const response = (await accountApiRequest.addToCart(token, {
                productOptionId,
                quantity: o.quantity,
            })) as AddToCartResponseType;

            if (response?.statusCode === 201) {
                cartItemsCheckout = cartProducts.filter(
                    (p) =>
                        p.selected_option.id !==
                        response.data.selected_option.id,
                );

                const productCheckout: ProductCheckout = {
                    id: productOptionId,
                    name: o.product.name,
                    thumbnail: o.product.thumbnail,
                    unitPrice: o.product.price,
                    quantity: 1,
                    total: o.product.price + o.product.price_modifier,
                    weight: o.product.weight,
                };

                productsCheckout.push(productCheckout);
            }
        }

        dispatch(setCartProducts([...cartItemsCheckout, ...cartProducts]));
        dispatch(setProductCheckout(productsCheckout));
        router.push('/user/checkout');
    };

    return (
        <div>
            <ScrollArea className="w-96 sm:w-full">
                <Card className="mb-4">
                    <div className="flex items-center justify-between font-semibold">
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
                                    <div className="flex gap-16 items-center justify-end">
                                        <p className="text-right">
                                            Phí vận chuyển:
                                        </p>
                                        <p>{formatPrice(order.fee)}</p>
                                    </div>
                                    <div className="flex gap-6 items-center justify-end">
                                        <p className="text-right">
                                            Tổng thanh toán:
                                        </p>
                                        <p className="font-bold">
                                            {formatPrice(order.total_amount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right w-full pt-6">
                                    {(order.status === 0 ||
                                        order.status === 5) && (
                                        <Button
                                            onClick={() =>
                                                handleCancelOrder(order.id)
                                            }
                                        >
                                            Hủy
                                        </Button>
                                    )}
                                    {order.status === 1 && (
                                        <Button
                                            onClick={() =>
                                                handleUpdateOrderStatus(
                                                    order.id,
                                                    2,
                                                )
                                            }
                                        >
                                            Đã nhận hàng
                                        </Button>
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
