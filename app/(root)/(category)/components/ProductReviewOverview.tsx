import React, { useLayoutEffect, useState } from 'react';
import { RatingType, ReviewItem } from '@/schemaValidations/product.schema';
import ProductRating from '@/app/(root)/(category)/components/ProductRating';
import ProductReview from '@/app/(root)/(category)/components/ProductReview';
import UserReview from '@/app/(root)/(category)/components/UserReview';
import orderApiRequest, {
    GetOrderStatusResponseType,
    OrderResponseType,
} from '@/lib/apiRequest/order';
import { useAuthStore } from '@/store';
import { Text, View } from 'react-native';

const ProductReviewOverview = ({
    product_option_id,
    fetchProduct,
    convertProductName,
    rating,
    reviews,
}: {
    product_option_id: string;
    fetchProduct: () => Promise<void>;
    convertProductName: () => string;
    rating: RatingType;
    reviews: ReviewItem[];
}) => {
    const { accessToken } = useAuthStore((state) => state);

    useLayoutEffect(() => {
        if (accessToken) {
            (async () => {
                const response = (await orderApiRequest.getOrdersByStatus(
                    accessToken,
                    2,
                )) as GetOrderStatusResponseType;
                setUserOrders(response?.data);
            })();
        }
    }, [accessToken]);

    const [userOrders, setUserOrders] = useState<OrderResponseType[] | []>([]);
    const [rated, setRated] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [replyReview, setReplyReview] = useState<ReviewItem | undefined>();
    const [replyMode, setReplyMode] = useState<boolean>(false);
    const [imageFiles, setImageFiles] = useState<FileList | undefined>();
    const [videoFile, setVideoFile] = useState<File | undefined>();

    return (
        <View className="mt-8 p-2 rounded-lg">
            <Text className="py-2 rounded-md text-[20px] font-JakartaBold capitalize">
                Đánh giá {convertProductName()}
            </Text>
            {rating && rating?.total_reviews !== 0 ? (
                <View>
                    <ProductRating rating={rating} />
                    <ProductReview
                        product_option_id={product_option_id}
                        fetchProduct={fetchProduct}
                        reviews={reviews}
                        comment={comment}
                        rated={rated}
                        replyMode={replyMode}
                        setReplyMode={setReplyMode}
                        setComment={setComment}
                        setRated={setRated}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        setReplyReview={setReplyReview}
                        imageFiles={imageFiles}
                        setImageFiles={setImageFiles}
                        videoFile={videoFile}
                        setVideoFile={setVideoFile}
                    />
                </View>
            ) : (
                <Text className="text-center mt-4">Chưa có đánh giá</Text>
            )}
            <UserReview
                reviews={reviews}
                comment={comment}
                product_option_id={product_option_id}
                rated={rated}
                fetchProduct={fetchProduct}
                replyMode={replyMode}
                setReplyMode={setReplyMode}
                replyReview={replyReview}
                setComment={setComment}
                setRated={setRated}
                userOrders={userOrders}
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                videoFile={videoFile}
                setVideoFile={setVideoFile}
            />
        </View>
    );
};

export default ProductReviewOverview;
