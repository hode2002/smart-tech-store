'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { BannerImageType } from '@/schemaValidations/banner.schema';

type Props = {
    items: BannerImageType[];
};

export function CarouselPlugin(props: Props) {
    const { items } = props;

    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-[700px] md:w-[800px] h-[150px] md:h-[257px]"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {items?.length > 0 ? (
                    items.map((item) => (
                        <CarouselItem key={item.id} className="pr-2 rounded-lg">
                            <Link href={item?.link}>
                                <Image
                                    src={item?.image}
                                    className="rounded-lg max-w-full lg:w-[800px]"
                                    height={1000}
                                    width={1000}
                                    quality={100}
                                    alt={item?.title}
                                    title={item?.title}
                                />
                            </Link>
                        </CarouselItem>
                    ))
                ) : (
                    <Skeleton className="w-full h-[235px] rounded-xl" />
                )}
            </CarouselContent>
            <CarouselPrevious className="hidden ml-8 md:flex justify-center items-center" />
            <CarouselNext className="hidden mr-8 md:flex justify-center items-center" />
        </Carousel>
    );
}
