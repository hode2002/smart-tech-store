'use client';

import Link from 'next/link';
import { Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import HomeProductCard from './home-product-card';
import { ProductType } from '@/lib/store/slices';
import ProductSkeletonCard from '@/components/home/product-skeleton-card';

type Props = {
    slidesPerView?: number;
    title: string;
    link: string;
    products: ProductType[];
};

export default function SwiperBox(props: Props) {
    const { title, link, products, slidesPerView = 4 } = props;
    return (
        <div className="rounded-md shadow-md bg-white dark:bg-secondary my-[10%]">
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
                    spaceBetween={50}
                    slidesPerView={slidesPerView}
                    scrollbar={{ draggable: true }}
                >
                    {products.map((product) => (
                        <SwiperSlide
                            key={product.id}
                            className="object-contain"
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
