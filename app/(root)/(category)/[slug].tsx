import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
    ProductDetailType,
    GetProductDetailResponseType,
    ProductDescriptionType,
    TechnicalSpecsItem,
    RatingType,
    ReviewItem,
    ProductOptionType,
    ComboType,
} from '@/schemaValidations/product.schema';
import ProductOptionCard from '@/app/(root)/(category)/components/ProductOptionCard';
import ProductWarranty from '@/app/(root)/(category)/components/ProductWarranty';
import ProductDescription from '@/app/(root)/(category)/components/ProductDescription';
import ProductReviewOverview from '@/app/(root)/(category)/components/ProductReviewOverview';
import ProductPromotion from '@/app/(root)/(category)/components/ProductPromotion';
import ProductTechnicalSpecs from '@/app/(root)/(category)/components/ProductTechnicalSpecs';
import ProductComboCard from '@/app/(root)/(category)/components/ProductComboCard';
import { Skeleton } from '@/components/Skeleton';
import { Image, Text, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import productApiRequest from '@/lib/apiRequest/product';
import Swiper from 'react-native-swiper';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';

export default function ProductDetailPage() {
    const { slug } = useLocalSearchParams();

    const fetchProduct = useCallback(async () => {
        const response = (await productApiRequest.getProductsBySlug(
            slug as string,
        )) as GetProductDetailResponseType;
        setProductInfo(response.data);
    }, [slug]);

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
            if (item.slug === slug) {
                setSelectedOptionIndex(index);
                setSelectedOptionObj(item.options);
            }
        });
    }, [productInfo, slug]);

    const convertProductName = () => {
        return (
            productInfo?.name +
            ' ' +
            productInfo?.product_options[selectedOptionIndex].sku.replaceAll(
                '-',
                ' ',
            )
        ).toLocaleLowerCase();
    };

    return (
        productInfo && (
            <ScrollView>
                <Swiper
                    className="h-[200px] pt-2 bg-white"
                    loop={true}
                    autoplay={true}
                >
                    {productInfo ? (
                        productInfo?.product_options[
                            selectedOptionIndex
                        ].product_images.map((item) => (
                            <View key={item.id}>
                                <Image
                                    source={{ uri: item.image_url }}
                                    height={200}
                                    alt={item.image_alt_text}
                                    resizeMode={'contain'}
                                />
                            </View>
                        ))
                    ) : (
                        <Skeleton className="h-[200px] rounded-lg" />
                    )}
                </Swiper>
                <View className="p-2 w-full flex-col py-4 border-b-2 border-border bg-white">
                    {productInfo ? (
                        <Text className="text-black font-JakartaBold text-[24px] capitalize">
                            {convertProductName()}
                        </Text>
                    ) : (
                        <Skeleton className="h-[36px] w-1/2 rounded-lg" />
                    )}
                    {rating && rating?.total_reviews !== 0 && (
                        <View className="flex-row justify-start items-center mt-2">
                            <Text className="font-bold text-[20px]">
                                {rating.overall}
                            </Text>
                            <View className="inline-flex items-center">
                                <Text>
                                    <StarRatingDisplay
                                        starSize={20}
                                        rating={Math.floor(rating.overall)}
                                    />
                                </Text>
                            </View>
                            <Text className="block text-base antialiased font-medium leading-relaxed text-gray-500">
                                ({rating.total_reviews})
                            </Text>
                        </View>
                    )}
                </View>
                <ProductOptionCard
                    productInfo={productInfo}
                    selectedOptionIndex={selectedOptionIndex}
                    selectedOptionObj={selectedOptionObj}
                    slug={slug as string}
                />
                <View className="flex-col-reverse bg-white p-2">
                    <View className="bg-white">
                        <ProductWarranty warranties={warranties} />
                        <View className="mt-4 bg-white">
                            {productInfo ? (
                                <Image
                                    source={{
                                        uri: productInfo?.main_image,
                                    }}
                                    height={400}
                                    resizeMode="contain"
                                    alt={convertProductName()}
                                />
                            ) : (
                                <Skeleton className="h-[533px] w-[710px] rounded-lg" />
                            )}
                        </View>
                        <ProductDescription descriptions={descriptions} />
                        {productInfo && (
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
                        )}
                    </View>
                    <View className="flex-col-reverse w-full py-4">
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
                    </View>
                </View>
            </ScrollView>
        )
    );
}
