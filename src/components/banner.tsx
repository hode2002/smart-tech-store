'use client';

import bannerImageApiRequest from '@/apiRequests/banner-images';
import { CarouselPlugin } from '@/components/carousel';
import { Skeleton } from '@/components/ui/skeleton';

import Image from 'next/image';
import Link from 'next/link';
import React, { useLayoutEffect, useState } from 'react';
import {
    BannersResponseType,
    FetchAllBannersResponseType,
} from '@/apiRequests/admin';

export default function Banner() {
    const [bigBanner, setBigBanner] = useState<BannersResponseType>();
    const [sideImages, setSideImages] = useState<BannersResponseType[]>([]);
    const [carouselImages, setCarouselImages] = useState<BannersResponseType[]>(
        [],
    );

    useLayoutEffect(() => {
        bannerImageApiRequest
            .getImages()
            .then((response: FetchAllBannersResponseType) => {
                const bannerImages = response.data;
                setBigBanner(
                    bannerImages?.find((image) => image.type === 'big'),
                );
                setCarouselImages(
                    bannerImages?.filter((image) => image.type === 'slide'),
                );
                setSideImages(
                    bannerImages?.filter((image) => image.type === 'side'),
                );
            });
    }, []);

    return (
        <div className="relative">
            {bigBanner ? (
                <Link href={bigBanner?.link ?? '#'}>
                    <Image
                        priority
                        src={bigBanner?.image}
                        width={1920}
                        height={1000}
                        quality={100}
                        title={bigBanner?.title}
                        alt={bigBanner?.title}
                        className="w-auto h-auto"
                    />
                </Link>
            ) : (
                <Skeleton className="w-full h-[425px] rounded-xl" />
            )}
            <div className="container">
                <div className="md:flex justify-around mt-2 md:mt-[-5%]">
                    <CarouselPlugin items={carouselImages} />

                    <div className="flex flex-col gap-3">
                        {sideImages?.length ? (
                            sideImages.map((item) => (
                                <Link href={item?.link} key={item?.id}>
                                    <Image
                                        priority
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
