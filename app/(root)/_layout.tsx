import { icons } from '@/constants';
import { router, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Image } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import React from 'react';

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#000' },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
                animation: 'ios',
                headerRight: () => (
                    <Menu>
                        <MenuTrigger>
                            <Image
                                source={icons.ellipsisVertical}
                                className="w-6 h-6"
                                tintColor={'#fff'}
                            />
                        </MenuTrigger>
                        <MenuOptions
                            optionsContainerStyle={{
                                backgroundColor: 'black',
                                borderRadius: 10,
                                padding: 10,
                            }}
                        >
                            <MenuOption
                                onSelect={() =>
                                    router.push('/(root)/(tabs)/cart')
                                }
                            >
                                <View className="flex flex-row gap-4 items-center p-2">
                                    <Image
                                        source={icons.shoppingCart}
                                        className="w-6 h-6"
                                        tintColor={'#fff'}
                                    />
                                    <Text className="text-white">Giỏ hàng</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                ),
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="(category)/smartphone"
                options={{
                    headerShown: true,
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name="(category)/laptop"
                options={{
                    headerShown: true,
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name="(category)/tablet"
                options={{ headerShown: true, headerTitle: '' }}
            />
            <Stack.Screen
                name="(category)/[slug]"
                options={{ headerShown: true, headerTitle: '' }}
            />
            <Stack.Screen
                name="edit-profile"
                options={{
                    headerShown: true,
                    headerTitle: 'Sửa hồ sơ',
                    headerTitleAlign: 'left',
                    headerRight: () => <></>,
                }}
            />
            <Stack.Screen
                name="edit-address"
                options={{
                    headerShown: true,
                    headerTitle: 'Địa chỉ của tôi',
                    headerTitleAlign: 'left',
                    headerRight: () => <></>,
                }}
            />
            <Stack.Screen
                name="change-password"
                options={{
                    headerShown: true,
                    headerTitle: 'Đổi mật khẩu',
                    headerTitleAlign: 'left',
                    headerRight: () => <></>,
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: true,
                    headerTitle: 'Thiết lập tài khoản',
                    headerTitleAlign: 'left',
                    headerRight: () => <></>,
                }}
            />
            <Stack.Screen
                name="checkout"
                options={{
                    headerShown: true,
                    headerTitle: 'Thanh toán',
                    headerTitleAlign: 'left',
                    headerRight: () => <></>,
                }}
            />
            <Stack.Screen
                name="search"
                options={{
                    animation: 'fade_from_bottom',
                    headerShown: false,
                    headerRight: () => <></>,
                }}
            />
            <Stack.Screen
                name="search-results"
                options={{
                    headerShown: false,
                    headerRight: () => <></>,
                }}
            />
        </Stack>
    );
};

export default Layout;
