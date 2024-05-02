'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    GetProductsResponseType,
    ProductFilter,
    ProductFilterType,
} from '@/schemaValidations/product.schema';

type FilterFieldType = { id: string; label: string };
import React, { useState, useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { CheckboxMultiple } from '@/app/(user)/(category)/checkbox-mutiple';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import CategoryProductList from '@/app/(user)/(category)/cate-product-list';
import { Brand, ProductType } from '@/lib/store/slices';
import productApiRequest from '@/apiRequests/product';
import brandApiRequest from '@/apiRequests/brand';
import { BrandResponseType } from '@/schemaValidations/brand.schema';

export default function SmartphonePage() {
    const [isCLient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    const [products, setProducts] = useState<ProductType[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        productApiRequest
            .getProductsByCategory('smartphone')
            .then((response: GetProductsResponseType) => {
                setProducts(response.data);
            });
        brandApiRequest
            .getBrands()
            .then((res: BrandResponseType) => setBrands(res.data));
    }, []);

    const brandsFilter: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            ...brands
                .map((brand) => ({ id: brand.slug, label: brand.name }))
                .reverse(),
        ],
        [brands],
    );
    const prices: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: 'pt=2',
                label: 'Dưới 2 triệu',
            },
            {
                id: 'pf=2&pt=4',
                label: 'Từ 2 - 4 triệu',
            },
            {
                id: 'pf=4&pt=7',
                label: 'Từ 4 - 7 triệu',
            },
            {
                id: 'pf=7&pt=13',
                label: 'Từ 7 - 13 triệu',
            },
            {
                id: 'pf=13',
                label: 'Trên 13 triệu',
            },
        ],
        [],
    );
    const operatingSystems: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: 'android',
                label: 'Android',
            },
            {
                id: 'ios',
                label: 'iOS (iPhone)',
            },
        ],
        [],
    );
    const rams: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: '2gb',
                label: '2 GB',
            },
            {
                id: '3gb',
                label: '3 GB',
            },
            {
                id: '4gb',
                label: '4 GB',
            },
            {
                id: '6gb',
                label: '6 GB',
            },
            {
                id: '8gb',
                label: '8 GB',
            },
            {
                id: '12gb',
                label: '12 GB',
            },
        ],
        [],
    );
    const roms: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: '32gb',
                label: '32 GB',
            },
            {
                id: '64gb',
                label: '64 GB',
            },
            {
                id: '128gb',
                label: '128 GB',
            },
            {
                id: '256gb',
                label: '256 GB',
            },
            {
                id: '512gb',
                label: '512 GB',
            },
            {
                id: '1tb',
                label: '1 TB',
            },
        ],
        [],
    );
    const specialFeatures: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: '5g',
                label: 'Hỗ trợ 5G',
            },
        ],
        [],
    );
    const charger: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: '20W',
                label: 'Sạc nhanh (từ 20W)',
            },
            {
                id: '40W',
                label: 'Sạc siêu nhanh (từ 40W)',
            },
        ],
        [],
    );
    const pin: Array<FilterFieldType> = useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: '3000 mAh',
                label: '3000 mAh',
            },
            {
                id: '4000 mAh',
                label: '4000 mAh',
            },
        ],
        [],
    );

    const productFilterBox = useMemo<
        Array<{
            name: string;
            label: string;
            items: Array<FilterFieldType>;
        }>
    >(
        () => [
            {
                name: 'brands',
                label: 'Hãng sản xuất',
                items: brandsFilter,
            },
            {
                name: 'prices',
                label: 'Mức giá',
                items: prices,
            },
            {
                name: 'operatingSystems',
                label: 'Loại điện thoại',
                items: operatingSystems,
            },
            {
                name: 'rams',
                label: 'RAM',
                items: rams,
            },
            {
                name: 'roms',
                label: 'Dung lượng lưu trữ',
                items: roms,
            },
            {
                name: 'specialFeatures',
                label: 'Tính năng đặc biệt',
                items: specialFeatures,
            },
            {
                name: 'charger',
                label: 'Tính năng sạc',
                items: charger,
            },
            {
                name: 'pin',
                label: 'Pin',
                items: pin,
            },
        ],
        [
            brandsFilter,
            prices,
            operatingSystems,
            rams,
            roms,
            specialFeatures,
            charger,
            pin,
        ],
    );

    const form = useForm<ProductFilterType>({
        resolver: zodResolver(ProductFilter),
        defaultValues: {
            brands: ['all'],
            prices: ['all'],
            operatingSystems: ['all'],
            rams: ['all'],
            roms: ['all'],
            specialFeatures: ['all'],
            charger: ['all'],
            pin: ['all'],
        },
    });

    const handleFilterProduct = async () => {
        const filterDataObj = form.getValues();
        const keys = Object.keys(filterDataObj);

        keys.forEach((key: string) => {
            let values = filterDataObj[key as keyof typeof filterDataObj];
            const target = values[values.length - 1] ?? 'all';
            if (target !== 'all') {
                if (key === 'prices') {
                    values = [target];
                } else {
                    values = values.filter((value) => value !== 'all');
                }
            } else {
                values = ['all'];
            }
            form.setValue(key as keyof typeof filterDataObj, values);
        });

        const response = (await productApiRequest.getProductsByUserFilter(
            'smartphone',
            form.getValues(),
        )) as GetProductsResponseType;

        if (response?.statusCode === 200) {
            setProducts(response.data);
        }
    };

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
                            <Link href="#">Danh mục</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Điện thoại</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="my-8 flex">
                    <div className="w-0 md:w-[25%] pr-4 ">
                        <Sheet key={'left'}>
                            <SheetTrigger
                                asChild
                                className="block md:hidden fixed left-8 bottom-8 py-2 bg-popover"
                            >
                                <Button
                                    variant="outline"
                                    className="flex items-center"
                                >
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={'left'}>
                                <ScrollArea className="h-full capitalize">
                                    <CheckboxMultiple
                                        form={form}
                                        handleFilterProduct={
                                            handleFilterProduct
                                        }
                                        productFilterBox={productFilterBox}
                                    />
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                        <div className="hidden md:block">
                            <CheckboxMultiple
                                form={form}
                                handleFilterProduct={handleFilterProduct}
                                productFilterBox={productFilterBox}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-[75%] px-7 border-0 md:border-l border-border bg-background">
                        <div className="w-full py-3">
                            <div className="flex gap-2 items-center">
                                <h1 className="font-bold text-[28px] pb-2">
                                    Điện thoại
                                </h1>
                                <span className="opacity-90 font-semibold text-md">
                                    ({products.length} sản phẩm)
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <p className="whitespace-nowrap">
                                        Lọc theo:
                                    </p>
                                    <div className="flex flex-wrap capitalize">
                                        <span className="me-1 font-bold">
                                            Samsung
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Select>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sắp xếp theo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
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
                            <CategoryProductList products={products} />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
