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
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const keywords = searchParams.get('keywords');

    const [isCLient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        if (keywords) {
            productApiRequest
                .getProductsByKeyword(keywords)
                .then((response: ProductPaginationResponseType) => {
                    setProducts(response.data.products);
                });
        }
    }, [keywords]);

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
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="capitalize">
                                {keywords}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="my-8 flex">
                    <div className="w-full px-7 border-border bg-background">
                        <div className="w-full py-3">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-[20px]">
                                    Tìm thấy {products.length} kết quả với từ
                                    khóa {`"${keywords}"`}
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
