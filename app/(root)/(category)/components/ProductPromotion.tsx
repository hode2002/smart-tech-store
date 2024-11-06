import React from 'react';
import { Skeleton } from '@/components/Skeleton';
import { Image, Text, View } from 'react-native';
import { icons } from '@/constants';

const ProductPromotion = ({ promotions }: { promotions: string[] }) => {
    return (
        <View className="mt-4">
            <Text className="border border-solid p-2 rounded-t-lg">
                Khuyến mãi
            </Text>
            <View className="border-x border-b border-t-0 border-solid rounded-b-lg">
                {promotions ? (
                    promotions.map((promotion, index) => (
                        <View
                            key={index}
                            className="p-4 flex-row items-start gap-4"
                        >
                            <Image
                                source={icons.badgeCheck}
                                resizeMode="contain"
                                tintColor={'#2ac050'}
                                className="w-8 h-8"
                            />
                            <Text className="text-sm w-[90%]">{promotion}</Text>
                        </View>
                    ))
                ) : (
                    <>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <View
                                key={index}
                                className="p-4 flex-row items-start gap-4"
                            >
                                <Image
                                    source={icons.badgeCheck}
                                    resizeMode="contain"
                                    tintColor={'#2ac050'}
                                    className="w-8 h-8"
                                />
                                <View className="w-[90%]">
                                    <Skeleton className="h-[36px] w-[400px] rounded-lg" />
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </View>
        </View>
    );
};

export default ProductPromotion;
