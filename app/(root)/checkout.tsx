import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { icons } from '@/constants';
import { useAuthStore, useUserStore } from '@/store';
import { CartItem, Delivery } from '@/types/type';
import { Href, router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import orderApiRequest, {
    CalculateShippingFeeType,
    CreateOrderResponseType,
    CreateOrderType,
} from '@/lib/apiRequest/order';
import deliveryApiRequest from '@/lib/apiRequest/delivery';
import { DeliveryResponseType } from '@/schemaValidations/delivery.schema';
import Toast from 'react-native-toast-message';
import { formatPrice } from '@/lib/utils';
import CheckoutTable from '@/components/CheckoutTable';
import { ScrollView } from 'react-native';

export default function Checkout() {
    const { accessToken } = useAuthStore((state) => state);
    const {
        profile,
        address: userAddress,
        cart: userCart,
        checkout: productCheckout,
        setProductCheckout,
        setCartProducts,
        setPaymentId,
    } = useUserStore((state) => state);
    const [deliveryList, setDeliveryList] = useState<Delivery[]>([]);

    useEffect(() => {
        return () => {
            setProductCheckout([]);
        };
    }, [setProductCheckout]);

    useEffect(() => {
        if (accessToken && productCheckout.length === 0) {
            return router.back();
        }
    }, [accessToken, productCheckout.length]);

    useEffect(() => {
        deliveryApiRequest.getDelivery().then((res: DeliveryResponseType) => {
            setSelectedDelivery(res.data[0]);
            return setDeliveryList(res.data);
        });
    }, []);

    const [paymentMethod, setPaymentMethod] = useState<string>('cod');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (accessToken && productCheckout.length !== 0) {
            let value = 0;
            let weight = 0;
            productCheckout.forEach((product) => {
                const discount =
                    ((product.unitPrice + product.priceModifier) *
                        product.discount) /
                    100;
                const modifiedPrice =
                    product.unitPrice + +product.priceModifier - discount;
                value += product.quantity * modifiedPrice;
                weight += product.weight;
            });
            const shippingInfo: CalculateShippingFeeType = {
                province: userAddress.province,
                district: userAddress.district,
                ward: userAddress.ward,
                value,
                weight,
            };
            orderApiRequest
                .calculateShippingFee(accessToken, shippingInfo)
                .then((res) => {
                    if (res?.statusCode === 200) {
                        setDeliveryCost(res.data.fee);
                    }
                });
            return;
        }
    }, [
        accessToken,
        productCheckout.length,
        productCheckout,
        userAddress.province,
        userAddress.district,
        userAddress.ward,
    ]);

    const [selectedDelivery, setSelectedDelivery] = useState(deliveryList[0]);
    const [deliveryCost, setDeliveryCost] = useState(0);

    const productPrice = useMemo(() => {
        let productPrice = 0;
        productCheckout.forEach(
            (product) =>
                (productPrice +=
                    product.quantity *
                    (product.unitPrice +
                        product.priceModifier -
                        ((product.unitPrice + product.priceModifier) *
                            product.discount) /
                            100)),
        );
        return productPrice;
    }, [productCheckout]);

    const totalPice = useMemo(() => productPrice + deliveryCost, []); //eslint-disable-line

    const handlePayment = async () => {
        if (loading) return;
        setLoading(true);

        const orderInfo: CreateOrderType = {
            name: profile.name as string,
            phone: profile.phone as string,
            address: userAddress.address as string,
            province: userAddress.province,
            district: userAddress.district,
            ward: userAddress.ward,
            hamlet: 'khác',
            note: 'Giao buổi trưa',
            delivery_id: selectedDelivery!.id,
            payment_method: paymentMethod,
            order_details: productCheckout.map((product) => ({
                product_option_id: product.id,
                quantity: product.quantity,
            })),
        };
        const createOrderResponse = (await orderApiRequest.createOrder(
            accessToken,
            orderInfo,
        )) as CreateOrderResponseType;

        setLoading(false);
        if (createOrderResponse?.statusCode === 201) {
            const cartItemAfterCheckout: CartItem[] = [];

            userCart.forEach((c) => {
                if (productCheckout.find((el) => el.id === c.id)) {
                    cartItemAfterCheckout.push(c);
                }
            });

            setCartProducts(cartItemAfterCheckout);

            const LIMIT_VNPAY_PAYMENT_PRICE = 20000000;
            if (paymentMethod === 'vnpay') {
                if (totalPice < 0 || totalPice > LIMIT_VNPAY_PAYMENT_PRICE) {
                    return Toast.show({
                        type: 'info',
                        text1:
                            'VNPAY chỉ hỗ trợ thanh toán trong khoảng 1 <= <=' +
                            formatPrice(LIMIT_VNPAY_PAYMENT_PRICE),
                    });
                }

                const paymentResponse =
                    (await orderApiRequest.createVnpayPayment(accessToken, {
                        amount: totalPice,
                    })) as { payment_url: string };
                setPaymentId(createOrderResponse.data.payment_id);
                router.navigate(paymentResponse?.payment_url as Href);
                return;
            }

            Toast.show({
                type: 'success',
                text1: createOrderResponse.message,
            });

            router.replace('/(root)/(tabs)/orders');
            return;
        }
    };

    return (
        <>
            <ScrollView className="">
                <TouchableOpacity
                    onPress={() => router.push('/(root)/edit-address' as Href)}
                >
                    <View className="mt-2 text-sm flex-col items-start border-b border-gray-200 bg-white p-2">
                        {userAddress ? (
                            <View className="flex-row justify-between items-center w-full">
                                <Image
                                    source={icons.point}
                                    className="w-8 h-8 ms-3"
                                />
                                <View>
                                    <View className="flex-row gap-2 whitespace-nowrap">
                                        <Text className="font-JakartaBold text-lg">
                                            {profile?.name
                                                ? profile.name
                                                : profile.email}
                                        </Text>
                                        <Text className="font-JakartaBold text-lg">
                                            {profile.phone}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="font-JakartaMedium text-gray-500">
                                            {userAddress.address}
                                        </Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="font-JakartaMedium text-gray-500">
                                            {userAddress.ward},{' '}
                                        </Text>
                                        <Text className="font-JakartaMedium text-gray-500">
                                            {userAddress.district},{' '}
                                        </Text>
                                        <Text className="font-JakartaMedium text-gray-500">
                                            {userAddress.province}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Image
                                        source={icons.chevronRight}
                                        className="w-6 h-6 text-gray-500"
                                        tintColor={'#6b7280'}
                                    />
                                </View>
                            </View>
                        ) : (
                            <Skeleton className="w-full h-[100px] mb-1" />
                        )}
                    </View>
                </TouchableOpacity>
                <View className="flex-col justify-between">
                    <View className="w-full mb-8">
                        <CheckoutTable />
                    </View>
                    <View className="w-full mb-4">
                        <View className="flex-col gap-2 rounded-md w-full">
                            <View className="bg-white px-4 py-6 gap-4">
                                <Text className="font-JakartaBold">
                                    Đơn vị vận chuyển
                                </Text>
                                <View className="flex-col gap-4">
                                    {deliveryList &&
                                        deliveryList.map((delivery) => (
                                            <Button
                                                disabled
                                                key={delivery.id}
                                                onPress={() => {
                                                    setSelectedDelivery(
                                                        delivery,
                                                    );
                                                }}
                                                label={delivery.name}
                                                labelClasses="capitalize font-JakartaMedium bg-black text-white px-5 py-3 min-w-[120px] rounded-md"
                                            />
                                        ))}
                                </View>
                            </View>
                            <View className="bg-white px-4 py-6 gap-4 capitalize">
                                <Text className="font-JakartaBold">
                                    Phương thức thanh toán
                                </Text>
                                <Button
                                    onPress={() => setPaymentMethod('cod')}
                                    label="Thanh toán khi nhận hàng"
                                    labelClasses={`${paymentMethod === 'cod' ? 'bg-black text-white' : 'text-black border'} font-JakartaMedium px-5 py-2 w-full rounded-md`}
                                />
                                <Button
                                    onPress={() => setPaymentMethod('vnpay')}
                                    label="Thanh toán qua VNPAY"
                                    labelClasses={`${paymentMethod === 'vnpay' ? 'bg-black text-white' : 'text-black border'} font-JakartaMedium px-5 py-2 w-full rounded-md`}
                                />
                            </View>
                            <View className="bg-white px-4 py-6 gap-4">
                                <Text className="font-JakartaBold">
                                    Tóm tắt yêu cầu
                                </Text>
                                <View className="flex-row items-center flex-wrap justify-between">
                                    <Text className="font-JakartaLight">
                                        Tổng phụ
                                    </Text>
                                    <Text className="font-JakartaLight text-[16px]">
                                        {formatPrice(productPrice)}
                                    </Text>
                                </View>
                                <View className="flex-row items-center flex-wrap justify-between">
                                    <Text className="font-JakartaLight">
                                        Vận chuyển
                                    </Text>
                                    <Text className="font-JakartaLight text-[16px]">
                                        {formatPrice(deliveryCost)}
                                    </Text>
                                </View>
                                <View className="flex-row items-center flex-wrap justify-between">
                                    <Text className="font-JakartaBold">
                                        Tổng
                                    </Text>
                                    <Text className="font-JakartaBold text-[16px]">
                                        {formatPrice(totalPice + deliveryCost)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className="fixed bottom-0 right-0 px-4 py-2 border-t border-gray-200 left-0 bg-white">
                <View className="flex-row items-center justify-between">
                    <Text className="font-JakartaBold">
                        Tổng
                        {productCheckout?.length > 1 && (
                            <>({productCheckout?.length} sản phẩm):</>
                        )}
                    </Text>
                    <Text className="ml-4 font-bold text-[16px] whitespace-nowrap">
                        {formatPrice(totalPice + deliveryCost)}
                    </Text>
                </View>
                <View className="mt-4">
                    {loading ? (
                        <View className="mt-4 flex-row justify-center font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                            <ActivityIndicator
                                size="small"
                                color="#fff"
                                className="mr-2 h-4 w-4 animate-spin"
                            />
                        </View>
                    ) : (
                        <Button
                            onPress={handlePayment}
                            label="Đặt hàng"
                            labelClasses="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] w-full rounded-md"
                        />
                    )}
                </View>
            </View>
        </>
    );
}
