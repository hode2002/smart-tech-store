import { useState } from 'react';
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
    CreatePassword,
    CreatePasswordResponseType,
    CreatePasswordType,
    RegisterBody,
    RegisterBodyType,
    RegisterResType,
} from '@/schemaValidations/auth.schema';
import authApiRequest from '@/lib/apiRequest/auth';
import { Href, useRouter } from 'expo-router';
import { icons, images } from '@/constants';
import { Button } from '@/components/Button';
import { ReactNativeModal } from 'react-native-modal';
import RegisterOTPModal from '@/components/RegisterOTPModal';

export default function Register() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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

    const createPasswordForm = useForm<CreatePasswordType>({
        resolver: zodResolver(CreatePassword),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const [showCreatePasswordModal, setShowCreatePasswordModal] =
        useState(false);
    const [verification, setVerification] = useState<{
        state: string;
        error: string;
        code: string;
    }>({
        state: 'default',
        error: '',
        code: '',
    });

    const onSubmit = async ({ email }: RegisterBodyType) => {
        if (loading) return;
        setLoading(true);
        const response: RegisterResType = await authApiRequest.register({
            email,
        });
        setLoading(false);
        if (response.statusCode === 200) {
            setVerification({
                ...verification,
                state: 'pending',
            });
        }
    };

    const onCreatePassword = async () => {
        if (loading) return;
        setLoading(true);
        const response: CreatePasswordResponseType =
            await authApiRequest.createPassword({
                email: getValues('email'),
                password: createPasswordForm.getValues('password'),
            });
        setLoading(false);
        if (response.statusCode === 200) {
            router.navigate('/(root)/(tabs)/home');
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
                    Nhập email của bạn để tạo tài khoản
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
                                label="Gửi OTP"
                                labelClasses="font-JakartaBold text-white"
                                className="mt-4 bg-black text-white min-w-[120px] rounded-md"
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
                        <Text className="text-lg mx-2">Hoặc đăng nhập với</Text>
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
                        onPress={() =>
                            router.push((apiUrl + '/auth/google') as Href)
                        }
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
                        router.navigate('/(auth)/login');
                    }}
                >
                    <Text className="p-3 mt-8 text-center text-sm font-JakartaMedium">
                        Đã có tài khoản?{' '}
                        <Text className="text-blue-500 underline font-JakartaMedium">
                            Đăng nhập
                        </Text>
                    </Text>
                </TouchableOpacity>
                <RegisterOTPModal
                    email={getValues('email')}
                    loading={loading}
                    verification={verification}
                    setVerification={setVerification}
                    setShowCreatePasswordModal={setShowCreatePasswordModal}
                />
                <ReactNativeModal isVisible={showCreatePasswordModal}>
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Text className="font-JakartaExtraBold text-2xl mb-8">
                            Tạo mật khẩu
                        </Text>
                        <Controller
                            control={createPasswordForm.control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="mb-2 font-JakartaBold">
                                        Mật khẩu
                                    </Text>
                                    <TextInput
                                        value={value}
                                        secureTextEntry
                                        onChangeText={onChange}
                                        className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                                    />
                                    {createPasswordForm.formState.errors
                                        .password && (
                                        <Text style={{ color: 'red' }}>
                                            {
                                                createPasswordForm.formState
                                                    .errors.password.message
                                            }
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        <Controller
                            control={createPasswordForm.control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="mb-2 font-JakartaBold">
                                        Xác nhận mật khẩu
                                    </Text>
                                    <TextInput
                                        value={value}
                                        secureTextEntry
                                        onChangeText={onChange}
                                        className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                                    />
                                    {createPasswordForm.formState.errors
                                        .confirmPassword && (
                                        <Text style={{ color: 'red' }}>
                                            {
                                                createPasswordForm.formState
                                                    .errors.confirmPassword
                                                    .message
                                            }
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        <View>
                            {loading ? (
                                <View className="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                    />
                                </View>
                            ) : (
                                <Button
                                    onPress={createPasswordForm.handleSubmit(
                                        onCreatePassword,
                                    )}
                                    label="Xác nhận"
                                    labelClasses="font-JakartaBold text-white"
                                    className="mt-4 bg-black text-white min-w-[120px] rounded-md"
                                />
                            )}
                        </View>
                    </View>
                </ReactNativeModal>
            </View>
        </View>
    );
}
