'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import CheckoutTable from '@/app/(user)/user/checkout/checkout-table';
import UserAddress from '@/app/(user)/user/checkout/user-address';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { formatPrice, notifyContentByStatus } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';
import orderApiRequest, {
    CalculateShippingFeeType,
    CreateOrderComboType,
    CreateOrderResponseType,
    CreateOrderType,
} from '@/apiRequests/order';
import {
    addNotification,
    CartItem,
    setCartProducts,
    setPaymentId,
} from '@/lib/store/slices';
import { Input } from '@/components/ui/input';
import voucherApiRequest, {
    CheckValidVoucherResponseType,
    VoucherType,
} from '@/apiRequests/voucher';
import notificationApiRequest, {
    CreateUserNotificationResponseType,
} from '@/apiRequests/notification';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const proId = searchParams.get('proId');
    const comboIds = searchParams.get('comboIds');

    const router = useRouter();
    const dispatch = useAppDispatch();
    const productCheckout = useAppSelector((state) => state.user.checkout);
    const deliveryList = useAppSelector((state) => state.delivery.deliveryList);
    const userCart = useAppSelector((state) => state.user.cart);
    const token = useAppSelector((state) => state.auth.accessToken);
    const [paymentMethod, setPaymentMethod] = useState<string>('cod');
    const profile = useAppSelector((state) => state.user.profile);
    const userAddress = useAppSelector((state) => state.user.address);
    const [loading, setLoading] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherList, setVoucherList] = useState<VoucherType[]>([]);

    useEffect(() => {
        if (token && productCheckout.length === 0) {
            return router.push('/user/cart');
        }
    }, [token, router, productCheckout.length]);

    useEffect(() => {
        if (token && productCheckout.length !== 0) {
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
                .calculateShippingFee(token, shippingInfo)
                .then((res) => {
                    if (res?.statusCode === 200) {
                        setDeliveryCost(res.data.fee);
                    }
                });
            return;
        }
    }, [
        token,
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

    const createNotification = async (
        images: string,
        userId: string,
        status: 0 | 1 | 2 | 3,
    ) => {
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

    const handlePayment = async () => {
        if (loading) return;
        setLoading(true);

        const totalPrice = productPrice + deliveryCost;
        const LIMIT_VNPAY_PAYMENT_PRICE = 20000000;

        if (paymentMethod === 'vnpay') {
            if (totalPrice < 0 || totalPrice > LIMIT_VNPAY_PAYMENT_PRICE) {
                toast({
                    title: 'Success',
                    description:
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
            delivery_id: selectedDelivery.id,
            payment_method: paymentMethod,
            ...(proId && comboIds
                ? {
                      productOptionId: proId,
                      productComboIds: comboIds
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
                token,
                orderInfo as CreateOrderComboType,
            )) as CreateOrderResponseType;
        } else {
            createOrderResponse = (await orderApiRequest.createOrder(
                token,
                orderInfo as CreateOrderType,
            )) as CreateOrderResponseType;
        }

        setLoading(false);
        if (createOrderResponse?.statusCode === 201) {
            const cartItemAfterCheckout: CartItem[] = [];

            userCart.forEach((c) => {
                if (productCheckout.find((el) => el.id !== c.id)) {
                    cartItemAfterCheckout.push(c);
                }
            });

            dispatch(setCartProducts(cartItemAfterCheckout));

            const jsonImages = JSON.stringify(
                createOrderResponse.data.order_details?.map(
                    (item) => item.product_option.thumbnail,
                ),
            );
            await createNotification(
                jsonImages,
                createOrderResponse.data.userId!,
                0,
            );

            if (paymentMethod === 'vnpay') {
                const paymentResponse =
                    (await orderApiRequest.createVnpayPayment(token, {
                        amount: totalPrice,
                    })) as { payment_url: string };
                dispatch(setPaymentId(createOrderResponse.data.payment_id));
                router.push(paymentResponse?.payment_url);
                return;
            }

            toast({
                title: 'Success',
                description: createOrderResponse.message,
            });

            router.push('/user/purchase');
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
        const response = (await voucherApiRequest.checkValidVoucher(
            token,
            voucherCode,
            productPrice,
        )) as CheckValidVoucherResponseType;

        if (response?.statusCode === 200) {
            setVoucherList((prev) => [...prev, response.data]);
            setVoucherCode('');
            toast({
                description: response.message,
            });
        }
    };

    return (
        productCheckout.length > 0 && (
            <div className="my-10">
                <UserAddress />

                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="w-full mb-8 lg:mb-0 lg:w-[65%] pr-4">
                        <CheckoutTable />
                    </div>
                    <div className="w-full lg:w-[34%] mb-4 md:mb-0">
                        <div className="border rounded-md bg-popover w-full">
                            <div className="border-b px-4 py-6 gap-4">
                                <p className="font-bold">Mã giảm giá</p>
                                <div className="flex flex-col justify-end md:flex-row gap-4 flex-wrap md:items-center mt-4 lg:mt-1">
                                    <Input
                                        value={voucherCode}
                                        onChange={(e) =>
                                            setVoucherCode(e.target.value)
                                        }
                                        type="text"
                                        autoComplete="off"
                                    />
                                    <Button onClick={onApplyVoucherCode}>
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>

                            <div className="border-b px-4 py-6 gap-4">
                                <p className="font-bold">Đơn vị vận chuyển</p>
                                <div className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center mt-4 lg:mt-1">
                                    {deliveryList &&
                                        deliveryList.map((delivery) => (
                                            <Button
                                                onClick={() =>
                                                    setSelectedDelivery(
                                                        delivery,
                                                    )
                                                }
                                                key={delivery.id}
                                                variant={'outline'}
                                                className={`${delivery.id === selectedDelivery.id ? 'border-popover-foreground' : ''} uppercase hover:border-popover-foreground`}
                                            >
                                                {delivery.name}
                                            </Button>
                                        ))}
                                </div>
                            </div>

                            <div className="border-b px-4 py-6 gap-4">
                                <p className="font-bold">
                                    Phương thức thanh toán
                                </p>
                                <div className="flex flex-col md:flex-row lg:items-center justify-center gap-4 flex-wrap mt-4 lg:mt-1">
                                    <Button
                                        onClick={() => setPaymentMethod('cod')}
                                        variant={'outline'}
                                        className={`${paymentMethod === 'cod' ? 'border-popover-foreground' : ''} w-full md:w-[48%] md:min-w-max hover:border-popover-foreground`}
                                    >
                                        Thanh toán khi nhận hàng
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setPaymentMethod('vnpay')
                                        }
                                        variant={'outline'}
                                        className={`${paymentMethod === 'vnpay' ? 'border-popover-foreground' : ''} w-full md:w-[48%] md:min-w-max hover:border-popover-foreground`}
                                    >
                                        Thanh toán qua VNPAY
                                    </Button>
                                </div>
                            </div>

                            <div className="py-4 px-6">
                                <div className="flex items-center flex-wrap justify-between my-2">
                                    <p>
                                        Tổng tiền hàng
                                        <span className="whitespace-nowrap">
                                            {' '}
                                            ({productCheckout?.length} sản
                                            phẩm):
                                        </span>
                                    </p>
                                    <p className="ml-4 text-[16px] md:text-[24px] text-popover-foreground whitespace-nowrap">
                                        {formatPrice(productPrice)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p>Phí vận chuyển:</p>
                                    <p className="text-[16px] md:text-[24px] text-popover-foreground whitespace-nowrap">
                                        {formatPrice(deliveryCost)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p>Tạm tính:</p>
                                    <p className="text-[16px] md:text-[24px] text-popover-foreground whitespace-nowrap">
                                        {formatPrice(
                                            productPrice + deliveryCost,
                                        )}
                                    </p>
                                </div>

                                {voucherList && voucherList.length > 0 && (
                                    <div className="py-8">
                                        <p className="font-semibold">
                                            Mã giảm giá
                                        </p>
                                        {voucherList.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between my-2"
                                            >
                                                <p>{item.code}</p>
                                                <p className="text-popover-foreground whitespace-nowrap">
                                                    {item.type === 'FIXED' ? (
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
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="my-4 flex text-md md:text-2xl items-center flex-wrap justify-between">
                                    <p className="font-bold">
                                        Tổng thanh toán:
                                    </p>
                                    <p className="font-bold text-[16px] md:text-[24px] text-popover-foreground whitespace-nowrap">
                                        {formatPrice(calculateOrderPrice())}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center flex-wrap mt-6">
                                    {!(proId && comboIds) && (
                                        <Link href={'/user/cart'}>
                                            <Button
                                                variant={'outline'}
                                                className="w-auto md:w-[180px] h-[40px]"
                                            >
                                                Quay lại
                                            </Button>
                                        </Link>
                                    )}
                                    {loading ? (
                                        <Button
                                            disabled
                                            className={
                                                `${proId && comboIds ? ' md:w-full' : ' md:w-[180px]'} ` +
                                                'w-auto h-[40px]'
                                            }
                                        >
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={'default'}
                                            className={
                                                `${proId && comboIds ? ' md:w-full' : ' md:w-[180px]'} ` +
                                                'w-auto h-[40px]'
                                            }
                                            onClick={handlePayment}
                                        >
                                            Xác nhận thanh toán
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
