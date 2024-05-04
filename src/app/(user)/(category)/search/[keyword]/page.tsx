'use client';

import React, { useState, useEffect } from 'react';
import CategoryProductList from '@/app/(user)/(category)/cate-product-list';
import { ProductType } from '@/lib/store/slices';
import productApiRequest from '@/apiRequests/product';
import { ProductPaginationResponseType } from '@/schemaValidations/product.schema';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function SearchPage({
    params,
}: {
    params: { keyword: string };
}) {
    const [isCLient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        productApiRequest
            .getProductsByKeyword(params.keyword)
            .then((response: ProductPaginationResponseType) => {
                setProducts(response.data.products);
            });
    }, [params.keyword]);

    return (
        isCLient && (
            <div className="py-2 bg-popover min-h-screen">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link className="underline" href="/">
                                Trang chủ
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <p>Tìm kiếm</p>
                        </BreadcrumbItem>
                        {/* <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="capitalize">
                                {params.keyword}
                            </BreadcrumbPage>
                        </BreadcrumbItem> */}
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="my-8 flex">
                    <div className="w-full px-7 border-border bg-background">
                        <div className="w-full py-3">
                            <div className="flex gap-2 items-center">
                                <p className="font-bold text-[20px] pb-2">
                                    Tìm thấy {products.length} kết quả
                                    {/* với từ
                                    khóa{' '}
                                    {`"${params.keyword.replaceAll('-', ' ')}"`} */}
                                </p>
                            </div>
                        </div>
                        <CategoryProductList products={products} />
                    </div>
                </div>
            </div>
        )
    );
}
