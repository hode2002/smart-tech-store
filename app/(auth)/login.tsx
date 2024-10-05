import { useCallback, useEffect, useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    LoginBody,
    LoginBodyType,
    LoginResponseType,
} from '@/schemaValidations/auth.schema';
import authApiRequest from '@/lib/apiRequest/auth';
import { useRouter, Link } from 'expo-router';
import { Href } from 'expo-router';
import { Button } from '@/components/Button';
import { icons, images } from '@/constants';
import { useUserStore, useAuthStore } from '@/store';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const GOOGLE_APP_ID = process.env.EXPO_PUBLIC_GOOGLE_APP_ID;

WebBrowser.maybeCompleteAuthSession();
const redirectUri = AuthSession.makeRedirectUri({
    queryParams: { ack_loopback_shutdown: '2024-09-25' },
});

export default function Login() {
    const router = useRouter();
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: GOOGLE_APP_ID,
        androidClientId:
            '26311049083-gtv4blfihio29da7slntkskm9g5c5ppb.apps.googleusercontent.com',
        redirectUri,
    });

    const { setAccessToken, setRefreshToken } = useAuthStore((state) => state);
    const { setProfile } = useUserStore((state) => state);

    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = useCallback(
        async (googleToken: string) => {
            const response =
                await authApiRequest.getDataFromGoogleToken(googleToken);
            if (response.statusCode === 200) {
                const {
                    tokens: { accessToken, refreshToken },
                    profile,
                } = response.data;
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setProfile(profile);
                // router.push(profile.role === 'ADMIN' ? '/admin/dashboard' : '/');
                router.replace('/(root)/(tabs)/home');
            }
        },
        [router, setAccessToken, setProfile, setRefreshToken],
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication) {
                handleGoogleLogin(authentication.accessToken);
            }
        }
    }, [response, handleGoogleLogin]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async ({ email, password }: LoginBodyType) => {
        if (loading) return;
        setLoading(true);

        const response: LoginResponseType = await authApiRequest.login({
            email,
            password,
        });

        setLoading(false);

        if (response.statusCode === 200) {
            const {
                tokens: { accessToken, refreshToken },
                profile,
            } = response.data;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setProfile(profile);
            // router.push(profile.role === 'ADMIN' ? '/admin/dashboard' : '/');
            router.replace('/(root)/(tabs)/home');
        }
    };

    return (
        <View className="h-screen py-10 items-center bg-white">
            <View className="w-11/12 bg-white rounded-lg">
                <View className="flex flex-row justify-center mb-4">
                    <Image
                        source={images.siteLogo}
                        className="w-16 h-16 rounded-full"
                    />
                </View>
                <View className="space-y-8">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <Text className="mb-2 font-JakartaMedium">
                                    Email
                                </Text>
                                <TextInput
                                    inputMode="email"
                                    placeholder="email..."
                                    value={value}
                                    onChangeText={onChange}
                                    className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                                />
                                {errors.email && (
                                    <Text style={{ color: 'red' }}>
                                        {errors.email.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <Text className="mb-2 font-JakartaMedium">
                                    Mật khẩu
                                </Text>
                                <TextInput
                                    placeholder="password..."
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                                />
                                {errors.password && (
                                    <Text style={{ color: 'red' }}>
                                        {errors.password.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                    <View className="flex flex-row justify-end">
                        <Link href="/(auth)/forgot-password">
                            <Text className="text-blue-500 font-JakartaMedium">
                                Quên mật khẩu?
                            </Text>
                        </Link>
                    </View>
                    <View>
                        {loading ? (
                            <View className="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        ) : (
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                label="Đăng nhập"
                                labelClasses="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md"
                            />
                        )}
                    </View>
                </View>
                <View className="relative my-6">
                    <View className="absolute inset-0 flex items-center">
                        <View className="w-full border-t border-gray-300"></View>
                    </View>
                    <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
                        <View className="flex-1 h-[1px] bg-black" />
                        <Text className="text-lg mx-2">Hoặc</Text>
                        <View className="flex-1 h-[1px] bg-black" />
                    </View>
                </View>
                <View className="flex-row justify-between">
                    <TouchableOpacity
                        onPress={() =>
                            router.push((apiUrl + '/auth/facebook') as Href)
                        }
                    >
                        <View className="min-w-48 flex flex-row items-center justify-center gap-2 px-5 py-3 border border-gray-200">
                            <Image
                                source={icons.facebook}
                                resizeMode="contain"
                                className="w-8 h-8 mx-2"
                            />
                            <Text className="font-JakartaBold">Facebook</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={!request}
                        onPress={() => {
                            promptAsync();
                        }}
                        // onPress={() =>
                        //     router.push((apiUrl + '/auth/google') as Href)
                        // }
                    >
                        <View className="min-w-48 flex flex-row items-center justify-center gap-2 px-5 py-3 border border-gray-200">
                            <Image
                                source={icons.google}
                                resizeMode="contain"
                                className="w-8 h-8 mx-2"
                            />
                            <Text className="font-JakartaBold">Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        router.navigate('/(auth)/register');
                    }}
                >
                    <Text className="p-3 mt-8 text-center text-sm font-JakartaMedium">
                        Chưa có tài khoản?{' '}
                        <Text className="text-blue-500 underline font-JakartaMedium">
                            Đăng ký
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
