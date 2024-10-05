import { useState } from 'react';
import { Text, View, TextInput, ActivityIndicator, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ForgotPasswordResponseType,
    RegisterBody,
    RegisterBodyType,
} from '@/schemaValidations/auth.schema';
import authApiRequest from '@/lib/apiRequest/auth';
import { useRouter } from 'expo-router';
import { images } from '@/constants';
import { Button } from '@/components/Button';

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: { email: '' },
    });

    const onSubmit = async () => {
        if (loading) return;
        setLoading(true);
        const response: ForgotPasswordResponseType =
            await authApiRequest.forgotPassword({
                email: getValues('email'),
            });
        setLoading(false);
        if (response.statusCode === 200) {
            router.navigate('/(auth)/login');
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
                <Text className="text-center mb-4 text-gray-500">
                    Quên mật khẩu
                </Text>
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
                    <View>
                        {loading ? (
                            <View className="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        ) : (
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                label="Gửi"
                                labelClasses="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md"
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}
