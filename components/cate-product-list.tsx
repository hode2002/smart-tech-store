import HomeProductCard from '@/components/HomeProductCard';
import { ProductType } from '@/lib/apiRequest/product';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
    products: ProductType[];
};

export default function CategoryProductList(props: Props) {
    const { products } = props;
    return (
        <>
            {products?.length ? (
                <View className="my-5">
                    <View className="flex-row flex-wrap gap-4">
                        {products.map((product) => (
                            <HomeProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </View>
                </View>
            ) : (
                <View className="flex flex-col justify-center items-center mt-12">
                    <Text className="font-bold text-lg">
                        Không tìm thấy sản phẩm phù hợp
                    </Text>
                    <Text>Vui lòng điều chỉnh lại bộ lọc</Text>
                </View>
            )}
        </>
    );
}
