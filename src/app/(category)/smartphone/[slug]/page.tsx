'use client';

import * as React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Scrollbar, A11y, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BadgeCheck, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';

type TechnicalSpecsItem = { name: string; value: string };
type Rating = {
    total_reviews: number;
    details: Array<number>;
    overall: number;
};
type ReviewItem = {
    id: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        avatar: string;
    };
    star: number;
    comment: string;
    children: {
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
        comment: string;
        created_at: string;
    }[];
    created_at: string;
    _count: {
        children: number;
    };
};

export default function SmartphoneDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const productImages = React.useMemo<Array<{ url: string; name: string }>>(
        () => [
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/vi-vn-iphone-15-pro-max-4-1020x570.jpg',
            },
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/iphone-15-pro-max-256gb---10--1020x570.jpg',
            },
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/vi-vn-iphone-15-pro-max-256gb--(2).jpg',
            },
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/vi-vn-iphone-15-pro-max-256gb--(4).jpg',
            },
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/vi-vn-iphone-15-pro-max-256gb--(5).jpg',
            },
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/vi-vn-iphone-15-pro-max-256gb--(3).jpg',
            },
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/vi-vn-iphone-15-pro-max-256gb--(6).jpg',
            },
            {
                name: params.slug,
                url: 'https://cdn.tgdd.vn/Products/Images/42/305658/Slider/vi-vn-iphone-15-pro-max-256gb--(7).jpg',
            },
        ],
        [params.slug],
    );

    const warranties = React.useMemo<string[]>(
        () => [
            'Hư gì đổi nấy 12 tháng tại 3169 siêu thị toàn quốc (miễn phí tháng đầu)',
            'Bảo hành chính hãng điện thoại 1 năm tại các trung tâm bảo hành hãng',
            'Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Type C',
        ],
        [],
    );

    const promotions = React.useMemo<string[]>(
        () => [
            'Thu cũ Đổi mới: Giảm đến 2 triệu (Tuỳ model máy cũ, Không kèm thanh toán qua cổng online, mua kèm)',
            'Nhập mã MMTGDD123 giảm ngay 1% tối đa 100.000đ khi thanh toán qua MOMO',
            'Nhập mã VNPAYTGDD giảm từ 50,000đ đến 200,000đ (Áp dụng tùy giá trị đơn hàng) khi thanh toán qua VNPAY-QR',
        ],
        [],
    );

    const descriptions = React.useMemo<string[]>(
        () => [
            'iPhone 15 Pro Max là một chiếc điện thoại thông minh cao cấp được mong đợi nhất năm 2023.',
        ],
        [],
    );

    const technicalSpecs = React.useMemo<Array<TechnicalSpecsItem>>(
        () => [
            {
                name: 'Màn hình',
                value: 'OLED6.1"Super Retina XDR',
            },
            {
                name: 'Kích thước màn hình',
                value: '6 inch',
            },
            {
                name: 'Hệ điều hành',
                value: 'iOS 17',
            },
            {
                name: 'Camera trước',
                value: '12 MP',
            },
            {
                name: 'Camera sau',
                value: 'Chính 48 MP & Phụ 12 MP, 12 MP',
            },
            {
                name: 'chip',
                value: 'Apple A17 Pro 6 nhân',
            },
            {
                name: 'ram',
                value: '12GB',
            },
            {
                name: 'Dung lượng lưu trữ',
                value: '256GB',
            },
            {
                name: 'SIM',
                value: '1 Nano SIM & 1 eSIMHỗ trợ 5G',
            },
            {
                name: 'Pin, sạc',
                value: '3274 mAh, 20W',
            },
            {
                name: 'Cân nặng',
                value: '188 g',
            },
            {
                name: 'Kết nối',
                value: '5G',
            },
        ],
        [],
    );

    const rating = React.useMemo<Rating>(
        () => ({
            total_reviews: 1,
            details: [0, 0, 0, 0, 1, 0],
            overall: 4,
        }),
        [],
    );

    const reviews = React.useMemo<Array<ReviewItem>>(
        () => [
            {
                id: '3ff3eda6-9195-40a3-8bde-50d73542c264',
                user: {
                    id: 'f0caf963-330b-449e-aa49-0ba31123f03a',
                    email: '54dhvd@gmail.com',
                    name: null,
                    avatar: 'https://ct466-project.s3.ap-southeast-2.amazonaws.com/default.jpg',
                },
                star: 4,
                comment: 'Nhanh nóng máy',
                children: [
                    {
                        user: {
                            id: '0ecab38e-a558-4e95-8b27-f94efddf3bbc',
                            email: 'admin@gmail.com',
                            name: 'Hồ Văn Dễ',
                            avatar: 'https://ct466-project.s3.ap-southeast-2.amazonaws.com/default.jpg',
                        },
                        comment:
                            'Bạn vui lòng liên hệ bộ phận CSKH để được hỗ trợ nhé.',
                        created_at: '2024-03-05T08:16:21.945Z',
                    },
                ],
                created_at: '2024-03-05T08:15:33.507Z',
                _count: {
                    children: 1,
                },
            },
        ],
        [],
    );

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
                        <Link className="underline" href="/smartphone">
                            Điện thoại
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Điện thoại iPhone 15 Pro Max 256GB
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full flex flex-col md:flex-row md:gap-16 py-4 border-b-2 border-border bg-background">
                <p className="font-bold text-[24px]">
                    Điện thoại iPhone 15 Pro Max 256GB
                </p>
                <div className="flex justify-start items-center gap-2">
                    <span className="font-bold text-[24px]">
                        {rating.overall}
                    </span>
                    <div className="inline-flex items-center">
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </span>
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </span>
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </span>
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </span>
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-gray-500 cursor-pointer"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </span>
                    </div>
                    <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                        ({rating.total_reviews})
                    </p>
                </div>
            </div>

            <div className="my-8 flex flex-col md:flex-row">
                <div className="w-full md:w-[60%] md:pr-4 h-full">
                    <Swiper
                        className="h-auto rounded-lg"
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                    >
                        {productImages &&
                            productImages.map((item) => {
                                return (
                                    <SwiperSlide key={item.url}>
                                        <Link
                                            href={`/smartphone/${item.name}`}
                                            className="h-full"
                                        >
                                            <Image
                                                className="rounded-lg"
                                                src={item.url}
                                                height={400}
                                                width={786}
                                                alt={item.name}
                                            />
                                        </Link>
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>

                <div className="w-full md:w-[40%] py-4 md:py-0 md:px-7 flex flex-col justify-between">
                    <div>
                        <div className="mb-10">
                            <p className="text-[#E83A45] font-bold text-[32px]">
                                41.500.000 đ
                            </p>
                            <p className="opacity-80 text-[20px]">
                                <span className="line-through ">
                                    44.500.000
                                </span>
                                đ<span> -5%</span>
                            </p>
                        </div>

                        <div className="w-full">
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-2">
                                    <Button className="">128GB</Button>
                                    <Button variant={'outline'}>256GB</Button>
                                    <Button variant={'outline'}>512GB</Button>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center my-4">
                                <div className="flex gap-2 flex-wrap">
                                    <Button className="">Titan xanh</Button>
                                    <Button variant={'outline'}>
                                        Titan đen
                                    </Button>
                                    <Button variant={'outline'}>
                                        Titan tự nhiên
                                    </Button>
                                    <Button variant={'outline'}>
                                        Titan trắng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            variant={'destructive'}
                            className="w-full px-5 py-8 mb-2 dark:bg-primary dark:text-primary-foreground"
                        >
                            Mua ngay
                        </Button>
                        <Button
                            variant={'outline'}
                            className="w-full px-5 py-8 bg-primary text-primary-foreground"
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            </div>

            <div className="my-8 flex flex-col-reverse md:flex-row">
                <div className="w-full md:w-[60%] md:pr-4 h-full">
                    <div className="flex items-center justify-center rounded-lg border border-solid">
                        <ul className="block md:flex flex-wrap">
                            {warranties &&
                                warranties.map((warranty, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="p-4 flex w-full md:w-[50%] items-start gap-4"
                                        >
                                            <ShieldCheck
                                                color="#2ac050"
                                                className="w-[40px]"
                                            />
                                            <p className="w-[90%]">
                                                {warranty}
                                            </p>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>

                    <div className="mt-4">
                        <Image
                            src={
                                'https://cdn.tgdd.vn/Products/Images/42/289705/Kit/iphone-14-pro-max-note-new.jpg'
                            }
                            width={710}
                            height={533}
                            alt="Điện thoại iPhone 14 Pro Max 1TB"
                        />
                    </div>

                    <div className="mt-8">
                        <p className="text-[20px] font-bold">
                            Thông tin sản phẩm
                        </p>
                        <ul>
                            {descriptions &&
                                descriptions.map((description, index) => (
                                    <li key={index} className="py-4">
                                        <p className="text-[20px] font-bold">
                                            {description}
                                        </p>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="mt-8 border border-solid p-8 rounded-lg">
                        <p className="py-2 rounded-md text-[20px] font-bold">
                            Đánh giá Điện thoại iPhone 14 Pro Max 1TB
                        </p>
                        <div>
                            <div className="flex justify-start items-center gap-2">
                                <span className="font-bold">
                                    {rating.overall}
                                </span>
                                <div className="inline-flex items-center">
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-[#ff9f00] cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-gray-500 cursor-pointer"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                </div>
                                <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                                    ({rating.total_reviews})
                                </p>
                            </div>

                            <ul className="mt-8">
                                {rating?.total_reviews &&
                                    rating.details
                                        .map((star, index) => {
                                            if (index === 0) return;
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center mt-4"
                                                >
                                                    <span className="font-medium flex gap-1 items-center">
                                                        {index}
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4 text-[#000] cursor-pointer"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                        <div
                                                            className={`h-2 bg-[#ff9f00] rounded ${star === 0 ? 'w-0' : `w-[${(Number(star / rating.total_reviews) * 1) / 100}%]`}`}
                                                        ></div>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        <span>
                                                            {Number(
                                                                star /
                                                                    rating.total_reviews,
                                                            ) * 100}
                                                        </span>
                                                        <span>%</span>
                                                    </p>
                                                </div>
                                            );
                                        })
                                        .reverse()}
                            </ul>

                            <ul className="mt-8">
                                {reviews &&
                                    reviews.map((review) => {
                                        return (
                                            <li
                                                key={review.id}
                                                className="py-4 border-y"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-2 items-center">
                                                        <Avatar>
                                                            <AvatarImage src="https://ct466-project.s3.ap-southeast-2.amazonaws.com/default.jpg" />
                                                            <AvatarFallback>
                                                                avatar
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <p className="flex flex-col md:flex-row">
                                                            <span className="font-bold mr-4">
                                                                {
                                                                    review.user
                                                                        .email
                                                                }
                                                            </span>
                                                            <span>
                                                                {moment(
                                                                    review.created_at,
                                                                ).format(
                                                                    'DD-MM-YYYY',
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-2 inline-flex items-center">
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4 text-[#ff9f00] cursor-pointer"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4 text-[#ff9f00] cursor-pointer"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4 text-[#ff9f00] cursor-pointer"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4 text-[#ff9f00] cursor-pointer"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-4 h-4 text-gray-500 cursor-pointer"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex gap-4">
                                                    <p>{review.comment}</p>
                                                    <MessageSquareQuote />
                                                </div>

                                                {review?.children &&
                                                    review.children.map(
                                                        (child) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        child.created_at
                                                                    }
                                                                    className="ms-6 mt-4"
                                                                >
                                                                    <div className="flex gap-2 items-center">
                                                                        <Avatar>
                                                                            <AvatarImage src="https://ct466-project.s3.ap-southeast-2.amazonaws.com/default.jpg" />
                                                                            <AvatarFallback>
                                                                                avatar
                                                                            </AvatarFallback>
                                                                        </Avatar>

                                                                        <p className="flex flex-col md:flex-row">
                                                                            <span className="font-bold mr-4">
                                                                                {
                                                                                    child
                                                                                        .user
                                                                                        .email
                                                                                }
                                                                            </span>
                                                                            <span>
                                                                                {moment(
                                                                                    child.created_at,
                                                                                ).format(
                                                                                    'DD-MM-YYYY',
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                    </div>

                                                                    <div className="mt-1">
                                                                        <p className="cmt-txt">
                                                                            {
                                                                                child.comment
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                            </li>
                                        );
                                    })}
                            </ul>

                            <div className="mt-8 flex content-between">
                                <Button>Viết đánh giá</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-[40%] py-4 md:py-0 md:px-7">
                    <div>
                        <p className="border border-solid p-2 rounded-t-lg">
                            Khuyến mãi
                        </p>
                        <ul className="border border-solid rounded-b-lg">
                            {promotions &&
                                promotions.map((promotion, index) => (
                                    <li
                                        key={index}
                                        className="p-4 flex items-start gap-4"
                                    >
                                        <BadgeCheck
                                            color="#2ac050"
                                            className="w-[40px]"
                                        />
                                        <p className="text-sm w-[90%]">
                                            {promotion}
                                        </p>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="mt-8">
                        <p className="font-bold text-[20px]">
                            Cấu hình Điện thoại iPhone 14 Pro Max 1TB
                        </p>
                        <ul className="border border-solid mt-2 rounded-lg">
                            {technicalSpecs &&
                                technicalSpecs.map((item, index) => (
                                    <li
                                        key={index}
                                        className="px-2 py-3 flex border-b text-[14px] capitalize"
                                    >
                                        <p className="w-[160px]">
                                            {item.name}:
                                        </p>
                                        <div className="px-2 w-[calc(100% - 176px)]">
                                            <span>{item.value}</span>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
