'use client';

import bannerImageApiRequest from '@/apiRequests/banner-images';
import { CarouselPlugin } from '@/components/carousel';
import {
    BannerImageResponseType,
    BannerImageType,
} from '@/schemaValidations/banner.schema';
import { Skeleton } from '@/components/ui/skeleton';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Banner() {
    const [isClient, setIsClient] = useState(false);

    const [bannerImages, setBannerImages] = useState<BannerImageType[]>([]);
    const [sideImages, setSideImages] = useState<BannerImageType[]>([]);
    const [carouselImages, setCarouselImages] = useState<BannerImageType[]>([]);

    useEffect(() => {
        setIsClient(true);

        bannerImageApiRequest
            .getImages()
            .then((response: BannerImageResponseType) =>
                setBannerImages(response.data),
            );
    }, []);

    useEffect(() => {
        setCarouselImages(bannerImages?.slice(1));
        setSideImages(bannerImages?.slice(bannerImages.length - 2));
    }, [bannerImages]);

    return (
        <div className="relative">
            {isClient && bannerImages?.[0] ? (
                <Link href={bannerImages[0]?.link ?? '#'}>
                    <Image
                        className="max-w-full lg:w-[1920px]"
                        src={bannerImages[0]?.image}
                        width={1000}
                        height={500}
                        quality={100}
                        title={bannerImages[0]?.title}
                        alt={bannerImages[0]?.title}
                    />
                </Link>
            ) : (
                <Skeleton className="w-full h-[425px] rounded-xl" />
            )}
            <div className="container">
                <div className="flex justify-around mt-[-5%]">
                    <CarouselPlugin items={carouselImages} />

                    <div className="hidden lg:flex flex-col gap-3">
                        {sideImages?.length ? (
                            sideImages.map((item) => (
                                <Link href={item?.link} key={item?.id}>
                                    <Image
                                        className="rounded-lg w-full lg:w-[400px]"
                                        src={item?.image}
                                        width={500}
                                        height={500}
                                        quality={100}
                                        alt={item?.title}
                                        title={item?.title}
                                    />
                                </Link>
                            ))
                        ) : (
                            <>
                                <Skeleton className="w-[400px] h-[115px] rounded-xl" />
                                <Skeleton className="w-[400px] h-[115px] rounded-xl" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
