'use client';

import React, { useEffect } from 'react';
import deliveryApiRequest from '@/apiRequests/delivery';
import SwiperBox from '@/components/home/swiper-box';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setDeliveryList } from '@/lib/store/slices/delivery-slice';
import { DeliveryResponseType } from '@/schemaValidations/delivery.schema';
import { useLayoutEffect, useState } from 'react';
import Banner from '@/components/banner';
import productApiRequest from '@/apiRequests/product';
import {
    ProductType,
    setAccessToken,
    setAddress,
    setBrands,
    setCategories,
    setNotificationList,
    setProfile,
    setRefreshToken,
} from '@/lib/store/slices';
import categoryApiRequest from '@/apiRequests/category';
import { CategoryResponseType } from '@/schemaValidations/category.schema';
import brandApiRequest from '@/apiRequests/brand';
import { BrandResponseType } from '@/schemaValidations/brand.schema';
import ProductBox from '@/components/home/product-box';
import SubizChat from '@/components/subiz-chat';
import useScreen from '@/hooks/use-screen';
import accountApiRequest from '@/apiRequests/account';
import {
    GetProfileResponseType,
    UpdateAddressResponseType,
} from '@/schemaValidations/account.schema';
import { useCookies } from 'next-client-cookies';
import adminApiRequest, {
    FetchAllNewsResponseType,
    NewsResponseType,
} from '@/apiRequests/admin';
import Image from 'next/image';
import Link from 'next/link';
import notificationApiRequest, {
    GetUserNotificationResponseType,
} from '@/apiRequests/notification';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import moment from 'moment';

import { useQuery } from '@tanstack/react-query';

const fetchByCategory = async (slug: string) => {
    const res = await productApiRequest.getProductsByCategory(slug);
    return res.data;
};

const fetchProductSale = async () => {
    const res = await productApiRequest.getProductsSale();
    return res.data;
};

export default function Home() {
    const dispatch = useAppDispatch();
    const cookies = useCookies();

    useEffect(() => {
        const accessToken = cookies.get('accessToken');
        const refreshToken = cookies.get('refreshToken');
        if (accessToken && refreshToken) {
            accountApiRequest
                .getUserProfile(accessToken)
                .then((res: GetProfileResponseType) => {
                    if (res.statusCode === 200) {
                        dispatch(setAccessToken(accessToken));
                        dispatch(setRefreshToken(refreshToken));
                        dispatch(setProfile(res.data));
                        cookies.remove('accessToken');
                        cookies.remove('refreshToken');
                    }
                });
        }
    }, [cookies, dispatch]);

    const { isMobile, isDesktop } = useScreen();

    const deliveryList = useAppSelector((state) => state.delivery.deliveryList);
    const categories = useAppSelector((state) => state.category.categories);
    const brands = useAppSelector((state) => state.brand.brands);
    const token = useAppSelector((state) => state.auth.accessToken);
    const userAddress = useAppSelector((state) => state.user.address);

    const [news, setNews] = useState<NewsResponseType[]>([]);

    useLayoutEffect(() => {
        if (token && !userAddress?.ward) {
            accountApiRequest
                .getUserAddress(token)
                .then((response: UpdateAddressResponseType) => {
                    const userAddress = response?.data;
                    dispatch(setAddress(userAddress));
                });
        }
        if (deliveryList?.length === 0) {
            deliveryApiRequest
                .getDelivery()
                .then((response: DeliveryResponseType) =>
                    dispatch(setDeliveryList(response.data)),
                );
        }
        if (categories?.length === 0) {
            categoryApiRequest
                .getCategories()
                .then((response: CategoryResponseType) => {
                    dispatch(setCategories(response.data));
                });
        }
        if (brands?.length === 0) {
            brandApiRequest
                .getBrands()
                .then((response: BrandResponseType) =>
                    dispatch(setBrands(response.data)),
                );
        }
        adminApiRequest
            .getAllNews()
            .then((response: FetchAllNewsResponseType) =>
                setNews(response.data),
            );
        if (token) {
            notificationApiRequest
                .getUserNotification(token)
                .then((response: GetUserNotificationResponseType) => {
                    if (response?.data) {
                        dispatch(
                            setNotificationList(
                                response.data?.map((i) => ({
                                    ...i.notification,
                                    status: i.status,
                                })),
                            ),
                        );
                    }
                });
        }
    }, [
        token,
        userAddress?.ward,
        dispatch,
        brands?.length,
        categories?.length,
        deliveryList?.length,
    ]);

    const { data: productSale } = useQuery<ProductType[]>({
        queryKey: ['productSale'],
        queryFn: fetchProductSale,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const { data: smartphone } = useQuery({
        queryKey: ['smartphone'],
        queryFn: () => fetchByCategory('smartphone'),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const { data: laptop } = useQuery({
        queryKey: ['laptop'],
        queryFn: () => fetchByCategory('laptop'),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const { data: tablet } = useQuery({
        queryKey: ['tablet'],
        queryFn: () => fetchByCategory('tablet'),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return (
        <>
            <Banner />
            <div className="md:container">
                {productSale &&
                    productSale?.filter((product) =>
                        moment(product.created_at).isSame(
                            moment(new Date()),
                            'day',
                        ),
                    )?.length > 0 && (
                        <ProductBox
                            title="Gợi ý hôm nay"
                            products={productSale}
                            option="today"
                        />
                    )}
                <ProductBox
                    title="Khuyến mãi hot"
                    products={productSale as ProductType[]}
                />
                <div className="mx-2 md:mx-0">
                    <SwiperBox
                        title="Điện thoại"
                        link="/smartphone"
                        products={smartphone}
                        slidesPerView={isMobile ? 2 : 4}
                        spaceBetween={isDesktop ? 50 : 30}
                    />
                    <SwiperBox
                        title="Laptop"
                        link="/laptop"
                        products={laptop}
                        slidesPerView={isMobile ? 2 : 4}
                        spaceBetween={isDesktop ? 50 : 30}
                    />
                    <SwiperBox
                        title="Tablet"
                        link="/tablet"
                        products={tablet}
                        slidesPerView={isMobile ? 2 : 4}
                        spaceBetween={isDesktop ? 50 : 30}
                    />
                </div>
                <Card className="mb-8">
                    <CardHeader className="font-bold text-[26px] mb-4">
                        Bài tin
                    </CardHeader>
                    <CardContent className="flex items-start justify-start gap-4 flex-wrap">
                        {news &&
                            news.length > 0 &&
                            news.map((item) => (
                                <Link
                                    href={'/news/' + item.slug}
                                    key={item.id}
                                    className="w-[19%] flex flex-col justify-center gap-2 text-[14px]"
                                >
                                    <Image
                                        src={item.image}
                                        width={280}
                                        height={162}
                                        alt={item.slug}
                                        className="rounded-lg"
                                    />
                                    <p className="text-left">{item.title}</p>
                                </Link>
                            ))}
                    </CardContent>
                </Card>
            </div>
            <SubizChat />
        </>
    );
}
