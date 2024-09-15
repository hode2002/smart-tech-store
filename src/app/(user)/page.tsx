'use client';

import deliveryApiRequest from '@/apiRequests/delivery';
import SwiperBox from '@/components/home/swiper-box';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setDeliveryList } from '@/lib/store/slices/delivery-slice';
import { DeliveryResponseType } from '@/schemaValidations/delivery.schema';
import { useLayoutEffect, useState } from 'react';
import Banner from '@/components/banner';
import productApiRequest from '@/apiRequests/product';
import { GetProductsResponseType } from '@/schemaValidations/product.schema';
import {
    ProductType,
    setAccessToken,
    setAddress,
    setBrands,
    setCategories,
    setProductList,
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

export default function Home() {
    const dispatch = useAppDispatch();
    const cookies = useCookies();

    useLayoutEffect(() => {
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

    const [laptop, setLaptop] = useState<ProductType[]>([]);
    const [tablet, setTablet] = useState<ProductType[]>([]);
    const [smartphone, setSmartphone] = useState<ProductType[]>([]);
    const [productSale, setProductSale] = useState<ProductType[]>([]);

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
    }, [
        token,
        userAddress?.ward,
        dispatch,
        brands?.length,
        categories?.length,
        deliveryList?.length,
    ]);

    useLayoutEffect(() => {
        productApiRequest
            .getProductsByCategory('smartphone')
            .then((response: GetProductsResponseType) =>
                dispatch(setProductList(response.data)),
            );

        productApiRequest
            .getProductsByCategory('smartphone')
            .then((response: GetProductsResponseType) => {
                setSmartphone(response.data);
            });

        productApiRequest
            .getProductsByCategory('tablet')
            .then((response: GetProductsResponseType) =>
                setTablet(response.data),
            );

        productApiRequest
            .getProductsByCategory('laptop')
            .then((response: GetProductsResponseType) =>
                setLaptop(response.data),
            );

        productApiRequest
            .getProductsSale()
            .then((response: GetProductsResponseType) =>
                setProductSale(response.data),
            );
    }, [dispatch]);

    return (
        <>
            <Banner />
            <div className="md:container">
                <ProductBox
                    title="Gợi ý hôm nay"
                    products={productSale}
                    option="today"
                />

                <ProductBox title="Khuyến mãi hot" products={productSale} />

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
            </div>
            <SubizChat />
        </>
    );
}
