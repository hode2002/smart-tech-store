import React, { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import productApiRequest, {
    ProductReviewResponseType,
    CreateProductReviewType,
} from '@/lib/apiRequest/product';
import { obfuscateEmail } from '@/lib/utils';
import { ReviewItem } from '@/schemaValidations/product.schema';
import moment from 'moment';
import adminApiRequest, {
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/lib/apiRequest/admin';
import { Image, TextInput, View, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';
import { useAuthStore, useUserStore } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { icons } from '@/constants';
import { ResizeMode, Video } from 'expo-av';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const ProductReview = ({
    product_option_id,
    fetchProduct,
    reviews,
    comment,
    rated,
    replyMode,
    setReplyMode,
    setComment,
    setRated,
    editMode,
    setEditMode,
    setReplyReview,
    imageFiles,
    setImageFiles,
    videoFile,
    setVideoFile,
}: {
    product_option_id: string;
    fetchProduct: () => Promise<void>;
    reviews: ReviewItem[];
    comment: string;
    rated: number;
    replyMode: boolean;
    setReplyMode: React.Dispatch<React.SetStateAction<boolean>>;
    setComment: React.Dispatch<React.SetStateAction<string>>;
    setRated: React.Dispatch<React.SetStateAction<number>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    setReplyReview: React.Dispatch<
        React.SetStateAction<ReviewItem | undefined>
    >;
    imageFiles: FileList | undefined;
    setImageFiles: React.Dispatch<React.SetStateAction<FileList | undefined>>;
    videoFile: File | undefined;
    setVideoFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
    const { accessToken } = useAuthStore((state) => state);
    const { profile: userProfile } = useUserStore((state) => state);
    const [loading, setLoading] = useState(false);

    const handleEditReview = async () => {
        if (loading) return;
        setLoading(true);

        const images: string[] = [];

        if (imageFiles && imageFiles?.length > 0) {
            const response = (await adminApiRequest.uploadMultipleFiles(
                accessToken,
                imageFiles,
                '/ProductReviews',
            )) as UploadMultipleFilesResponseType;
            if (response?.data) {
                response.data.map((item) => {
                    return images.push(item.key);
                });
            }
        }

        let video_url: string | undefined;
        if (videoFile) {
            const response = (await adminApiRequest.uploadFile(
                accessToken,
                videoFile,
                '/ProductReviews',
            )) as UploadSingleFileResponseType;
            if (response?.data) {
                video_url = response.data.key;
            }
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

        setEditMode(!editMode);
        setLoading(false);
        setImageFiles(undefined);
        setVideoFile(undefined);

        if (response?.statusCode === 201) {
            Toast.show({
                type: 'success',
                text1: 'Cập nhật thành công',
            });
            await fetchProduct();
            setReplyMode(false);
            // router.refresh();
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (loading) return;
        setLoading(true);

        const response = (await productApiRequest.deleteProductReview(
            accessToken,
            id,
        )) as ProductReviewResponseType;

        setLoading(false);

        if (response?.statusCode === 200) {
            await fetchProduct();
            // router.refresh();
        }

        setComment('');
        setImageFiles(undefined);
        setVideoFile(undefined);
        setRated(5);
    };

    const getReviewImages = () => {
        const data: {
            url: string;
            star: number;
            type: 'image' | 'video';
        }[] = [];

        reviews.forEach((review) => {
            if (review.video_url) {
                data.push({
                    url: review.video_url,
                    star: review.star,
                    type: 'video',
                });
            }
            review.review_images?.forEach((item) =>
                data.push({
                    url: item.image_url,
                    star: review.star,
                    type: 'image',
                }),
            );
        });

        return data;
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

    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    return (
        <GestureHandlerRootView>
            <View className="mt-8">
                <View className="mb-4 flex-row gap-4 flex-wrap items-center">
                    {reviews &&
                        getReviewImages()
                            .slice(0, 5)
                            .map((item, index) => {
                                if (index === 4) {
                                    return (
                                        // <ShowReviewImageModal
                                        //     key={index}
                                        //     getReviewImages={getReviewImages}
                                        //     url={item.url}
                                        // />
                                        <Button
                                            label={`Xem ${getReviewImages().length - 5} ảnh từ khách hàng`}
                                            onPress={handleOpenBottomSheet}
                                        >
                                            <View className="bg-[rgba(0,0,0,.8)] relative rounded-xl cursor-pointer">
                                                {item.url.includes('/image') ? (
                                                    <Image
                                                        alt="Review image"
                                                        className="object-contain opacity-25"
                                                        width={70}
                                                        height={70}
                                                        source={{
                                                            uri: item.url,
                                                        }}
                                                    />
                                                ) : (
                                                    <Video
                                                        source={{
                                                            uri: item.url,
                                                        }}
                                                        useNativeControls
                                                        resizeMode={
                                                            ResizeMode.CONTAIN
                                                        }
                                                        style={{
                                                            width: 232,
                                                            height: 150,
                                                        }}
                                                    />
                                                )}
                                            </View>
                                        </Button>
                                    );
                                } else {
                                    return item.type === 'image' ? (
                                        <Image
                                            key={index}
                                            alt="Review image"
                                            className="object-cover rounded-md"
                                            width={116}
                                            height={116}
                                            source={{
                                                uri: item.url,
                                            }}
                                        />
                                    ) : (
                                        <Video
                                            key={index}
                                            source={{
                                                uri: item.url,
                                            }}
                                            useNativeControls
                                            resizeMode={ResizeMode.CONTAIN}
                                            style={{
                                                width: 232,
                                                height: 150,
                                            }}
                                        />
                                    );
                                }
                            })}
                </View>
                {reviews &&
                    reviews.map((review) => (
                        <View key={review.id} className="py-4 border-y">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row gap-2 items-center">
                                    <Avatar>
                                        <AvatarImage
                                            source={{
                                                uri: review.user.avatar,
                                            }}
                                        />
                                        <AvatarFallback>avatar</AvatarFallback>
                                    </Avatar>
                                    <View className="flex-col">
                                        <Text className="font-JakartaBold mr-4">
                                            {userProfile.email !==
                                            review.user.email
                                                ? obfuscateEmail(
                                                      review.user.email,
                                                  )
                                                : review.user.email}
                                        </Text>
                                        <Text className="font-JakartaMedium">
                                            {moment(review.created_at).format(
                                                'DD-MM-YYYY',
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="mt-2 flex-row items-center">
                                {editMode ? (
                                    <StarRating
                                        onChange={(value) => setRated(value)}
                                        rating={Math.floor(review.star)}
                                        starSize={26}
                                    />
                                ) : (
                                    <StarRatingDisplay
                                        rating={Math.floor(review.star)}
                                        starSize={26}
                                    />
                                )}
                            </View>
                            <View className="mt-2 flex-col gap-4">
                                {editMode ? (
                                    <View className="grid w-full gap-2 mb-4">
                                        {review.review_images && (
                                            <View className="flex-col gap-2 flex-wrap">
                                                <View className="flex-row flex-wrap items-center gap-2">
                                                    {videoFile ? (
                                                        <Video
                                                            source={{
                                                                uri: URL.createObjectURL(
                                                                    videoFile,
                                                                ),
                                                            }}
                                                            useNativeControls
                                                            resizeMode={
                                                                ResizeMode.CONTAIN
                                                            }
                                                            style={{
                                                                width: 232,
                                                                height: 150,
                                                            }}
                                                        />
                                                    ) : (
                                                        review?.video_url && (
                                                            <Video
                                                                source={{
                                                                    uri: review.video_url,
                                                                }}
                                                                useNativeControls
                                                                resizeMode={
                                                                    ResizeMode.CONTAIN
                                                                }
                                                                style={{
                                                                    width: 232,
                                                                    height: 150,
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                    {editMode && !videoFile && (
                                                        <Button
                                                            label="Thêm video"
                                                            disabled={loading}
                                                            onPress={pickVideo}
                                                            labelClasses="font-JakartaMedium"
                                                            className="flex-row w-[116px] h-[116px] rounded-md border border-dashed"
                                                        />
                                                    )}
                                                </View>
                                                <View className="flex-row items-center gap-2 flex-wrap">
                                                    {imageFiles
                                                        ? Array.from(
                                                              imageFiles,
                                                          ).map(
                                                              (file, index) => (
                                                                  <Image
                                                                      key={
                                                                          index
                                                                      }
                                                                      alt="Review image"
                                                                      className="rounded-md"
                                                                      width={
                                                                          116
                                                                      }
                                                                      height={
                                                                          116
                                                                      }
                                                                      src={URL.createObjectURL(
                                                                          file,
                                                                      )}
                                                                  />
                                                              ),
                                                          )
                                                        : review.review_images?.map(
                                                              (item) => (
                                                                  <Image
                                                                      key={
                                                                          item.image_url
                                                                      }
                                                                      alt="Review image"
                                                                      className="object-contain rounded-md"
                                                                      width={
                                                                          116
                                                                      }
                                                                      height={
                                                                          116
                                                                      }
                                                                      source={{
                                                                          uri: item.image_url,
                                                                      }}
                                                                  />
                                                              ),
                                                          )}
                                                    {editMode && (
                                                        <Button
                                                            label="Thêm ảnh"
                                                            disabled={loading}
                                                            onPress={pickImage}
                                                            labelClasses="font-JakartaMedium"
                                                            className="my-2 flex w-[116px] h-[116px] rounded-md border border-dashed"
                                                        />
                                                    )}
                                                </View>
                                            </View>
                                        )}
                                        <TextInput
                                            multiline
                                            numberOfLines={4}
                                            onChangeText={(value) =>
                                                setComment(value)
                                            }
                                            value={comment}
                                            textAlignVertical="top"
                                            className="border border-gray-200 rounded-md p-4"
                                        />
                                        <View className="flex gap-2">
                                            <Button
                                                label="Lưu"
                                                labelClasses="text-white"
                                                className="bg-black min-w-[100px]"
                                                disabled={loading}
                                                onPress={handleEditReview}
                                            />
                                            <Button
                                                label="Hủy"
                                                disabled={loading}
                                                variant={'default'}
                                                className="min-w-[100px]"
                                                onPress={() => {
                                                    setEditMode(!editMode);
                                                    setImageFiles(undefined);
                                                    setVideoFile(undefined);
                                                }}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View className="flex-col gap-2">
                                        <View className="flex-row items-center justify-between gap-2">
                                            <Text className="text-md font-JakartaSemiBold">
                                                {review.comment}
                                            </Text>
                                            <View>
                                                {review.user.email ===
                                                userProfile.email
                                                    ? !editMode && (
                                                          <View className="flex-row items-center gap-4">
                                                              <View className="flex-row items-center gap-1">
                                                                  <Button
                                                                      className="px-0"
                                                                      label="Chỉnh sửa"
                                                                      disabled={
                                                                          loading
                                                                      }
                                                                      variant={
                                                                          'link'
                                                                      }
                                                                      onPress={() => {
                                                                          setComment(
                                                                              review.comment,
                                                                          );
                                                                          setEditMode(
                                                                              !editMode,
                                                                          );
                                                                      }}
                                                                  />
                                                                  <Image
                                                                      source={
                                                                          icons.pencil
                                                                      }
                                                                      className="w-5 h-5"
                                                                  />
                                                              </View>
                                                              <View className="flex-row items-center gap-1">
                                                                  <Button
                                                                      className="px-0"
                                                                      label="Xóa"
                                                                      variant={
                                                                          'link'
                                                                      }
                                                                      disabled={
                                                                          loading
                                                                      }
                                                                      onPress={() => {
                                                                          Alert.alert(
                                                                              '',
                                                                              'Xóa đánh giá này?',
                                                                              [
                                                                                  {
                                                                                      text: 'Hủy',
                                                                                      onPress:
                                                                                          () => {},
                                                                                      style: 'cancel',
                                                                                  },
                                                                                  {
                                                                                      text: 'Xác nhận',
                                                                                      onPress:
                                                                                          () => {
                                                                                              handleDeleteReview(
                                                                                                  review.id,
                                                                                              );
                                                                                          },
                                                                                  },
                                                                              ],
                                                                          );
                                                                      }}
                                                                  />
                                                                  <Image
                                                                      source={
                                                                          icons.trash
                                                                      }
                                                                      className="w-5 h-5"
                                                                  />
                                                              </View>
                                                          </View>
                                                      )
                                                    : accessToken && (
                                                          <Button
                                                              label="Trả lời"
                                                              variant={'link'}
                                                              onPress={() => {
                                                                  setReplyReview(
                                                                      review,
                                                                  );
                                                                  setReplyMode(
                                                                      !replyMode,
                                                                  );
                                                              }}
                                                          />
                                                      )}
                                            </View>
                                        </View>
                                        {review.review_images &&
                                            review.review_images.length > 0 && (
                                                <View className="gap-2 space-y-4 pl-10">
                                                    <View className="absolute top-0 left-4 w-0.5 bg-gray-300 h-full"></View>
                                                    {review?.video_url && (
                                                        <Video
                                                            source={{
                                                                uri: review.video_url,
                                                            }}
                                                            useNativeControls
                                                            resizeMode={
                                                                ResizeMode.CONTAIN
                                                            }
                                                            style={{
                                                                width: 232,
                                                                height: 150,
                                                            }}
                                                        />
                                                    )}
                                                    <View className="flex-row items-center gap-2 min-h-[70px] flex-wrap">
                                                        {review.review_images?.map(
                                                            (item) => (
                                                                <Image
                                                                    key={
                                                                        item.image_url
                                                                    }
                                                                    alt="Review image"
                                                                    className="object-contain rounded-md"
                                                                    width={70}
                                                                    height={70}
                                                                    source={{
                                                                        uri: item.image_url,
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </View>
                                                </View>
                                            )}
                                    </View>
                                )}
                            </View>
                            {review?.children && (
                                <View className="pt-4 space-y-4 pl-10 relative">
                                    <View className="absolute top-0 left-4 w-0.5 bg-gray-300 h-full"></View>
                                    {review.children.map((child) => (
                                        <View
                                            key={child.created_at}
                                            className="ms-6 mt-4 relative"
                                        >
                                            <View className="flex-row gap-2 items-center">
                                                <Avatar>
                                                    <AvatarImage
                                                        source={{
                                                            uri: child.user
                                                                .avatar,
                                                        }}
                                                    />
                                                    <AvatarFallback>
                                                        avatar
                                                    </AvatarFallback>
                                                </Avatar>
                                                <View className="flex-col">
                                                    <Text className="font-JakartaBold mr-4">
                                                        {obfuscateEmail(
                                                            child?.user.email,
                                                        )}
                                                    </Text>
                                                    <Text>
                                                        {moment(
                                                            child.created_at,
                                                        ).format('DD-MM-YYYY')}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="mt-1">
                                                <Text className="flex-row gap-2">
                                                    {child.comment}
                                                    {child.user.email ===
                                                        userProfile.email &&
                                                        !replyMode && (
                                                            <Button
                                                                label=""
                                                                variant={
                                                                    'ghost'
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                onPress={() => {
                                                                    handleDeleteReview(
                                                                        child.id,
                                                                    );
                                                                }}
                                                            >
                                                                <Image
                                                                    source={
                                                                        icons.trash
                                                                    }
                                                                    resizeMode="contain"
                                                                    className="h-4 w-4"
                                                                />
                                                            </Button>
                                                        )}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['100%', '100%']}
            >
                <BottomSheetScrollView
                    style={{
                        flex: 1,
                        padding: 20,
                    }}
                >
                    <View className="text-center">
                        <Text>
                            {getReviewImages().length} ảnh từ khách hàng
                        </Text>
                    </View>
                    <View className="flex-row gap-8 py-5 flex-wrap">
                        {getReviewImages().map((item, index) => (
                            <View
                                key={index}
                                className="flex-col justify-center items-center gap-2 border"
                            >
                                {item.type === 'image' ? (
                                    <Image
                                        alt="Review image"
                                        className="object-contain rounded-xl"
                                        width={70}
                                        height={70}
                                        source={{
                                            uri: item.url,
                                        }}
                                    />
                                ) : (
                                    <Video
                                        source={{
                                            uri: item.url,
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.CONTAIN}
                                        style={{
                                            width: 232,
                                            height: 150,
                                        }}
                                    />
                                )}
                                <StarRatingDisplay
                                    starSize={20}
                                    rating={Math.floor(item.star)}
                                />
                            </View>
                        ))}
                    </View>
                </BottomSheetScrollView>
                <Button
                    onPress={() => {
                        bottomSheetRef.current?.close();
                    }}
                    label="Đóng"
                    labelClasses="font-JakartaBold text-white"
                    className="m-4 font-JakartaBold bg-black min-w-[120px] rounded-md"
                />
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default ProductReview;
