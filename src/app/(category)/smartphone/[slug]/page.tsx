'use client';

import React, { useState, useEffect, useMemo } from 'react';

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
import productApiRequest from '@/apiRequests/product';
import {
    ProductDetailType,
    GetProductDetailResponseType,
    ProductDescriptionType,
    TechnicalSpecsItem,
    Rating,
    ReviewItem,
    ProductOptionType,
} from '@/schemaValidations/product.schema';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/apiRequests/account';
import { setCartProducts } from '@/lib/store/slices';

export default function SmartphoneDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const currentProduct = useAppSelector(
        (state) => state.products.currentProduct,
    );
    const cartProducts = useAppSelector((state) => state.user.cart);

    useEffect(() => {
        productApiRequest
            .getProductsById(currentProduct.id)
            .then((response) => {
                const result = response as GetProductDetailResponseType;
                if (result?.statusCode == 200) {
                    setProductInfo(result.data);
                }
            });
    }, [currentProduct.id]);

    const [productInfo, setProductInfo] = useState<ProductDetailType>();
    const [selectedOption, setSelectedOption] = useState<number>(0);
    const [selectedProductOption, setSelectedProductOption] =
        useState<ProductOptionType>(
            productInfo?.product_options[selectedOption] as ProductOptionType,
        );

    const productImages = useMemo<Array<{ url: string; name: string }>>(
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

    const warranties = productInfo?.warranties as string[];

    const promotions = productInfo?.promotions as string[];

    const descriptions = productInfo?.descriptions as ProductDescriptionType[];

    const technicalSpecs = productInfo?.product_options?.[selectedOption]
        ?.technical_specs as TechnicalSpecsItem[];

    const rating = productInfo?.product_options?.[selectedOption]
        ?.rating as Rating;

    const reviews = productInfo?.product_options?.[selectedOption]
        ?.reviews as ReviewItem[];

    const convertProductName = () => {
        return (
            productInfo?.name +
            ' ' +
            productInfo?.product_options[selectedOption].sku.replaceAll(
                '-',
                ' ',
            )
        ).toLowerCase();
    };

    const handleAddToCart = async () => {
        if (!token) {
            toast({
                description: 'Vui lòng đăng nhập để tiếp tục',
                variant: 'default',
            });
            return router.push('/login');
        }

        const response = (await accountApiRequest.addToCart(token, {
            productOptionId: productInfo?.product_options[selectedOption]
                .id as string,
            quantity: 1,
        })) as AddToCartResponseType;

        if (response?.statusCode === 201) {
            const cartItems = cartProducts.filter(
                (p) =>
                    p.selected_option.id !== response.data.selected_option.id,
            );
            dispatch(setCartProducts([...cartItems, response.data]));
            toast({
                description: 'Thêm thành công',
                variant: 'default',
            });
        }
    };

    return (
        productInfo && (
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
                            <BreadcrumbPage className="capitalize">
                                {convertProductName()}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="w-full flex flex-col md:flex-row md:gap-16 py-4 border-b-2 border-border bg-background">
                    <p className="font-bold text-[24px] capitalize">
                        {convertProductName()}
                    </p>
                    {rating && rating?.total_reviews !== 0 && (
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
                    )}
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
                            {productInfo &&
                                productInfo?.product_options[
                                    selectedOption
                                ].product_images.map((item) => {
                                    return (
                                        <SwiperSlide key={item.id}>
                                            <Link href={'#'} className="h-full">
                                                <Image
                                                    className="rounded-lg"
                                                    src={item.image_url}
                                                    height={400}
                                                    width={786}
                                                    alt={item.image_alt_text}
                                                />
                                            </Link>
                                        </SwiperSlide>
                                    );
                                })}
                            {/* {productImages &&
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
                                })} */}
                        </Swiper>
                    </div>

                    <div className="w-full md:w-[40%] py-4 md:py-0 md:px-7 flex flex-col justify-between">
                        <div>
                            <div className="mb-10">
                                <p className="text-[#E83A45] font-bold text-[32px]">
                                    {formatPrice(
                                        productInfo.price -
                                        (productInfo.price *
                                            productInfo.product_options[
                                                selectedOption
                                            ].discount) /
                                        100 +
                                        productInfo.product_options[
                                            selectedOption
                                        ].price_modifier,
                                    )}
                                </p>

                                <p className="opacity-80 text-[20px]">
                                    {productInfo.product_options[selectedOption]
                                        .discount !== 0 && (
                                            <>
                                                <span className="line-through ">
                                                    {formatPrice(
                                                        productInfo.price +
                                                        productInfo
                                                            .product_options[
                                                            selectedOption
                                                        ].price_modifier,
                                                    )}
                                                </span>
                                                <span className="ml-2">
                                                    -
                                                    {
                                                        productInfo.product_options[
                                                            selectedOption
                                                        ].discount
                                                    }
                                                    %
                                                </span>
                                            </>
                                        )}
                                </p>
                            </div>

                            <div className="w-full">
                                {/* <div className="flex gap-2 items-center">
                                    <div className="flex gap-2">
                                        {productInfo?.product_options?.map(
                                            (productOption, index) => (
                                                <Button
                                                    key={index}
                                                    className="uppercase"
                                                    onClick={() =>
                                                        setSelectedOption(index)
                                                    }
                                                    variant={
                                                        index === selectedOption
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    {productOption.options
                                                        .filter(
                                                            (e) =>
                                                                e.name !==
                                                                'Màu sắc',
                                                        )
                                                        .map((el, elIdx) => {
                                                            return (
                                                                <span
                                                                    key={elIdx}
                                                                >
                                                                    {el.value}
                                                                </span>
                                                            );
                                                        })}
                                                </Button>
                                            ),
                                        )}
                                    </div>
                                </div> */}

                                <div className="flex gap-2 items-center my-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {productInfo?.product_options?.map(
                                            (productOption, index) => (
                                                <Button
                                                    key={index}
                                                    className="capitalize"
                                                    onClick={() =>
                                                        setSelectedOption(index)
                                                    }
                                                    variant={
                                                        index === selectedOption
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    {productOption.options
                                                        // .filter(
                                                        //     (e) =>
                                                        //         e.name !==
                                                        //         'Kích thước',
                                                        // )
                                                        .map((el, elIdx) => {
                                                            return (
                                                                <span
                                                                    className="capitalize mx-1 min-w-[80px]"
                                                                    key={elIdx}
                                                                >
                                                                    {el.value}
                                                                </span>
                                                            );
                                                        })}
                                                </Button>
                                            ),
                                        )}
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
                                onClick={handleAddToCart}
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
                                src={productInfo?.main_image}
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
                                    descriptions.map((description) => (
                                        <li
                                            key={description.id}
                                            className="py-4"
                                        >
                                            <p className="text-[20px] font-bold">
                                                {description.content}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div className="mt-8 border border-solid p-8 rounded-lg">
                            <p className="py-2 rounded-md text-[20px] font-bold capitalize">
                                Đánh giá {convertProductName()}
                            </p>

                            {rating && rating?.total_reviews !== 0 && (
                                <div>
                                    <div className="flex justify-start items-center gap-2">
                                        <span className="font-bold">
                                            {rating?.overall}
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
                                            ({rating?.total_reviews})
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
                                                                            review
                                                                                .user
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
                                                            <p>
                                                                {review.comment}
                                                            </p>
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
                                </div>
                            )}
                            <div className="mt-8 flex content-between">
                                <Button>Viết đánh giá</Button>
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
                            <p className="font-bold text-[20px] capitalize">
                                Cấu hình {convertProductName()}
                            </p>
                            <ul className="border border-solid mt-2 rounded-lg">
                                {technicalSpecs &&
                                    technicalSpecs.map((item, index) => (
                                        <li
                                            key={index}
                                            className="px-2 py-3 flex border-b text-[14px] capitalize"
                                        >
                                            <p className="w-[45%]">
                                                {item.name}:
                                            </p>
                                            <div className="px-2 w-[calc(50%)]">
                                                <span>{item.value}</span>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
