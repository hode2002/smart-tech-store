'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import CheckoutTable from '@/app/(user)/user/checkout/checkout-table';
import UserAddress from '@/app/(user)/user/checkout/user-address';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';
import orderApiRequest, {
    CalculateShippingFeeType,
    CreateOrderResponseType,
    CreateOrderType,
} from '@/apiRequests/order';
import { CartItem, setCartProducts, setPaymentId } from '@/lib/store/slices';

export default function CheckoutPage() {
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
            delivery_id: selectedDelivery.id,
            payment_method: paymentMethod,
            order_details: productCheckout.map((product) => ({
                product_option_id: product.id,
                quantity: product.quantity,
            })),
        };

        const createOrderResponse = (await orderApiRequest.createOrder(
            token,
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

            dispatch(setCartProducts(cartItemAfterCheckout));

            const LIMIT_VNPAY_PAYMENT_PRICE = 20000000;
            if (paymentMethod === 'vnpay') {
                if (totalPice < 0 || totalPice > LIMIT_VNPAY_PAYMENT_PRICE) {
                    return toast({
                        title: 'Success',
                        description:
                            'VNPAY chỉ hỗ trợ thanh toán trong khoảng 1 <= <=' +
                            formatPrice(LIMIT_VNPAY_PAYMENT_PRICE),
                    });
                }

                const paymentResponse =
                    (await orderApiRequest.createVnpayPayment(token, {
                        amount: totalPice,
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
                                <p>Đơn vị vận chuyển</p>
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
                                <p>Phương thức thanh toán</p>
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
                                <div className="flex items-center flex-wrap justify-between md:justify-end my-2">
                                    <p>
                                        Tổng tiền hàng
                                        <span className="whitespace-nowrap">
                                            ({productCheckout?.length} sản
                                            phẩm):
                                        </span>
                                    </p>
                                    <p className="ml-4 font-bold text-[16px] md:text-[24px] text-popover-foreground whitespace-nowrap">
                                        {formatPrice(productPrice)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between md:justify-end my-2">
                                    <p>Phí vận chuyển:</p>
                                    <p className="ml-4 font-bold text-[16px] md:text-[24px] text-popover-foreground whitespace-nowrap">
                                        {formatPrice(deliveryCost)}
                                    </p>
                                </div>

                                <div className="flex items-center flex-wrap justify-between md:justify-end my-2">
                                    <p>Tổng thanh toán:</p>
                                    <p className="ml-4 font-bold text-[16px] md:text-[24px] text-popover-foreground whitespace-nowrap">
                                        {formatPrice(totalPice + deliveryCost)}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center flex-wrap mt-6">
                                    <Link href={'/user/cart'}>
                                        <Button
                                            variant={'outline'}
                                            className="w-auto md:w-[180px] h-[40px]"
                                        >
                                            Quay lại
                                        </Button>
                                    </Link>

                                    {loading ? (
                                        <Button
                                            disabled
                                            className="w-auto md:w-[180px] h-[40px]"
                                        >
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={'default'}
                                            className="w-auto md:w-[180px] h-[40px]"
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
