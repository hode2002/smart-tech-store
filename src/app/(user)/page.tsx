'use client';

import deliveryApiRequest from '@/apiRequests/delivery';
import SwiperBox from '@/components/home/swiper-box';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setDeliveryList } from '@/lib/store/slices/delivery-slice';
import { DeliveryResponseType } from '@/schemaValidations/delivery.schema';
import { useEffect, useState } from 'react';
import Banner from '@/components/banner';
import productApiRequest from '@/apiRequests/product';
import { GetProductsResponseType } from '@/schemaValidations/product.schema';
import {
    ProductType,
    setBrands,
    setCategories,
    setProductList,
} from '@/lib/store/slices';
import categoryApiRequest from '@/apiRequests/category';
import { CategoryResponseType } from '@/schemaValidations/category.schema';
import brandApiRequest from '@/apiRequests/brand';
import { BrandResponseType } from '@/schemaValidations/brand.schema';
import ProductBox from '@/components/home/product-box';

export default function Home() {
    const dispatch = useAppDispatch();
    const deliveryList = useAppSelector((state) => state.delivery.deliveryList);
    const categories = useAppSelector((state) => state.category.categories);
    const brands = useAppSelector((state) => state.brand.brands);
    const productList = useAppSelector((state) => state.products.products);

    const [laptop, setLaptop] = useState<ProductType[]>([]);
    const [tablet, setTablet] = useState<ProductType[]>([]);
    const [smartphone, setSmartphone] = useState<ProductType[]>([]);
    const [productBrand, setProductBrand] = useState<ProductType[]>([]);
    const [productSale, setProductSale] = useState<ProductType[]>([]);

    useEffect(() => {
        if (deliveryList.length < 1) {
            deliveryApiRequest
                .getDelivery()
                .then((response: DeliveryResponseType) =>
                    dispatch(setDeliveryList(response.data)),
                );
        }

        if (categories.length < 1) {
            categoryApiRequest
                .getCategories()
                .then((response: CategoryResponseType) =>
                    dispatch(setCategories(response.data)),
                );
        }

        if (brands.length < 1) {
            brandApiRequest
                .getBrands()
                .then((response: BrandResponseType) =>
                    dispatch(setBrands(response.data)),
                );
        }
    }, [dispatch]);

    useEffect(() => {
        // productApiRequest
        //     .getProducts()
        //     .then((response: ProductPaginationResponseType) =>
        //         dispatch(setProductList(response.data.products)),
        //     );

        productApiRequest
            .getProductsByCategory('smartphone')
            .then((response: GetProductsResponseType) =>
                dispatch(setProductList(response.data)),
            );

        // productApiRequest
        //     .getProductsSale()
        //     .then((response: GetProductsResponseType) =>
        //         setProductSale(response.data.products),
        //     );

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

        // productApiRequest
        //     .getProductsByBrand('iphone')
        //     .then((response: GetProductsResponseType) =>
        //         setProductBrand(response.data),
        //     );
    }, []);
    return (
        <>
            <Banner />
            <div className="container">
                <ProductBox title="Khuyến mãi hot" products={productSale} />

                <div>
                    <SwiperBox
                        title="Điện thoại"
                        link="/smartphone"
                        products={smartphone}
                    />
                    <SwiperBox
                        title="Laptop"
                        link="/laptop"
                        products={laptop}
                    />
                    <SwiperBox
                        title="Tablet"
                        link="/tablet"
                        products={tablet}
                    />
                </div>

                <ProductBox
                    title="Gợi ý hôm nay"
                    products={productSale}
                    option="today"
                />
            </div>
        </>
    );
}
