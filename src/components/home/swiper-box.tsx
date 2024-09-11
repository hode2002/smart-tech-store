'use client';

import Link from 'next/link';
import { Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import HomeProductCard from './home-product-card';
import { ProductType } from '@/lib/store/slices';
import ProductSkeletonCard from '@/components/home/product-skeleton-card';

type Props = {
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    title: string;
    link: string;
    products: ProductType[];
    className?: string;
};

export default function SwiperBox(props: Props) {
    const {
        title,
        link,
        products,
        spaceBetween = 50,
        slidesPerView = 4,
        className,
    } = props;
    return (
        <div
            className={`rounded-md shadow-md bg-white dark:bg-secondary my-[15%] md:my-[10%] ${className}`}
        >
            <div className="flex shadow-lg justify-between items-center p-4 bg-primary w-full text-white dark:bg-gray-900 rounded-lg">
                <p className="capitalize text-[20px]">{title}</p>
                <Link
                    href={link}
                    className="hover:opacity-80 dark:hover:text-white hover:cursor-pointer"
                >
                    Xem tất cả
                </Link>
            </div>
            {products?.length > 0 ? (
                <Swiper
                    modules={[Scrollbar, A11y]}
                    spaceBetween={spaceBetween}
                    slidesPerView={slidesPerView}
                    scrollbar={{ draggable: true }}
                >
                    {products.map((product) => (
                        <SwiperSlide
                            key={product.id}
                            className="object-contain my-6"
                        >
                            <HomeProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="flex justify-between flex-wrap">
                    <ProductSkeletonCard />
                    <ProductSkeletonCard />
                    <ProductSkeletonCard />
                    <ProductSkeletonCard />
                </div>
            )}
        </div>
    );
}
