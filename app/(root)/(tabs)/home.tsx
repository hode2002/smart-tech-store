import { useState, useEffect, useCallback } from 'react';
import { Text, FlatList, View } from 'react-native';
import { IProduct } from '@/types/type';
import productApiRequest from '@/lib/apiRequest/product';
import HomeProductCard from '@/components/HomeProductCard';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import { Skeleton, VStack } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, useNotificationStore, useUserStore } from '@/store';
import accountApiRequest from '@/lib/apiRequest/account';
import React from 'react';
import notificationApiRequest, {
    GetUserNotificationResponseType,
} from '@/lib/apiRequest/notification';

const Home = () => {
    const { accessToken, setAccessToken, setRefreshToken } = useAuthStore(
        (state) => state,
    );
    const { setProfile, setAddress, cart, setCartProducts } = useUserStore(
        (state) => state,
    );
    const { setNotifications } = useNotificationStore((state) => state);

    useEffect(() => {
        (async () => {
            const profileJsonValue = await AsyncStorage.getItem('profile');
            const profile =
                profileJsonValue !== null ? JSON.parse(profileJsonValue) : null;
            if (profile !== null) {
                setProfile(profile);
            }

            const addressJsonValue = await AsyncStorage.getItem('address');
            const address =
                addressJsonValue !== null ? JSON.parse(addressJsonValue) : null;
            if (address !== null) {
                setAddress(address);
            }

            const accessTokenJsonValue =
                await AsyncStorage.getItem('accessToken');
            if (accessTokenJsonValue !== null) {
                const accessToken = JSON.parse(accessTokenJsonValue);
                setAccessToken(accessToken);
            }

            const refreshTokenJsonValue =
                await AsyncStorage.getItem('refreshToken');
            if (refreshTokenJsonValue !== null) {
                const refreshToken = JSON.parse(refreshTokenJsonValue);
                setRefreshToken(refreshToken);
            }

            const cartJsonValue = await AsyncStorage.getItem('cart');
            const cart =
                cartJsonValue !== null ? JSON.parse(cartJsonValue) : null;
            if (cart !== null && cart.length > 0) {
                setCartProducts(cart);
            }
        })();
    }, [
        setProfile,
        setAddress,
        setAccessToken,
        setRefreshToken,
        setCartProducts,
    ]);

    useEffect(() => {
        if (accessToken && cart.length < 1) {
            (async () => {
                const response =
                    await accountApiRequest.getProductsFromCart(accessToken);
                if (response?.statusCode === 200) {
                    setCartProducts(response?.data);
                }
            })();
        }
    }, [cart.length, setCartProducts, accessToken]);

    const [smartphone, setSmartphone] = useState<IProduct[]>([]);
    const [laptop, setLaptop] = useState<IProduct[]>([]);
    const [tablet, setTablet] = useState<IProduct[]>([]);

    const fetchProduct = useCallback(async (cate: string) => {
        const response = await productApiRequest.getProductsByCategory(cate);
        return response.data;
    }, []);

    const fetchNotifications = useCallback(async () => {
        const response: GetUserNotificationResponseType =
            await notificationApiRequest.getUserNotification(accessToken);
        if (response?.data) {
            setNotifications(
                response.data?.map((i) => ({
                    ...i.notification,
                    status: i.status,
                })),
            );
            return response.data;
        }
        return [];
    }, [accessToken, setNotifications]);

    useEffect(() => {
        (async () => {
            const smartphone = await fetchProduct('smartphone');
            const tablet = await fetchProduct('tablet');
            const laptop = await fetchProduct('laptop');

            setSmartphone(smartphone);
            setTablet(tablet);
            setLaptop(laptop);

            if (accessToken) {
                fetchNotifications();
            }
        })();
    }, [fetchProduct, accessToken, fetchNotifications]);

    return (
        <View className="bg-white pt-2">
            <Navbar />
            <FlatList
                numColumns={2}
                data={smartphone}
                renderItem={({ item }) => <HomeProductCard product={item} />}
                keyExtractor={(item, index) => index.toString()}
                className="px-2 bg-white"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: 300,
                }}
                ListEmptyComponent={() => (
                    <View>
                        <View className="flex flex-row items-center justify-center gap-4 my-4">
                            <VStack
                                w="45%"
                                maxW="400"
                                borderWidth="1"
                                space={8}
                                overflow="hidden"
                                rounded="md"
                                _dark={{
                                    borderColor: 'coolGray.500',
                                }}
                                _light={{
                                    borderColor: 'coolGray.200',
                                }}
                            >
                                <Skeleton h="40" />
                                <Skeleton.Text px="4" />
                                <Skeleton
                                    px="4"
                                    my="4"
                                    rounded="md"
                                    startColor="gray.400"
                                />
                            </VStack>
                            <VStack
                                w="45%"
                                maxW="400"
                                borderWidth="1"
                                space={8}
                                overflow="hidden"
                                rounded="md"
                                _dark={{
                                    borderColor: 'coolGray.500',
                                }}
                                _light={{
                                    borderColor: 'coolGray.200',
                                }}
                            >
                                <Skeleton h="40" />
                                <Skeleton.Text px="4" />
                                <Skeleton
                                    px="4"
                                    my="4"
                                    rounded="md"
                                    startColor="gray.400"
                                />
                            </VStack>
                        </View>
                    </View>
                )}
                ListHeaderComponent={
                    <>
                        <Banner />
                        <Text className="text-xl bg-black rounded-md text-white font-JakartaBold mt-5 mx-3 p-3">
                            Điện thoại
                        </Text>
                    </>
                }
                ListFooterComponent={
                    <FlatList
                        numColumns={2}
                        data={laptop}
                        renderItem={({ item }) => (
                            <HomeProductCard product={item} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        className="bg-white"
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingBottom: 300,
                        }}
                        ListEmptyComponent={() => (
                            <View>
                                <View className="flex flex-row items-center justify-center gap-4 my-4">
                                    <VStack
                                        w="45%"
                                        maxW="400"
                                        borderWidth="1"
                                        space={8}
                                        overflow="hidden"
                                        rounded="md"
                                        _dark={{
                                            borderColor: 'coolGray.500',
                                        }}
                                        _light={{
                                            borderColor: 'coolGray.200',
                                        }}
                                    >
                                        <Skeleton h="40" />
                                        <Skeleton.Text px="4" />
                                        <Skeleton
                                            px="4"
                                            my="4"
                                            rounded="md"
                                            startColor="gray.400"
                                        />
                                    </VStack>
                                    <VStack
                                        w="45%"
                                        maxW="400"
                                        borderWidth="1"
                                        space={8}
                                        overflow="hidden"
                                        rounded="md"
                                        _dark={{
                                            borderColor: 'coolGray.500',
                                        }}
                                        _light={{
                                            borderColor: 'coolGray.200',
                                        }}
                                    >
                                        <Skeleton h="40" />
                                        <Skeleton.Text px="4" />
                                        <Skeleton
                                            px="4"
                                            my="4"
                                            rounded="md"
                                            startColor="gray.400"
                                        />
                                    </VStack>
                                </View>
                            </View>
                        )}
                        ListHeaderComponent={
                            <Text className="text-xl bg-black rounded-md text-white font-JakartaBold mt-5 mx-3 p-3">
                                Laptop
                            </Text>
                        }
                        ListFooterComponent={
                            <FlatList
                                numColumns={2}
                                data={tablet}
                                renderItem={({ item }) => (
                                    <HomeProductCard product={item} />
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                className="bg-white"
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{
                                    paddingBottom: 300,
                                }}
                                ListEmptyComponent={() => (
                                    <View>
                                        <View className="flex flex-row items-center justify-center gap-4 my-4">
                                            <VStack
                                                w="45%"
                                                maxW="400"
                                                borderWidth="1"
                                                space={8}
                                                overflow="hidden"
                                                rounded="md"
                                                _dark={{
                                                    borderColor: 'coolGray.500',
                                                }}
                                                _light={{
                                                    borderColor: 'coolGray.200',
                                                }}
                                            >
                                                <Skeleton h="40" />
                                                <Skeleton.Text px="4" />
                                                <Skeleton
                                                    px="4"
                                                    my="4"
                                                    rounded="md"
                                                    startColor="gray.400"
                                                />
                                            </VStack>
                                            <VStack
                                                w="45%"
                                                maxW="400"
                                                borderWidth="1"
                                                space={8}
                                                overflow="hidden"
                                                rounded="md"
                                                _dark={{
                                                    borderColor: 'coolGray.500',
                                                }}
                                                _light={{
                                                    borderColor: 'coolGray.200',
                                                }}
                                            >
                                                <Skeleton h="40" />
                                                <Skeleton.Text px="4" />
                                                <Skeleton
                                                    px="4"
                                                    my="4"
                                                    rounded="md"
                                                    startColor="gray.400"
                                                />
                                            </VStack>
                                        </View>
                                    </View>
                                )}
                                ListHeaderComponent={
                                    <>
                                        <Text className="text-xl bg-black rounded-md text-white font-JakartaBold mt-5 mx-3 p-3">
                                            Máy tính bảng
                                        </Text>
                                    </>
                                }
                            />
                        }
                    />
                }
            />
        </View>
    );
};

export default Home;
