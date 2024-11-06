import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { obfuscateEmail } from '@/lib/utils';
import StarRating from 'react-native-star-rating-widget';
import { ReviewItem } from '@/schemaValidations/product.schema';
import { ActivityIndicator, Image, TextInput, View } from 'react-native';
import { icons } from '@/constants';
import { OrderResponseType } from '@/lib/apiRequest/order';
import { useAuthStore, useUserStore } from '@/store';
import productApiRequest, {
    CreateProductReviewType,
    ProductReviewResponseType,
} from '@/lib/apiRequest/product';
import adminApiRequest, {
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/lib/apiRequest/admin';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';

const UserReview = ({
    reviews,
    comment,
    product_option_id,
    rated,
    fetchProduct,
    replyMode,
    setReplyMode,
    replyReview,
    setComment,
    setRated,
    userOrders,
    imageFiles,
    setImageFiles,
    videoFile,
    setVideoFile,
}: {
    reviews: ReviewItem[];
    comment: string;
    product_option_id: string;
    rated: number;
    fetchProduct: () => Promise<void>;
    replyMode: boolean;
    setReplyMode: React.Dispatch<React.SetStateAction<boolean>>;
    replyReview: ReviewItem | undefined;
    setComment: React.Dispatch<React.SetStateAction<string>>;
    setRated: React.Dispatch<React.SetStateAction<number>>;
    userOrders: OrderResponseType[] | [];
    imageFiles: FileList | undefined;
    setImageFiles: React.Dispatch<React.SetStateAction<FileList | undefined>>;
    videoFile: File | undefined;
    setVideoFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
    const { accessToken } = useAuthStore((state) => state);
    const { profile: userProfile } = useUserStore((state) => state);

    const [loading, setLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setImageFiles(undefined);
    }, [setImageFiles]);

    const reloadPage = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleSubmitReview = async () => {
        if (!comment) return;
        if (loading) return;
        setLoading(true);

        const images: string[] = [];

        if (imageFiles && imageFiles?.length > 0) {
            const response = (await adminApiRequest.uploadMultipleFiles(
                accessToken,
                imageFiles,
                '/ProductReviews',
            )) as UploadMultipleFilesResponseType;
            response.data.map((res) => {
                return images.push(res.key);
            });
        }

        let video_url: string | undefined;
        if (videoFile) {
            const response = (await adminApiRequest.uploadFile(
                accessToken,
                videoFile,
                '/ProductReviews',
            )) as UploadSingleFileResponseType;
            video_url = response.data.key;
        }

        const reviewObject: CreateProductReviewType = {
            product_option_id,
            comment,
            star: rated,
            images,
            video_url,
        };

        const response = (await productApiRequest.createProductReview(
            accessToken,
            reviewObject,
        )) as ProductReviewResponseType;

        setLoading(false);

        if (response?.statusCode === 201) {
            Toast.show({
                type: 'success',
                text1: 'Đánh giá của bạn đã được ghi lại',
            });
            await fetchProduct();
        }

        setComment('');
        setImageFiles(undefined);
        setVideoFile(undefined);
        setRated(5);
        reloadPage();
        // router.refresh();
    };
    const handleReplyReview = async () => {
        if (!comment) return;

        const response = (await productApiRequest.createReplyReview(
            accessToken,
            replyReview?.id as string,
            comment,
        )) as ProductReviewResponseType;

        if (response?.statusCode === 201) {
            await fetchProduct();
            reloadPage();
            // router.refresh();
        }

        setReplyMode(false);
        setComment('');
        setRated(5);
    };

    const removeVideoFile = () => {
        if (videoRef?.current) {
            videoRef.current.src = '';
            videoRef.current.remove();
        }
        if (videoFile) {
            URL.revokeObjectURL(videoRef.current?.src ?? '');
        }
        setVideoFile(undefined);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const pickImage = async () => {
        const result: ImagePicker.ImagePickerResult =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

        if (!result.canceled) {
            setImageFiles(result.assets as any);
        }
    };

    const pickVideo = async () => {
        const result: ImagePicker.ImagePickerResult =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

        if (!result.canceled) {
            setVideoFile(result.assets[0] as any);
        }
    };

    return (
        <>
            {reviews.every(
                (review) => review.user.email !== userProfile.email,
            ) &&
                userOrders.some((el) =>
                    el.order_details.some(
                        (item) => item.product.id === product_option_id,
                    ),
                ) && (
                    <View key={refreshKey} className="mt-8">
                        <View className="mb-4">
                            <View className="flex flex-col gap-2 flex-wrap">
                                <View className="flex gap-2 flex-wrap">
                                    {videoFile ? (
                                        <View className="flex gap-8 items-center min-h-[200px]">
                                            <Video
                                                source={{
                                                    uri: URL.createObjectURL(
                                                        videoFile,
                                                    ),
                                                }}
                                                useNativeControls
                                                resizeMode={ResizeMode.CONTAIN}
                                                style={{
                                                    width: 232,
                                                    height: 150,
                                                }}
                                            />
                                            <View className="flex-row items-center gap-1">
                                                <Button
                                                    className="px-0"
                                                    label="Xóa"
                                                    variant={'link'}
                                                    disabled={loading}
                                                    onPress={removeVideoFile}
                                                />
                                                <Image
                                                    source={icons.trash}
                                                    className="w-5 h-5"
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <Button
                                            label="Thêm video"
                                            disabled={loading}
                                            onPress={pickVideo}
                                            labelClasses="font-JakartaMedium"
                                            className="flex-row w-[116px] h-[116px] rounded-md border border-dashed"
                                        />
                                    )}
                                </View>
                                <View className="flex gap-2 flex-wrap">
                                    {imageFiles &&
                                        Array.from(imageFiles).map(
                                            (file, index) => (
                                                <Image
                                                    key={index}
                                                    alt="Review image"
                                                    className="object-contain"
                                                    width={116}
                                                    height={116}
                                                    src={URL.createObjectURL(
                                                        file,
                                                    )}
                                                />
                                            ),
                                        )}
                                    <Button
                                        label="Thêm ảnh"
                                        disabled={loading}
                                        onPress={pickImage}
                                        labelClasses="font-JakartaMedium"
                                        className="my-2 flex w-[116px] h-[116px] rounded-md border border-dashed"
                                    />
                                </View>
                            </View>
                        </View>
                        <View className="flex content-between mb-4">
                            <View className="grid w-full gap-2">
                                <StarRating
                                    rating={rated}
                                    onChange={(value) => setRated(value)}
                                />
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={(value) => setComment(value)}
                                    value={comment}
                                    placeholder="Suy nghĩ của bạn về sản phẩm..."
                                    textAlignVertical="top"
                                    className="border border-gray-200 rounded-md p-4"
                                />
                                {loading ? (
                                    <View className="font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                        />
                                    </View>
                                ) : (
                                    <Button
                                        label="Viết đánh giá"
                                        disabled={!comment || loading}
                                        onPress={handleSubmitReview}
                                        className={`${!comment || loading ? 'bg-[#ccc]' : 'bg-black'}`}
                                        labelClasses="text-white"
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                )}
            {replyMode && (
                <View className="mt-8 flex content-between">
                    <View className="grid w-full gap-2">
                        <TextInput
                            multiline
                            numberOfLines={4}
                            onChangeText={(value) => setComment(value)}
                            value={comment}
                            placeholder={`Phản hồi ${obfuscateEmail(replyReview?.user.email)}`}
                            textAlignVertical="top"
                        />
                        <Button label="Gửi" onPress={handleReplyReview} />
                    </View>
                </View>
            )}
        </>
    );
};

export default UserReview;
