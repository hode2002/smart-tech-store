'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import {
    ProductFilter,
    ProductFilterType,
} from '@/schemaValidations/product.schema';

type FilterFieldType = { id: string; label: string };
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { CheckboxMultiple } from '@/app/(category)/checkbox-mutiple';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ProductCard from '@/app/(category)/product-card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SmartphonePage() {
    const brands: Array<FilterFieldType> = React.useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: 'samsung',
                label: 'Samsung',
            },
            {
                id: 'ipad',
                label: 'iPad',
            },
            {
                id: 'lenovo',
                label: 'Lenovo',
            },
            {
                id: 'coolpad',
                label: 'Coolpad',
            },
            {
                id: 'nexta',
                label: 'Nexta',
            },
            {
                id: 'masstel',
                label: 'Masstel',
            },
            {
                id: 'oppo',
                label: 'Oppo',
            },
            {
                id: 'xiaomi',
                label: 'Xiaomi',
            },
        ],
        [],
    );
    const brandLogos = React.useMemo<Array<{ url: string; name: string }>>(
        () => [
            {
                name: 'ipad',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340494667486283_iPad-Apple@2x.jpg',
            },
            {
                name: 'samsung',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340490904217021_Samsung@2x.jpg',
            },
            {
                name: 'masstel',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340491898901930_Masstel@2x.jpg',
            },
            {
                name: 'lenovo',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/7/14/637618612858518848_Lenovo@2x.jpg',
            },
            {
                name: 'xiaomi',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/6/2/637582325361253577_Xiaomi@2x.jpg',
            },
            {
                name: 'coolpad',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/12/20/637756139395814464_Coolpad@2x.jpg',
            },
            {
                name: 'oppo',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/10/23/637390711269805103_Oppo@2x.jpg',
            },
            {
                name: 'nexta',
                url: 'https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/2/11/637801978381006714_Nexta@2x.jpg',
            },
        ],
        [],
    );
    const prices: Array<FilterFieldType> = React.useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: 'duoi-3-trieu',
                label: 'Dưới 3 triệu',
            },
            {
                id: 'tu-3-8-trieu',
                label: 'Từ 3 - 8 triệu',
            },
            {
                id: 'tu-8-15-trieu',
                label: 'Từ 8 - 15 triệu',
            },
            {
                id: 'tren-15-trieu',
                label: 'Trên 15 triệu',
            },
        ],
        [],
    );
    const screenSize: Array<FilterFieldType> = React.useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
            },
            {
                id: 'khoang-7-8-inch',
                label: 'Khoảng 7 - 8 inch',
            },
            {
                id: 'khoang-10-11-inch',
                label: 'Khoảng 10 - 11 inch',
            },
            {
                id: 'khoang-12-inch-tro-len',
                label: 'Khoảng 12 inch trở lên',
            },
        ],
        [],
    );
    const roms: Array<FilterFieldType> = React.useMemo(
        () => [
            {
                id: 'all',
                label: 'Tất cả',
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
        ],
        [],
    );

    const productFilterBox = React.useMemo<
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
                items: brands,
            },
            {
                name: 'prices',
                label: 'Mức giá',
                items: prices,
            },
            {
                name: 'screenSize',
                label: 'Loại điện thoại',
                items: screenSize,
            },
            {
                name: 'roms',
                label: 'Dung lượng lưu trữ',
                items: roms,
            },
        ],
        [brands, prices, screenSize, roms],
    );

    const form = useForm<ProductFilterType>({
        resolver: zodResolver(ProductFilter),
        defaultValues: {
            brands: ['all'],
            prices: ['all'],
            screenSize: ['all'],
            roms: ['all'],
        },
    });

    const onSubmit = (data: ProductFilterType) => {
        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    };

    return (
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
                        <BreadcrumbPage>Máy tính bảng</BreadcrumbPage>
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
                            <ScrollArea className="h-full">
                                <CheckboxMultiple
                                    form={form}
                                    onSubmit={onSubmit}
                                    productFilterBox={productFilterBox}
                                />
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                    <div className="hidden md:block">
                        <CheckboxMultiple
                            form={form}
                            onSubmit={onSubmit}
                            productFilterBox={productFilterBox}
                        />
                    </div>
                </div>

                <div className="w-full md:w-[75%] px-7 border-0 md:border-l border-border bg-background">
                    <div className="w-full h-[150px] mb-4 py-3">
                        <div className="flex gap-2 items-center">
                            <h1 className="font-bold text-[28px] pb-2">
                                Máy tính bảng
                            </h1>
                            <span className="opacity-90 font-semibold text-md">
                                (50 sản phẩm)
                            </span>
                        </div>
                        <div className="py-2 md:border-t border-border bg-background">
                            <Swiper
                                className="h-[65px] bg-white"
                                modules={[Scrollbar, A11y]}
                                spaceBetween={50}
                                slidesPerView={6}
                                scrollbar={{ draggable: true }}
                            >
                                {brandLogos &&
                                    brandLogos.map((brand) => {
                                        return (
                                            <SwiperSlide key={brand.name}>
                                                <Link
                                                    href={`/smartphone/${brand.name}`}
                                                    className="h-full"
                                                >
                                                    <Image
                                                        src={brand.url}
                                                        height={40}
                                                        width={108}
                                                        alt={brand.name}
                                                    />
                                                </Link>
                                            </SwiperSlide>
                                        );
                                    })}
                            </Swiper>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-4">
                            <div className="flex flex-col md:flex-row gap-2">
                                <p className="whitespace-nowrap">Lọc theo:</p>
                                <div>
                                    <span className="font-bold">Samsung, </span>
                                    <span className="font-bold">Samsung, </span>
                                    <span className="font-bold">Samsung</span>
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
                        <div className="my-5">
                            <div className="flex flex-wrap gap-4">
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
