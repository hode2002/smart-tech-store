import {
    View,
    TouchableOpacity,
    Image,
    TextInput,
    Text,
    ActivityIndicator,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useAuthStore, useUserStore } from '@/store';
import { router } from 'expo-router';
import InputField from '@/components/InputField';
import { icons } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
    UpdateProfileType,
    UpdateProfile,
    UpdateProfileResponseType,
    UpdateAvatarResponseType,
} from '@/schemaValidations/account.schema';
import { Button } from '@/components/Button';
import accountApiRequest from '@/lib/apiRequest/account';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
    const { profile, setProfile } = useUserStore((state) => state);
    const { accessToken } = useAuthStore((state) => state);
    const [loading, setLoading] = useState(false);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const takePicture = () => {
        Toast.show({ type: 'info', text1: 'Chức năng đang phát triển' });
    };

    const pickImage = async () => {
        const result: ImagePicker.ImagePickerResult =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

        if (!result.canceled) {
            validateFile(result.assets[0]);
        }
    };

    const validateFile = (file: any) => {
        if (file.uri && /\.(jpg|jpeg|png)$/.test(file.uri)) {
            handleUploadFile(file);
            bottomSheetRef.current?.close();
        } else {
            Toast.show({ type: 'error', text1: 'Không đúng định dạng ảnh' });
        }
    };

    const handleUploadFile = async (file: File) => {
        if (loading) return;
        setLoading(true);
        const response: UpdateAvatarResponseType =
            await accountApiRequest.updateAvatar(accessToken, {
                avatar: file,
            });
        setLoading(false);
        if (response.statusCode === 200) {
            const profile = response.data;
            setProfile(profile);
        }
    };

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors, isValid },
    } = useForm<UpdateProfileType>({
        resolver: zodResolver(UpdateProfile),
        defaultValues: {
            name: profile.name,
            phone: profile.phone,
        },
    });

    const onSubmit = async () => {
        if (loading) return;
        setLoading(true);
        const response: UpdateProfileResponseType =
            await accountApiRequest.updateProfile(accessToken, {
                name: getValues('name'),
                phone: getValues('phone'),
            });
        setLoading(false);
        if (response.statusCode === 200) {
            setProfile(response.data);
            router.back();
        }
    };

    return (
        <GestureHandlerRootView>
            <View className="h-screen py-10 items-center bg-white">
                <View className="w-11/12 bg-white rounded-lg">
                    <TouchableOpacity onPress={handleOpenBottomSheet}>
                        <View className="rounded-full items-center justify-center mt-8 mb-4 ">
                            <Image
                                source={{ uri: profile.avatar }}
                                resizeMode="contain"
                                className="w-32 h-32 rounded-full"
                            />
                            <View className="absolute rounded-full justify-center items-center">
                                <Image
                                    source={icons.camera}
                                    tintColor="white"
                                    resizeMode="contain"
                                    className="w-8 h-8 absolute"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text className="text-center font-JakartaMedium">
                        Thay đổi ảnh
                    </Text>
                    <View>
                        <InputField
                            label="Email"
                            icon={icons.email}
                            textContentType="emailAddress"
                            value={profile.email}
                            editable={false}
                        />
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="mb-2 font-JakartaMedium">
                                        Tên
                                    </Text>
                                    <TextInput
                                        inputMode="text"
                                        placeholder="tên..."
                                        value={value}
                                        onChangeText={onChange}
                                        autoComplete="username"
                                        className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                                    />
                                    {errors.name && (
                                        <Text style={{ color: 'red' }}>
                                            {errors.name.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="mb-2 font-JakartaMedium">
                                        Số điện thoại
                                    </Text>
                                    <TextInput
                                        inputMode="tel"
                                        placeholder="số điện thoại..."
                                        value={value}
                                        onChangeText={onChange}
                                        className="border border-gray-500 rounded-md px-4 py-2 font-JakartaMedium"
                                    />
                                    {errors.phone && (
                                        <Text style={{ color: 'red' }}>
                                            {errors.phone.message}
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
                                    disabled={!isValid}
                                    onPress={handleSubmit(onSubmit)}
                                    label="Lưu"
                                    labelClasses="font-JakartaBold text-white"
                                    className={`mt-4 min-w-[120px] rounded-md ${isValid ? 'bg-black' : 'bg-[#ccc]'}`}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['35%', '35%']}
            >
                <BottomSheetScrollView
                    className="rounded-t"
                    style={{
                        flex: 1,
                        paddingTop: 20,
                    }}
                >
                    <TouchableOpacity onPress={takePicture}>
                        <View className="border-b border-gray-200 rounded-md flex-row p-4 items-center justify-center">
                            <Text className="font-JakartaMedium">Chụp ảnh</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage}>
                        <View className="border-b border-gray-200 rounded-md flex-row p-4 items-center justify-center">
                            <Text className="font-JakartaMedium">
                                Chọn ảnh từ thư viện
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                        <View className="border-b border-gray-200 rounded-md flex-row p-4 items-center justify-center">
                            <Text className="font-JakartaMedium">Xem ảnh</Text>
                        </View>
                    </TouchableOpacity>
                </BottomSheetScrollView>
                <TouchableOpacity
                    onPress={() => bottomSheetRef.current?.close()}
                >
                    <View className="bg-black mb-4 rounded-md flex-row mx-5 p-3 items-center justify-center">
                        <Text className="font-JakartaMedium text-white">
                            Hủy
                        </Text>
                    </View>
                </TouchableOpacity>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default EditProfile;
