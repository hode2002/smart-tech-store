import React, { useCallback, useEffect, useState } from 'react';
import orderApiRequest, {
    OrderResponseType,
    UpdateOrderResponseType,
} from '@/lib/apiRequest/order';
import { formatPrice } from '@/lib/utils';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/lib/apiRequest/account';
import { useAuthStore, useUserStore } from '@/store';
import Toast from 'react-native-toast-message';
import { CartItem, ProductCheckout } from '@/types/type';
import { Href, Link, router } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import { Button } from '@/components/Button';
import { Image } from 'react-native';

export default function PurchasePage() {
    const { accessToken } = useAuthStore((state) => state);
    const {
        cart: cartProducts,
        setCartProducts,
        setProductCheckout,
    } = useUserStore((state) => state);

    const [currStatus, setCurrStatus] = useState<number>(5);

    const fetchCurrentOrders = useCallback(async () => {
        const response = await orderApiRequest.getOrdersByStatus(
            accessToken,
            currStatus,
        );
        if (response?.statusCode === 200) {
            return setOrders(response.data);
        }
        setOrders([]);
    }, [accessToken, currStatus]);

    useEffect(() => {
        fetchCurrentOrders().then();
    }, [fetchCurrentOrders]);

    const [orders, setOrders] = useState<OrderResponseType[]>([]);

    const convertStatus = (status: number) => {
        switch (status) {
            case 0:
                return 'Chờ xác nhận';
            case 1:
                return 'Đang giao';
            case 2:
                return 'Giao thành công';
            case 3:
                return 'Đã hủy';
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: number) => {
        const response = (await orderApiRequest.updateOrderStatus(
            accessToken,
            orderId,
            status,
        )) as UpdateOrderResponseType;
        if (response?.statusCode === 200) {
            await fetchCurrentOrders();
            Toast.show({
                type: 'success',
                text1: response.message,
            });
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        const response = (await orderApiRequest.cancelOrder(
            accessToken,
            orderId,
        )) as UpdateOrderResponseType;
        if (response?.statusCode === 200) {
            await fetchCurrentOrders();
            Toast.show({
                type: 'success',
                text1: response.message,
            });
        }
    };

    const handleRepurchase = async (order: OrderResponseType) => {
        const cartItemsCheckout: CartItem[] = [];
        const productsCheckout: ProductCheckout[] = [];

        for (const o of order.order_details) {
            const productOptionId = o.product.id;

            const response = (await accountApiRequest.addToCart(accessToken, {
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

        setCartProducts([
            ...cartProducts.filter(
                (product) =>
                    !cartItemsCheckout.some((item) => item.id === product.id),
            ),
            ...cartItems,
        ]);

        setProductCheckout(productsCheckout);
        router.push('/(root)/checkout');
    };

    const totalOrderAmount = useCallback((order: OrderResponseType) => {
        const orderPaymentMethod = order.payment_method;
        if (orderPaymentMethod === 'cod') {
            return [
                formatPrice(order.fee),
                formatPrice(order.total_amount + order.fee),
            ];
        }

        const isPaymentOnlineSuccess = order.transaction_id;
        const orderStatus = order.status;
        if (isPaymentOnlineSuccess && orderStatus !== 2) {
            return [formatPrice(0), formatPrice(0)];
        }

        return [
            formatPrice(order.fee),
            formatPrice(order.total_amount + order.fee),
        ];
    }, []);

    return (
        <View>
            <View className="w-full bg-white mb-4">
                <ScrollView
                    horizontal
                    className="flex-row gap-3"
                    showsHorizontalScrollIndicator={false}
                >
                    <Button
                        onPress={() => setCurrStatus(5)}
                        label="Tất cả"
                        labelClasses={`${currStatus === 5 ? 'border-b-2 border-red-500 text-red-500' : 'text-black'} mt-4 font-JakartaBold px-5 pb-3 min-w-[120px] rounded-md`}
                    />
                    <Button
                        onPress={() => setCurrStatus(0)}
                        label="Chờ xác nhận"
                        labelClasses={`${currStatus === 0 ? 'border-b-2 border-red-500 text-red-500' : 'text-black'} mt-4 font-JakartaBold px-5 pb-3 min-w-[120px] rounded-md`}
                    />
                    <Button
                        onPress={() => setCurrStatus(1)}
                        label="Vận chuyển"
                        labelClasses={`${currStatus === 1 ? 'border-b-2 border-red-500 text-red-500' : 'text-black'} mt-4 font-JakartaBold px-5 pb-3 min-w-[120px] rounded-md`}
                    />
                    <Button
                        onPress={() => setCurrStatus(2)}
                        label="Hoàn thành"
                        labelClasses={`${currStatus === 2 ? 'border-b-2 border-red-500 text-red-500' : 'text-black'} mt-4 font-JakartaBold px-5 pb-3 min-w-[120px] rounded-md`}
                    />
                    <Button
                        onPress={() => setCurrStatus(3)}
                        label="Đã hủy"
                        labelClasses={`${currStatus === 3 ? 'border-b-2 border-red-500 text-red-500' : 'text-black'} mt-4 font-JakartaBold px-5 pb-3 min-w-[120px] rounded-md`}
                    />
                </ScrollView>
            </View>
            {orders && orders?.length > 0 ? (
                <View className="w-full mb-4 bg-whites">
                    {orders.map((order) => {
                        return (
                            <View
                                key={order.id}
                                className="w-full mb-4 bg-white"
                            >
                                <View className="border-b py-2">
                                    <View className="flex-row justify-end gap-2 items-center px-4">
                                        <Text className="font-JakartaBold">
                                            {convertStatus(order.status)}
                                        </Text>
                                        {order.status === 2 && (
                                            <Text className="uppercase font-JakartaBold">
                                                [{order.payment_method}]
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                {order?.order_details &&
                                    order?.order_details.map((orderDetail) => {
                                        return (
                                            <View
                                                key={orderDetail.id}
                                                className="px-2 pt-6"
                                            >
                                                <Link
                                                    asChild
                                                    href={
                                                        `/${orderDetail.product.category.slug}/${orderDetail.product.slug}` as Href
                                                    }
                                                >
                                                    <View className="flex-row justify-between items-center w-full px-2">
                                                        <View className="flex-row gap-3 items-center">
                                                            <Image
                                                                source={{
                                                                    uri: orderDetail
                                                                        .product
                                                                        .thumbnail,
                                                                }}
                                                                width={70}
                                                                height={70}
                                                                alt={
                                                                    orderDetail
                                                                        .product
                                                                        .name
                                                                }
                                                            />
                                                            <View className="items-start">
                                                                <Text className="font-JakartaBold text-md leading-none">
                                                                    {
                                                                        orderDetail
                                                                            .product
                                                                            .name
                                                                    }
                                                                </Text>
                                                                <Text className="my-2 text-sm font-JakartaMeidum flex gap-1">
                                                                    {
                                                                        orderDetail
                                                                            .product
                                                                            .name
                                                                    }
                                                                    {orderDetail.product.options.map(
                                                                        (
                                                                            option,
                                                                        ) => (
                                                                            <Text
                                                                                key={
                                                                                    option.name
                                                                                }
                                                                            >
                                                                                {
                                                                                    option.value
                                                                                }
                                                                            </Text>
                                                                        ),
                                                                    )}
                                                                </Text>
                                                                <View className="flex-row gap-2 text-md leading-none">
                                                                    <Text className="font-JakartaBold">
                                                                        {
                                                                            orderDetail.quantity
                                                                        }
                                                                    </Text>
                                                                    <Text className="font-JakartaBold">
                                                                        x
                                                                    </Text>
                                                                    <Text className="font-JakartaBold">
                                                                        {formatPrice(
                                                                            orderDetail.price,
                                                                        )}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <Text className="whitespace-nowrap font-JakartaBold text-md leading-none">
                                                                {formatPrice(
                                                                    orderDetail.subtotal,
                                                                )}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </Link>
                                            </View>
                                        );
                                    })}
                                <View className="flex flex-col pt-6">
                                    <View className="justify-end w-full">
                                        <View className="flex-row gap-6 items-center justify-between border-y border-gray-200 px-4 py-3">
                                            <Text className="font-JakartaMedium">
                                                Phí vận chuyển
                                            </Text>
                                            <Text className="font-JakartaMedium">
                                                {totalOrderAmount(order)[0]}
                                            </Text>
                                        </View>
                                        <View className="flex-row gap-6 items-center justify-between border-y border-gray-200 px-4 py-3">
                                            <Text className="font-JakartaMedium">
                                                {orders.length} sản phẩm
                                            </Text>
                                            <View className="flex-row gap-2 justify-center">
                                                <Text className="font-JakartaMedium">
                                                    Thành tiền:
                                                </Text>
                                                <Text className="font-JakartaBold">
                                                    {totalOrderAmount(order)[1]}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="flex-row justify-end w-full pt-6">
                                        {(order.status === 0 ||
                                            order.status === 5) && (
                                            <View>
                                                <Button
                                                    onPress={() => {
                                                        Alert.alert(
                                                            'Hủy?',
                                                            `Xác nhận hủy đặt hàng?`,
                                                            [
                                                                {
                                                                    text: 'Hủy',
                                                                    onPress:
                                                                        () => {},
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: 'Xác nhận',
                                                                    onPress:
                                                                        () => {
                                                                            handleCancelOrder(
                                                                                order.id,
                                                                            );
                                                                        },
                                                                },
                                                            ],
                                                        );
                                                    }}
                                                    label="Hủy"
                                                    labelClasses="text-white bg-black m-4 font-JakartaBold px-5 py-3 min-w-[120px] rounded-md"
                                                />
                                            </View>
                                        )}
                                        {order.status === 1 && (
                                            <View>
                                                <Button
                                                    onPress={() => {
                                                        Alert.alert(
                                                            'Xác nhận đã nhận được hàng?',
                                                            `Bạn đã nhận được hàng?`,
                                                            [
                                                                {
                                                                    text: 'Hủy',
                                                                    onPress:
                                                                        () => {},
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: 'Xác nhận',
                                                                    onPress:
                                                                        () => {
                                                                            handleUpdateOrderStatus(
                                                                                order.id,
                                                                                2,
                                                                            );
                                                                        },
                                                                },
                                                            ],
                                                        );
                                                    }}
                                                    label="Đã nhận hàng"
                                                    labelClasses="text-white bg-black m-4 font-JakartaBold px-5 py-3 min-w-[120px] rounded-md"
                                                />
                                            </View>
                                        )}
                                        {(order.status === 2 ||
                                            order.status === 3) && (
                                            <Button
                                                onPress={() =>
                                                    handleRepurchase(order)
                                                }
                                                label="Mua lại"
                                                labelClasses="text-white bg-black m-4 font-JakartaBold px-5 py-3 min-w-[120px] rounded-md"
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            ) : (
                <View className="w-full mb-4">
                    <View className="px-6 pt-6 border-b transition-colors hover:bg-accent hover:text-accent-foreground ">
                        <View className="flex justify-center items-center">
                            <Text>Không có đơn hàng</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
