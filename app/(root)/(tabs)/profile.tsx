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
                <View className="flex flex-row px-4">
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
                                    labelClasses="font-JakartaBold bg-white text-black px-5 py-3 min-w-[120px] rounded-md"
                                />
                                <Button
                                    onPress={() =>
                                        router.push('/(auth)/register')
                                    }
                                    label="Đăng ký"
                                    labelClasses="font-JakartaBold bg-white text-black px-5 py-3 min-w-[120px] rounded-md"
                                />
                            </View>
                        </View>
                    )}
                </View>

                <View className="bg-white mt-4">
                    {/* <View className="flex items-center justify-center my-5 bg-white">
                        <Image
                            source={{
                                uri:
                                    user?.externalAccounts[0]?.imageUrl ??
                                    user?.imageUrl,
                            }}
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: 110 / 2,
                            }}
                            className="rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
                        />
                    </View>

                    <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
                        <View className="flex flex-col items-start justify-start w-full">
                            <InputField
                                label="First name"
                                placeholder={user?.firstName || 'Not Found'}
                                containerStyle="w-full"
                                inputStyle="p-3.5"
                                editable={false}
                            />

                            <InputField
                                label="Last name"
                                placeholder={user?.lastName || 'Not Found'}
                                containerStyle="w-full"
                                inputStyle="p-3.5"
                                editable={false}
                            />

                            <InputField
                                label="Email"
                                placeholder={
                                    user?.primaryEmailAddress?.emailAddress ||
                                    'Not Found'
                                }
                                containerStyle="w-full"
                                inputStyle="p-3.5"
                                editable={false}
                            />

                            <InputField
                                label="Phone"
                                placeholder={
                                    user?.primaryPhoneNumber?.phoneNumber ||
                                    'Not Found'
                                }
                                containerStyle="w-full"
                                inputStyle="p-3.5"
                                editable={false}
                            />
                        </View>
                    </View> */}
                </View>
            </ScrollView>
        </View>
    );
};

export default Profile;
