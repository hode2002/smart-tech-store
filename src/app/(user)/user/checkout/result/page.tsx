'use client';

import orderApiRequest from '@/apiRequests/order';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { removePaymentId } from '@/lib/store/slices';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
export default function CheckoutSuccess() {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const paymentId = useAppSelector((state) => state.user.paymentId);
    const transactionId = searchParams.get('vnp_TransactionNo') as string;
    const result = searchParams.get('vnp_TransactionStatus') as string;

    useEffect(() => {
        if (!paymentId) {
            return router.push('/user/cart');
        }

        orderApiRequest
            .updateVnpayPaymentStatus(token, paymentId, transactionId)
            .then((response) => {
                if (response?.is_success) {
                }
                dispatch(removePaymentId());
            });
    }, [dispatch, token, paymentId, transactionId, router]);

    return (
        <div className="flex min-h-[100vh] justify-center items-center">
            <div className="flex flex-col gap-4">
                {result === '00' ? (
                    <>
                        <p className="text-center">Cảm ơn quý khách</p>
                        <div className="flex gap-4">
                            <Button>
                                <Link href={'/'}>Trở lại trang chủ</Link>
                            </Button>
                            <Button>
                                <Link href={'/user/purchase'}>
                                    Theo dõi đơn hàng
                                </Link>
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-center">Thanh toán thất bại</p>
                        <div className="flex gap-4">
                            <Button>
                                <Link href={'/'}>Trở lại trang chủ</Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
