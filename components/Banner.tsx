import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Skeleton } from '@/components/Skeleton';
import { BannersResponseType, FetchAllBannersResponseType } from '@/types/type';
import bannerImageApiRequest from '@/lib/apiRequest/banner-images';
// import bannerImageApiRequest from '@/apiRequests/banner-images';
// import {
//     BannersResponseType,
//     FetchAllBannersResponseType,
// } from '@/apiRequests/admin';

export default function Banner() {
    const [bigBanner, setBigBanner] = useState<BannersResponseType | null>(
        null,
    );
    const [sideImages, setSideImages] = useState<BannersResponseType[]>([]);
    const [carouselImages, setCarouselImages] = useState<BannersResponseType[]>(
        [],
    );
    const navigation = useNavigation();

    useEffect(() => {
        bannerImageApiRequest
            .getImages()
            .then((response: FetchAllBannersResponseType) => {
                const bannerImages = response.data;
                setBigBanner(
                    bannerImages?.find((image) => image.type === 'big'),
                );
                setCarouselImages(
                    bannerImages?.filter((image) => image.type === 'slide'),
                );
                setSideImages(
                    bannerImages?.filter((image) => image.type === 'side'),
                );
            });
    }, []);

    return (
        <View>
            <View className="relative px-4 min-h-max max-h-min">
                {bigBanner ? (
                    <TouchableOpacity
                    // onPress={() =>
                    //     navigation.navigate('Detail', {
                    //         link: bigBanner.link,
                    //     })
                    // }
                    >
                        <Image
                            source={{ uri: bigBanner?.image }}
                            style={{ width: '100%', height: 100 }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                ) : (
                    <Skeleton className="w-full h-[100px] mb-1" />
                )}
            </View>

            <View className="px-4">
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {carouselImages?.length ? (
                        carouselImages.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                // onPress={() =>
                                //     navigation.navigate('Detail', {
                                //         link: item.link,
                                //     })
                                // }
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={{
                                        width: 200,
                                        height: 100,
                                        marginRight: 10,
                                        borderRadius: 10,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <>
                            <Skeleton className="w-[200px] h-[100px] mb-1" />
                            <Skeleton className="w-[200px] h-[100px] mb-1" />
                        </>
                    )}
                </ScrollView>

                <View style={{ flexDirection: 'column', marginTop: 20 }}>
                    {sideImages?.length ? (
                        sideImages.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                // onPress={() =>
                                //     navigation.navigate('Detail', {
                                //         link: item.link,
                                //     })
                                // }
                            >
                                <Image
                                    key={item.id}
                                    source={{ uri: item.image }}
                                    style={{
                                        width: '100%',
                                        height: 100,
                                        borderRadius: 10,
                                        marginBottom: 10,
                                    }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <>
                            <Skeleton className="w-full h-[100px] mb-1" />
                            <Skeleton className="w-full h-[100px] mb-1" />
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}
