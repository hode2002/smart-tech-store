import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { icons } from '@/constants';
import { useAuthStore, useUserStore } from '@/store';
import { CartItem, Delivery } from '@/types/type';
import { Href, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import orderApiRequest, {
    CalculateShippingFeeType,
    CreateOrderComboType,
    CreateOrderResponseType,
    CreateOrderType,
} from '@/lib/apiRequest/order';
import deliveryApiRequest from '@/lib/apiRequest/delivery';
import { DeliveryResponseType } from '@/schemaValidations/delivery.schema';
import Toast from 'react-native-toast-message';
import { formatPrice } from '@/lib/utils';
import CheckoutTable from '@/components/CheckoutTable';
import { ScrollView } from 'react-native';
import voucherApiRequest, {
    CheckValidVoucherResponseType,
    VoucherType,
} from '@/lib/apiRequest/voucher';

export default function Checkout() {
    const { proId, comboIds } = useLocalSearchParams();

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
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherList, setVoucherList] = useState<VoucherType[]>([]);

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

        const totalPrice = productPrice + deliveryCost;
        const LIMIT_VNPAY_PAYMENT_PRICE = 20000000;

        if (paymentMethod === 'vnpay') {
            if (totalPrice < 0 || totalPrice > LIMIT_VNPAY_PAYMENT_PRICE) {
                Toast.show({
                    type: 'success',
                    text1:
                        'VNPAY chỉ hỗ trợ thanh toán trong khoảng 1 <= <=' +
                        formatPrice(LIMIT_VNPAY_PAYMENT_PRICE),
                });
            }
            return setLoading(false);
        }

        const orderInfo = {
            voucherCodes: voucherList.map((i) => i.code),
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
            ...(proId && comboIds
                ? {
                      productOptionId: proId,
                      productComboIds: (comboIds as string)
                          ?.split(',')
                          .filter((i) => i.length > 0),
                  }
                : {
                      order_details: productCheckout.map((product) => ({
                          product_option_id: product.id,
                          quantity: product.quantity,
                      })),
                  }),
        };

        let createOrderResponse: CreateOrderResponseType;
        if (proId && comboIds) {
            createOrderResponse = (await orderApiRequest.createOrderCombo(
                accessToken,
                orderInfo as CreateOrderComboType,
            )) as CreateOrderResponseType;
        } else {
            createOrderResponse = (await orderApiRequest.createOrder(
                accessToken,
                orderInfo as CreateOrderType,
            )) as CreateOrderResponseType;
        }

        setLoading(false);
        if (createOrderResponse?.statusCode === 201) {
            const cartItemAfterCheckout: CartItem[] = [];

            userCart.forEach((c) => {
                if (productCheckout.find((el) => el.id === c.id)) {
                    cartItemAfterCheckout.push(c);
                }
            });

            setCartProducts(cartItemAfterCheckout);

            if (paymentMethod === 'vnpay') {
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

    const calculateOrderPrice = () => {
        return voucherList.reduce((prev, curr) => {
            if (curr.type === 'FIXED') {
                return (prev -= curr.value);
            }

            const percent = curr.value;
            return (prev -= (prev * percent) / 100);
        }, productPrice + deliveryCost);
    };

    const onApplyVoucherCode = async () => {
        if (voucherList.find((v) => v.code === voucherCode)) {
            return Toast.show({
                type: 'info',
                text1: 'Mã giảm giá đã được sử dụng!',
            });
        }

        const response = (await voucherApiRequest.checkValidVoucher(
            accessToken,
            voucherCode,
            productPrice,
        )) as CheckValidVoucherResponseType;

        if (response?.statusCode === 200) {
            setVoucherList((prev) => [...prev, response.data]);
            setVoucherCode('');
            Toast.show({
                type: 'success',
                text1: response.message,
            });
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
                            <View className="bg-white px-4 py-6 gap-4 capitalize">
                                <Text className="font-bold">Mã giảm giá</Text>
                                <View className="flex-row justify-end gap-4 flex-wrap">
                                    <TextInput
                                        inputMode="text"
                                        className="w-full border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                                        value={voucherCode}
                                        onChangeText={(value) =>
                                            setVoucherCode(value)
                                        }
                                    />
                                    <View>
                                        {loading ? (
                                            <View className="mt-2 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                                                <ActivityIndicator
                                                    size="small"
                                                    color="#fff"
                                                />
                                            </View>
                                        ) : (
                                            <Button
                                                onPress={onApplyVoucherCode}
                                                label="Áp dụng"
                                                labelClasses="font-JakartaBold text-white"
                                                className="mt-2 bg-black text-white min-w-[120px] rounded-md"
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>
                            <View className="bg-white px-4 py-6 gap-4 capitalize">
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
                                                labelClasses="capitalize font-JakartaMedium text-white"
                                                className="font-JakartaMedium bg-black w-full rounded-md"
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
                                    labelClasses={`${paymentMethod === 'cod' ? 'text-white' : 'text-black'}`}
                                    className={`${paymentMethod === 'cod' ? 'bg-black text-white' : 'text-black border'} font-JakartaMedium px-5 py-2 w-full rounded-md`}
                                />
                                <Button
                                    onPress={() => setPaymentMethod('vnpay')}
                                    label="Thanh toán qua VNPAY"
                                    labelClasses={`${paymentMethod === 'vnpay' ? 'text-white' : 'text-black'}`}
                                    className={`${paymentMethod === 'vnpay' ? 'bg-black text-white' : 'text-black border'} font-JakartaMedium px-5 py-2 w-full rounded-md`}
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
                                {voucherList && voucherList.length > 0 && (
                                    <>
                                        <View className="flex-row items-center flex-wrap justify-between">
                                            <Text className="font-JakartaBold">
                                                Tạm tính
                                            </Text>
                                            <Text className="font-JakartaBold text-[16px]">
                                                {formatPrice(
                                                    totalPice + deliveryCost,
                                                )}
                                            </Text>
                                        </View>
                                        <View className="py-8">
                                            <Text className="font-JakartaBold">
                                                Mã giảm giá
                                            </Text>
                                            {voucherList.map((item) => (
                                                <View
                                                    key={item.id}
                                                    className="flex-row items-center flex-wrap justify-between"
                                                >
                                                    <Text className="font-JakartaLight">
                                                        {item.code}
                                                    </Text>
                                                    <Text className="font-JakartaLight whitespace-nowrap">
                                                        {item.type ===
                                                        'FIXED' ? (
                                                            <>
                                                                {'-'}
                                                                {formatPrice(
                                                                    item.value,
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {'-'}
                                                                {formatPrice(
                                                                    (productPrice +
                                                                        deliveryCost) *
                                                                        (item.value /
                                                                            100),
                                                                )}
                                                            </>
                                                        )}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </>
                                )}
                                <View className="flex-row items-center flex-wrap justify-between">
                                    <Text className="font-JakartaBold">
                                        Tổng
                                    </Text>
                                    <Text className="font-JakartaBold text-[16px]">
                                        {formatPrice(calculateOrderPrice())}
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
                    <Text className="ml-4 font-JakartaBold text-[16px] whitespace-nowrap">
                        {formatPrice(calculateOrderPrice())}
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
                            labelClasses="capitalize font-JakartaBold text-white"
                            className="mt-4 bg-black min-w-[120px] w-full rounded-md"
                        />
                    )}
                </View>
            </View>
        </>
    );
}
