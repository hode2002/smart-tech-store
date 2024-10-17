import React, { useLayoutEffect, useState } from 'react';
import { RatingType, ReviewItem } from '@/schemaValidations/product.schema';
import ProductRating from '@/app/(user)/(category)/components/ProductRating';
import ProductReview from '@/app/(user)/(category)/components/ProductReview';
import orderApiRequest, {
    GetOrderStatusResponseType,
    OrderResponseType,
} from '@/apiRequests/order';
import { useAppSelector } from '@/lib/store';
import UserReview from '@/app/(user)/(category)/components/UserReview';

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
    const token = useAppSelector((state) => state.auth.accessToken);

    useLayoutEffect(() => {
        if (token) {
            (async () => {
                const response = (await orderApiRequest.getOrdersByStatus(
                    token,
                    2,
                )) as GetOrderStatusResponseType;
                setUserOrders(response?.data);
            })();
        }
    }, [token]);

    const [userOrders, setUserOrders] = useState<OrderResponseType[] | []>([]);
    const [rated, setRated] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [replyReview, setReplyReview] = useState<ReviewItem | undefined>();
    const [replyMode, setReplyMode] = useState<boolean>(false);
    const [imageFiles, setImageFiles] = useState<FileList | undefined>();
    const [videoFile, setVideoFile] = useState<File | undefined>();

    return (
        <div className="mt-8 border border-solid p-8 rounded-lg">
            <p className="py-2 rounded-md text-[20px] font-bold capitalize">
                Đánh giá {convertProductName()}
            </p>
            {rating && rating?.total_reviews !== 0 ? (
                <div>
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
                </div>
            ) : (
                <p className="text-center mt-4">Chưa có đánh giá</p>
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
        </div>
    );
};

export default ProductReviewOverview;
