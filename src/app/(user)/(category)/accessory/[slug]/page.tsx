'use client';

import React, { useState, useCallback, useLayoutEffect } from 'react';
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
import productApiRequest from '@/apiRequests/product';
import {
    ProductDetailType,
    GetProductDetailResponseType,
    ProductDescriptionType,
    TechnicalSpecsItem,
    RatingType,
    ReviewItem,
    ComboType,
    ProductOptionType,
} from '@/schemaValidations/product.schema';
import { Rating } from '@material-tailwind/react';
import ProductPromotion from '@/app/(user)/(category)/components/ProductPromotion';
import ProductTechnicalSpecs from '@/app/(user)/(category)/components/ProductTechnicalSpecs';
import ProductWarranty from '@/app/(user)/(category)/components/ProductWarranty';
import ProductDescription from '@/app/(user)/(category)/components/ProductDescription';
import ProductOptionCard from '@/app/(user)/(category)/components/ProductOptionCard';
import { Skeleton } from '@/components/ui/skeleton';
import ProductReviewOverview from '@/app/(user)/(category)/components/ProductReviewOverview';
import ProductComboCard from '@/app/(user)/(category)/components/ProductComboCard';

type Props = {
    params: { slug: string };
};

export default function AccessoryDetailPage({ params }: Props) {
    const fetchProduct = useCallback(async () => {
        const response = (await productApiRequest.getProductsBySlug(
            params.slug,
        )) as GetProductDetailResponseType;
        setProductInfo(response.data);
    }, [params.slug]);

    useLayoutEffect(() => {
        (async () => await fetchProduct())();
    }, [fetchProduct]);

    const [productInfo, setProductInfo] = useState<ProductDetailType>();
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
    const [selectedOptionObj, setSelectedOptionObj] = useState<
        { name: string; value: string; adjust_price: number }[]
    >([]);
    const warranties = productInfo?.warranties as string[];
    const promotions = productInfo?.promotions as string[];
    const descriptions = productInfo?.descriptions as ProductDescriptionType[];
    const technicalSpecs = productInfo?.product_options?.[selectedOptionIndex]
        ?.technical_specs as TechnicalSpecsItem[];
    const rating = productInfo?.product_options?.[selectedOptionIndex]
        ?.rating as RatingType;
    const reviews = productInfo?.product_options?.[selectedOptionIndex]
        ?.reviews as ReviewItem[];
    const combos = productInfo?.product_options?.[selectedOptionIndex]
        ?.combos as ComboType[];

    useLayoutEffect(() => {
        productInfo?.product_options?.forEach((item, index) => {
            if (item.slug === params.slug) {
                setSelectedOptionIndex(index);
                setSelectedOptionObj(item.options);
            }
        });
    }, [productInfo, params.slug]);

    const convertProductName = useCallback(() => {
        return (
            productInfo?.name +
            ' ' +
            productInfo?.product_options[selectedOptionIndex].sku.replaceAll(
                '-',
                ' ',
            )
        ).toLocaleLowerCase();
    }, [productInfo?.name, productInfo?.product_options, selectedOptionIndex]);

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
                        <Link className="underline" href="/accessory">
                            Phụ kiện
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {productInfo ? (
                            <BreadcrumbPage className="capitalize">
                                {convertProductName()}
                            </BreadcrumbPage>
                        ) : (
                            <BreadcrumbPage>
                                <Skeleton className="h-5 w-[200px] rounded-lg" />
                            </BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full flex flex-col md:flex-row md:gap-16 py-4 border-b-2 border-border bg-background">
                {productInfo ? (
                    <p className="font-bold text-[24px] capitalize">
                        {convertProductName()}
                    </p>
                ) : (
                    <Skeleton className="h-[36px] w-1/2 rounded-lg" />
                )}

                {rating && rating?.total_reviews !== 0 && (
                    <div className="flex justify-start items-center gap-2 mt-2 md:mt-0">
                        <span className="font-bold text-[24px]">
                            {rating.overall}
                        </span>
                        <div className="inline-flex items-center">
                            <Rating
                                value={Math.floor(rating.overall)}
                                readonly
                            />
                        </div>
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                            ({rating.total_reviews})
                        </p>
                    </div>
                )}
            </div>
            <div className="my-8 flex flex-col md:flex-row">
                <div className="w-full md:w-[60%] md:pr-4">
                    <Swiper
                        className="h-auto rounded-lg"
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                    >
                        {productInfo ? (
                            productInfo?.product_options[
                                selectedOptionIndex
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
                            })
                        ) : (
                            <SwiperSlide>
                                <Link href={'#'} className="h-full">
                                    <Skeleton className="h-[400px] w-[786px] rounded-lg" />
                                </Link>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
                <ProductOptionCard
                    productInfo={productInfo}
                    selectedOptionIndex={selectedOptionIndex}
                    selectedOptionObj={selectedOptionObj}
                    slug={params.slug}
                />
            </div>
            <div className="my-8 flex flex-col-reverse md:flex-row">
                <div className="w-full md:w-[60%] md:pr-4 h-full">
                    <ProductWarranty warranties={warranties} />
                    <div className="mt-4">
                        {productInfo ? (
                            <Image
                                src={productInfo?.main_image}
                                width={710}
                                height={533}
                                alt={convertProductName()}
                            />
                        ) : (
                            <Skeleton className="h-[533px] w-[710] rounded-lg" />
                        )}
                    </div>
                    {descriptions &&
                        descriptions?.length > 0 &&
                        descriptions?.every((e) => e.content.length) && (
                            <ProductDescription descriptions={descriptions} />
                        )}
                    {productInfo && (
                        <>
                            <ProductReviewOverview
                                convertProductName={convertProductName}
                                fetchProduct={fetchProduct}
                                product_option_id={
                                    productInfo?.product_options?.[
                                        selectedOptionIndex
                                    ].id
                                }
                                rating={rating}
                                reviews={reviews}
                            />
                        </>
                    )}
                </div>
                <div className="flex md:block flex-col-reverse w-full md:w-[40%] py-4 md:py-0 md:px-7">
                    <ProductPromotion promotions={promotions} />
                    <ProductTechnicalSpecs
                        convertProductName={convertProductName}
                        technicalSpecs={technicalSpecs}
                    />
                    {productInfo && combos && combos[0]?.product_combos && (
                        <ProductComboCard
                            mainProduct={
                                productInfo?.product_options?.[
                                    selectedOptionIndex
                                ] as ProductOptionType
                            }
                            originalPrice={productInfo?.price}
                            convertProductName={convertProductName}
                            combos={combos}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
