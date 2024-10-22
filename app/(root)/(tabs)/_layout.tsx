import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, View, Text } from 'react-native';
import { icons } from '@/constants';
import React from 'react';
import { useNotificationStore, useUserStore } from '@/store';
import { Notification } from '@/types/type';

const TabIcon = ({
    source,
    focused,
    notifications = [],
}: {
    source?: ImageSourcePropType;
    focused: boolean;
    notifications?: Notification[];
}) => (
    <View
        className={`flex flex-row justify-center items-center rounded-full p-8`}
    >
        <View
            className={`rounded-full w-10 h-10 items-center justify-center ${focused ? 'bg-white' : ''}`}
        >
            <Image
                source={source}
                tintColor={focused ? 'black' : 'white'}
                resizeMode="contain"
                className="w-7 h-7"
            />
            {notifications && notifications?.length > 0 && (
                <View className="relative">
                    {notifications &&
                        notifications?.length > 0 &&
                        notifications?.filter((item) => item.status !== 1)
                            ?.length > 0 && (
                            <View className="flex-row items-center justify-center absolute bottom-4 h-5 w-5 bg-red-500 rounded-full">
                                <Text className="flex-row items-center justify-center text-xs font-JakartaMedium text-white">
                                    {
                                        notifications?.filter(
                                            (item) => !item.status,
                                        )?.length
                                    }
                                </Text>
                            </View>
                        )}
                </View>
            )}
        </View>
    </View>
);

export default function Layout() {
    const { cart } = useUserStore((state) => state);
    const { notifications } = useNotificationStore((state) => state);

    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#000',
                    paddingBottom: 0, // ios only
                    overflow: 'hidden',
                    height: 52,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    position: 'absolute',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.home} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Đơn đã mua',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.orderList} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: `Giỏ hàng (${cart.length})`,
                    headerShown: true,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            source={icons.shoppingCart}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Thông báo',
                    headerShown: true,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            source={icons.bell}
                            focused={focused}
                            notifications={notifications}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.profile} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}
