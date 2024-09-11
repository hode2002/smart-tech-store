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
import { Filter, ListFilter, Menu } from 'lucide-react';

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
export default function LaptopPage() {
    const [isCLient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    const [products, setProducts] = useState<ProductType[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        productApiRequest
            .getProductsByCategory('laptop')
            .then((response: GetProductsResponseType) => {
                setProducts(response.data);
            });
        brandApiRequest
            .getByCategoryName('laptop')
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
                id: 'pt=10',
                label: 'Dưới 10 triệu',
            },
            {
                id: 'pf=10&pt=15',
                label: 'Từ 10 - 15 triệu',
            },
            {
                id: 'pf=15&pt=20',
                label: 'Từ 15 - 20 triệu',
            },
            {
                id: 'pf=25',
                label: 'Trên 25 triệu',
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
                id: '4gb',
                label: '4 GB',
            },
            {
                id: '8gb',
                label: '8 GB',
            },
            {
                id: '16gb',
                label: '16 GB',
            },
            {
                id: '32gb',
                label: '32 GB',
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
        ],
        [brandsFilter, prices, operatingSystems, rams, roms],
    );

    const form = useForm<ProductFilterType>({
        resolver: zodResolver(ProductFilter),
        defaultValues: {
            brands: ['all'],
            prices: ['all'],
            operatingSystems: ['all'],
            rams: ['all'],
            roms: ['all'],
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
            'laptop',
            form.getValues(),
        )) as GetProductsResponseType;

        if (response?.statusCode === 200) {
            setProducts(response.data);
        }
    };

    const filterBy = (): string => {
        return Object.values(form.getValues())
            .reduce((items: string[], values: any) => {
                if (!values.includes('all')) {
                    const hasPriceFilter = values.some(
                        (v: string) => v.includes('pf') || v.includes('pt'),
                    );

                    if (hasPriceFilter) {
                        prices.forEach((p) => {
                            if (values.includes(p.id)) {
                                items.push(p.label);
                            }
                        });
                    } else {
                        items.push(...values);
                    }
                }
                return items;
            }, [])
            .join(',');
    };

    const handleClearFilter = () => {
        form.reset();
        productApiRequest
            .getProductsByCategory('laptop')
            .then((response: GetProductsResponseType) => {
                setProducts(response.data);
            });
    };

    return (
        isCLient && (
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
                            <BreadcrumbPage>Laptop</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Sheet key={'left'}>
                    <div className="my-8 flex">
                        <div className="w-0 md:w-[25%] md:pr-4">
                            <SheetTrigger
                                asChild
                                className="block md:hidden fixed left-8 bottom-8 py-2 bg-popover z-50 shadow-lg"
                            >
                                <Button
                                    variant="outline"
                                    className="flex items-center"
                                >
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={'left'}>
                                <ScrollArea className="h-full">
                                    <CheckboxMultiple
                                        form={form}
                                        handleFilterProduct={
                                            handleFilterProduct
                                        }
                                        productFilterBox={productFilterBox}
                                    />
                                </ScrollArea>
                            </SheetContent>

                            <div className="hidden md:block">
                                <div>
                                    <p className="flex items-center justify-between py-3 font-bold text-xl">
                                        <span className="flex items-center">
                                            <ListFilter className="mr-1" />
                                            Bộ lọc tìm kiếm
                                        </span>
                                    </p>
                                </div>

                                <CheckboxMultiple
                                    form={form}
                                    handleFilterProduct={handleFilterProduct}
                                    productFilterBox={productFilterBox}
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-[75%] px-0 md:px-7 border-0 md:border-l border-border bg-background">
                            <div className="w-full py-3">
                                <div className="flex gap-2 items-center">
                                    <h1 className="font-bold text-[28px] pb-2">
                                        Laptop
                                    </h1>
                                    <span className="opacity-90 font-semibold text-md">
                                        ({products?.length} sản phẩm)
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex flex-row flex-wrap gap-2">
                                        {Object.values(form.getValues()).some(
                                            (v) => !v.includes('all'),
                                        ) && (
                                            <div className="flex items-center gap-2">
                                                <p>Lọc theo:</p>
                                                <p className="font-bold capitalize">
                                                    {filterBy()}
                                                </p>
                                                <Button
                                                    variant={'link'}
                                                    className="text-red-500"
                                                    onClick={handleClearFilter}
                                                >
                                                    Xóa tất cả
                                                </Button>
                                            </div>
                                        )}
                                    </div>
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
                </Sheet>
            </div>
        )
    );
}
