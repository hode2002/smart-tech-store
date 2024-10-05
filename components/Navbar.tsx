import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageSourcePropType,
    TextInput,
} from 'react-native';
import { icons } from '@/constants';
import { Href, Link, router } from 'expo-router';
import { useAuthStore, useUserStore } from '@/store';
import accountApiRequest from '@/lib/apiRequest/account';

type NavItem = {
    name: string;
    link: string;
    icon: ImageSourcePropType;
};

export default function Navbar() {
    const { accessToken } = useAuthStore((state) => state);
    const { cart, setCartProducts } = useUserStore((state) => state);

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

    const navItems: NavItem[] = [
        { name: 'Điện thoại', link: 'smartphone', icon: icons.smartphone },
        { name: 'Laptop', link: 'laptop', icon: icons.laptop },
        { name: 'Tablet', link: 'tablet', icon: icons.tablet },
        { name: 'Phụ kiện', link: 'earphone', icon: icons.headphones },
        { name: 'Đồng hồ', link: 'watch', icon: icons.watch },
    ];

    return (
        <View className="mt-8 border-b h-32 top-0 w-full px-2">
            <View className="flex flex-row pt-2 items-center w-full">
                <View className="mx-2 items-center w-[80%]">
                    <View className="w-full space-x-2">
                        <View className="w-full relative">
                            <TextInput
                                onPress={() =>
                                    router.push('/(root)/search' as Href)
                                }
                                placeholder="Bạn cần tìm gì..."
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </View>
                    </View>
                </View>
                <View className="ml-2">
                    <TouchableOpacity
                        onPress={() => router.push('/(root)/(tabs)/cart')}
                    >
                        <Image
                            source={icons.shoppingCart}
                            className="h-9 w-9"
                            resizeMode="contain"
                        />
                        {cart.length >= 0 && (
                            <View className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                                <Text className="text-white text-xs">
                                    {cart.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="my-2"
            >
                {navItems.map((navItem) => (
                    <Link
                        key={navItem.name}
                        href={`/(root)/${navItem.link}` as Href}
                        className="flex items-center justify-center px-4 py-2"
                    >
                        <View className="flex flex-col items-center justify-center">
                            <Image
                                source={navItem.icon}
                                className="h-6 w-6"
                                resizeMode="contain"
                            />
                            <Text className="text-sm">{navItem.name}</Text>
                        </View>
                    </Link>
                ))}
            </ScrollView>
        </View>
    );
}
