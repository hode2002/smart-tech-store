import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '@/constants';
import { Button } from '@/components/Button';
import { Href, router } from 'expo-router';
import { useUserStore } from '@/store';

const Profile = () => {
    const { profile } = useUserStore((state) => state);

    return (
        <View className="bg-black pt-16">
            <ScrollView>
                <View className="flex flex-row px-4 py-2">
                    {profile?.email ? (
                        <View className="flex flex-row justify-between w-full">
                            <TouchableOpacity
                                onPress={() =>
                                    router.push('/(root)/edit-profile' as Href)
                                }
                            >
                                <View className="flex flex-row gap-4 items-center rounded-full">
                                    <View className="rounded-full w-14 h-14 items-center justify-center bg-white">
                                        <Image
                                            source={{ uri: profile.avatar }}
                                            resizeMode="contain"
                                            className="w-12 h-12 relative rounded-full"
                                        />
                                        <Image
                                            source={icons.pencil}
                                            tintColor="black"
                                            resizeMode="contain"
                                            className="w-5 h-5 absolute bottom-1 right-1"
                                        />
                                    </View>
                                    <Text className="text-white text-lg font-JakartaBold">
                                        {profile.email}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View className="flex flex-row items-center gap-4">
                                <TouchableOpacity
                                    onPress={() =>
                                        router.navigate(
                                            '/(root)/settings' as Href,
                                        )
                                    }
                                >
                                    <Image
                                        source={icons.settings}
                                        tintColor="white"
                                        resizeMode="contain"
                                        className="w-8 h-8"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        router.push(
                                            '/(root)/(tabs)/cart' as Href,
                                        )
                                    }
                                >
                                    <Image
                                        source={icons.shoppingCart}
                                        tintColor="white"
                                        resizeMode="contain"
                                        className="w-8 h-8"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View className="flex flex-row w-full justify-between items-center">
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/login')}
                            >
                                <View className="rounded-full w-14 h-14 items-center justify-center bg-white">
                                    <Image
                                        source={icons.profile}
                                        tintColor="black"
                                        resizeMode="contain"
                                        className="w-10 h-10"
                                    />
                                </View>
                            </TouchableOpacity>
                            <View className="flex flex-row gap-4">
                                <Button
                                    onPress={() => router.push('/(auth)/login')}
                                    label="Đăng nhập"
                                    labelClasses="font-JakartaBold text-black"
                                    className="bg-white  px-5 py-2 min-w-[120px] rounded-md"
                                />
                                <Button
                                    onPress={() =>
                                        router.push('/(auth)/register')
                                    }
                                    label="Đăng ký"
                                    labelClasses="font-JakartaBold text-black"
                                    className="bg-white  px-5 py-2 min-w-[120px] rounded-md"
                                />
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default Profile;
