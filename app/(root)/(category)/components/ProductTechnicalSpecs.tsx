import React from 'react';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import { Skeleton } from '@/components/Skeleton';
import { Text, View } from 'react-native';

const ProductTechnicalSpecs = ({
    convertProductName,
    technicalSpecs,
}: {
    convertProductName: () => string;
    technicalSpecs: TechnicalSpecsItem[];
}) => {
    return (
        <View className="mt-8">
            <View className="flex gap-2 items-center">
                <Text className="font-JakartaMedium text-nowrap text-[20px] capitalize">
                    Cấu hình
                </Text>
                {technicalSpecs ? (
                    <Text className="font-JakartaBold text-[20px] capitalize">
                        {convertProductName()}
                    </Text>
                ) : (
                    <Skeleton className="h-[24px] w-full rounded-lg" />
                )}
            </View>
            <View className="mt-2 rounded-lg">
                {technicalSpecs &&
                    technicalSpecs
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item, index) => (
                            <View
                                key={index}
                                className="px-2 py-3 flex-row border-b border-[#ccc] text-[14px] capitalize"
                            >
                                <Text className="font-JakartaMedium w-[45%] text-right">
                                    {item.name}:
                                </Text>
                                <View className="px-2 w-[calc(50%)]">
                                    <Text className="font-JakartaMedium">
                                        {item.value}
                                    </Text>
                                </View>
                            </View>
                        ))}
            </View>
        </View>
    );
};

export default ProductTechnicalSpecs;
