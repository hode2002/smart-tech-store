import React from 'react';
import { Skeleton } from '@/components/Skeleton';
import { Image, Text } from 'react-native';
import { icons } from '@/constants';
import { View } from 'react-native';

const ProductWarranty = ({ warranties }: { warranties: string[] }) => {
    return (
        <View className="flex-row min-h-[185px] items-center justify-center rounded-lg border border-solid">
            <View>
                {warranties ? (
                    warranties.map((warranty, index) => (
                        <View
                            key={index}
                            className="p-4 flex-row w-full items-start gap-4"
                        >
                            <Image
                                source={icons.shieldCheck}
                                resizeMode="contain"
                                tintColor={'#2ac050'}
                                className="w-8 h-8"
                            />
                            <Text className="w-[90%]">{warranty}</Text>
                        </View>
                    ))
                ) : (
                    <>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <View
                                key={index}
                                className="p-4 flex-row w-full items-start gap-4"
                            >
                                <Image
                                    source={icons.shieldCheck}
                                    resizeMode="contain"
                                    tintColor={'#2ac050'}
                                    className="w-8 h-8"
                                />
                                <View className="w-[90%]">
                                    <Skeleton className="h-[36px] w-[300px] rounded-lg" />
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </View>
        </View>
    );
};

export default ProductWarranty;
