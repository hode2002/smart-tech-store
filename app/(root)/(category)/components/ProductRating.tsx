import { icons } from '@/constants';
import { RatingType } from '@/schemaValidations/product.schema';
import React from 'react';
import { Image } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

const ProductRating = ({ rating }: { rating: RatingType }) => {
    return (
        <>
            <View className="flex-row items-center gap-2">
                <Text className="font-JakartaBold">{rating?.overall}</Text>
                <StarRatingDisplay
                    rating={Math.floor(rating.overall)}
                    starSize={26}
                />
                <Text className="block text-base antialiased font-JakartaMedium leading-relaxed text-gray-500">
                    ({rating?.total_reviews})
                </Text>
            </View>

            <View className="mt-8">
                {rating?.total_reviews &&
                    rating.details
                        .map((star, index) => {
                            if (index === 0) return;
                            return (
                                <View
                                    key={index}
                                    className="flex-row items-center mt-4"
                                >
                                    <View className="flex-row gap-1 items-center">
                                        <Text className="font-JakartaMedium">
                                            {index}
                                        </Text>
                                        <Image
                                            source={icons.star}
                                            resizeMode="contain"
                                            className="w-5 h-5"
                                            tintColor={'#fbc02d'}
                                        />
                                    </View>
                                    <View className="w-2/4 h-2 mx-4 bg-gray-200 rounded">
                                        <View
                                            className={`h-2 bg-[#fbc02d] rounded ${star === 0 ? 'w-0' : `w-[${Number(star / rating.total_reviews) * 100}%]`}`}
                                        />
                                    </View>
                                    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <Text>
                                            {Number(
                                                star / rating.total_reviews,
                                            ) * 100}
                                        </Text>
                                        <Text>%</Text>
                                    </Text>
                                </View>
                            );
                        })
                        .reverse()}
            </View>
        </>
    );
};

export default ProductRating;
