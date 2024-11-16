import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ProductPaginationResponseType } from '@/schemaValidations/product.schema';
import { useLocalSearchParams } from 'expo-router';
import productApiRequest, { ProductType } from '@/lib/apiRequest/product';
import { useProductStore } from '@/store';
import CategoryProductList from '@/components/cate-product-list';

export default function SearchResults() {
    const { keywords } = useLocalSearchParams();

    const { productsSearch } = useProductStore((state) => state);
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        if (keywords) {
            productApiRequest
                .getProductsByKeyword(keywords as string)
                .then((response: ProductPaginationResponseType) => {
                    setProducts(response.data.products);
                });
        } else {
            setProducts(productsSearch);
        }
    }, [keywords, productsSearch]);

    return (
        <View className="py-2">
            <View className="my-8 flex">
                <View className="w-full border-border">
                    <View className="w-full py-3">
                        {keywords && (
                            <View className="flex justify-between items-center">
                                <Text className="font-bold text-[20px]">
                                    Tìm thấy {products.length} kết quả với từ
                                    khóa {`"${keywords}"`}
                                </Text>
                            </View>
                        )}
                    </View>
                    <CategoryProductList products={products} />
                </View>
            </View>
        </View>
    );
}
