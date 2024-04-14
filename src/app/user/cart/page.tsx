'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import CartTable from '@/app/user/cart/cart-table';
import ProductBox from '@/components/home/product-box';
import productApiRequest from '@/apiRequests/product';
import { GetProductsResponseType } from '@/schemaValidations/product.schema';
import { ProductType, setAddress } from '@/lib/store/slices';
import accountApiRequest from '@/apiRequests/account';
import { UpdateAddressResponseType } from '@/schemaValidations/account.schema';
import { useAppDispatch, useAppSelector } from '@/lib/store';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.accessToken);
    const userAddress = useAppSelector((state) => state.user.address);
    const [isClient, setIsClient] = useState(false);
    const [productSale, setProductSale] = useState<ProductType[]>([]);

    useEffect(() => {
        setIsClient(true);

        productApiRequest
            .getProductsSale()
            .then((response: GetProductsResponseType) =>
                setProductSale(response?.data),
            );

        if (token && !userAddress?.ward) {
            accountApiRequest
                .getUserAddress(token)
                .then((response: UpdateAddressResponseType) =>
                    dispatch(setAddress(response?.data)),
                );
        }
    }, [token, dispatch, userAddress?.ward]);

    return (
        <div>
            <div className="flex items-center gap-4 py-4">
                <p className="font-bold text-[32px] flex gap-2 items-center">
                    <ShoppingBag />
                    <span>Giỏ hàng</span>
                </p>
            </div>

            {isClient && <CartTable />}

            <ProductBox title="Có thể bạn cũng thích" products={productSale} />
        </div>
    );
}
