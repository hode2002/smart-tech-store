import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, View } from 'react-native';
import { icons } from '@/constants';
import React from 'react';
import { useUserStore } from '@/store';

const TabIcon = ({
    source,
    focused,
}: {
    source?: ImageSourcePropType;
    focused: boolean;
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
        </View>
    </View>
);

export default function Layout() {
    const { cart } = useUserStore((state) => state);
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
                name="chat"
                options={{
                    title: 'Chat',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.chat} focused={focused} />
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
