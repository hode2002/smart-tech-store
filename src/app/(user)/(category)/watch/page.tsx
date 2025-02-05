'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import CategoryProductList from '@/app/(user)/(category)/cate-product-list';
import { Brand, ProductType } from '@/lib/store/slices';
import productApiRequest from '@/apiRequests/product';
import brandApiRequest from '@/apiRequests/brand';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Scrollbar } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';

const fetchByCategory = async () => {
    const res = await productApiRequest.getProductsByCategory('watch');
    return res.data;
};

const fetchBrands = async () => {
    const res = await brandApiRequest.getByCategoryName('watch');
    return res.data;
};

export default function WatchPage() {
    const [sortedBy, setSortedBy] = useState<string>('new');
    const [selectedBrand, setSelectedBrand] = useState<string>('all');

    const { data: products = [] } = useQuery<ProductType[]>({
        queryKey: ['cate-watch'],
        queryFn: fetchByCategory,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const { data: brands = [] } = useQuery<Brand[]>({
        queryKey: ['brands-watch'],
        queryFn: fetchBrands,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const handleSelectedBrand = useCallback(
        (slug: string) => {
            setSelectedBrand(
                brands.some((e) => e.slug === slug) ? slug : 'all',
            );
        },
        [brands],
    );

    const filteredProducts = useMemo(
        () =>
            selectedBrand === 'all'
                ? products
                : products.filter((item) => item.brand.slug === selectedBrand),
        [products, selectedBrand],
    );

    return (
        <div className="bg-popover">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link className="underline" href="/">
                            Trang chủ
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Danh mục</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Đồng hồ đeo tay</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Sheet key={'left'}>
                <div className="my-8 flex">
                    <div className="w-full bg-background">
                        <div className="w-full py-3">
                            <div className="flex gap-2 items-center">
                                <h1 className="font-bold text-[28px] pb-2">
                                    Đồng hồ đeo tay
                                </h1>
                                <span className="opacity-90 font-semibold text-md">
                                    ({products.length} sản phẩm)
                                </span>
                            </div>
                        </div>
                        {products.length > 0 && (
                            <Card className="mb-8">
                                <CardHeader className="text-lg font-semibold">
                                    Thương hiệu hàng đầu
                                </CardHeader>
                                <CardContent className="p-0 gap-4 flex-wrap">
                                    <Swiper
                                        className="h-auto rounded-lg"
                                        modules={[Navigation, Scrollbar, A11y]}
                                        navigation
                                        scrollbar={{ draggable: true }}
                                        slidesPerView={10}
                                    >
                                        <SwiperSlide
                                            onClick={() =>
                                                setSelectedBrand('all')
                                            }
                                            className="cursor-pointer flex justify-center items-center p-2"
                                        >
                                            <p
                                                className={`${
                                                    selectedBrand === 'all'
                                                        ? 'border-red-400'
                                                        : ''
                                                } p-2 hover:border-red-400 border rounded-md flex justify-center items-center`}
                                            >
                                                Tất cả
                                            </p>
                                        </SwiperSlide>
                                        {brands.map((item) => (
                                            <SwiperSlide
                                                key={item.id}
                                                onClick={() =>
                                                    handleSelectedBrand(
                                                        item.slug,
                                                    )
                                                }
                                                className="cursor-pointer flex justify-center items-center p-2"
                                            >
                                                <div
                                                    className={`${
                                                        selectedBrand ===
                                                        item.slug
                                                            ? 'border-red-400'
                                                            : ''
                                                    } hover:border-red-400 border rounded-md flex justify-center items-center`}
                                                >
                                                    <Image
                                                        src={item.logo_url}
                                                        width={120}
                                                        height={40}
                                                        quality={100}
                                                        alt={item.slug}
                                                        className="rounded-lg p-2"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </CardContent>
                            </Card>
                        )}
                        <div>
                            <div className="flex flex-col-reverse md:flex-row justify-end md:items-center gap-4">
                                <div className="flex justify-between md:justify-end">
                                    <SheetTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className="flex md:hidden items-center gap-2"
                                        >
                                            <Filter />
                                            Lọc
                                            <strong className="number count-total hidden">
                                                0
                                            </strong>
                                        </Button>
                                    </SheetTrigger>
                                    <Select
                                        value={sortedBy}
                                        onValueChange={setSortedBy}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sắp xếp theo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Sắp xếp theo
                                                </SelectLabel>
                                                <SelectItem value="new">
                                                    Mới
                                                </SelectItem>
                                                <SelectItem value="discount">
                                                    % Giảm
                                                </SelectItem>
                                                <SelectItem value="decrease">
                                                    Giá cao đến thấp
                                                </SelectItem>
                                                <SelectItem value="increase">
                                                    Giá thấp đến cao
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <CategoryProductList products={filteredProducts} />
                        </div>
                    </div>
                </div>
            </Sheet>
        </div>
    );
}
