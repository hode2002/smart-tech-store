import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import productApiRequest, {
    ProductReviewResponseType,
    CreateProductReviewType,
} from '@/apiRequests/product';
import { useAppSelector } from '@/lib/store';
import { obfuscateEmail } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@material-tailwind/react';
import { OrderResponseType } from '@/apiRequests/order';
import { ReviewItem } from '@/schemaValidations/product.schema';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Trash, Upload } from 'lucide-react';
import adminApiRequest, {
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { ReloadIcon } from '@radix-ui/react-icons';

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
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const userProfile = useAppSelector((state) => state.user.profile);

    const [loading, setLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setImageFiles(undefined);
    }, [setImageFiles]);

    const handleSubmitReview = async () => {
        if (!comment) return;
        if (loading) return;
        setLoading(true);

        const images: string[] = [];

        if (imageFiles && imageFiles?.length > 0) {
            const response = (await adminApiRequest.uploadMultipleFiles(
                token,
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
                token,
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
            token,
            reviewObject,
        )) as ProductReviewResponseType;

        setLoading(false);

        if (response?.statusCode === 201) {
            toast({
                description: 'Đánh giá của bạn đã được ghi lại',
            });
            await fetchProduct();
        }

        setComment('');
        setImageFiles(undefined);
        setVideoFile(undefined);
        setRated(5);
        router.refresh();
    };
    const handleReplyReview = async () => {
        if (!comment) return;

        const response = (await productApiRequest.createReplyReview(
            token,
            replyReview?.id as string,
            comment,
        )) as ProductReviewResponseType;

        if (response?.statusCode === 201) {
            await fetchProduct();
            router.refresh();
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
                    <div className="mt-8">
                        <div className="mb-4">
                            <div className="flex flex-col gap-2 flex-wrap">
                                <Input
                                    id="images"
                                    type="file"
                                    onChange={(e) =>
                                        setImageFiles(
                                            e.target?.files as FileList,
                                        )
                                    }
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                />
                                <Input
                                    id="video"
                                    type="file"
                                    ref={inputRef}
                                    onChange={(e) =>
                                        setVideoFile(
                                            e.target.files?.[0] as File,
                                        )
                                    }
                                    className="hidden"
                                    accept="video/*"
                                />
                                <div className="flex gap-2 flex-wrap">
                                    {videoFile ? (
                                        <div className="flex gap-8 items-center min-h-[200px]">
                                            <video
                                                ref={videoRef}
                                                controls
                                                className="object-contain rounded-xl"
                                                width={232}
                                                height={232}
                                                src={
                                                    videoFile
                                                        ? URL.createObjectURL(
                                                              videoFile,
                                                          )
                                                        : undefined
                                                }
                                            />
                                            <Button
                                                disabled={loading}
                                                variant={'ghost'}
                                                onClick={removeVideoFile}
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            disabled={loading}
                                            variant={'outline'}
                                            className="flex w-[232px] h-[232px] rounded-md border border-dashed"
                                        >
                                            <Label
                                                htmlFor="video"
                                                className="flex flex-col w-full h-full gap-2 items-center justify-center"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium opacity-70">
                                                    Thêm video
                                                </span>
                                            </Label>
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-wrap">
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
                                        disabled={loading}
                                        variant={'outline'}
                                        className="my-2 flex w-[116px] h-[116px] rounded-md border border-dashed"
                                    >
                                        <Label
                                            htmlFor="images"
                                            className="flex flex-col w-full h-full gap-2 items-center justify-center"
                                        >
                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium opacity-70">
                                                Thêm ảnh
                                            </span>
                                        </Label>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex content-between">
                            <div className="grid w-full gap-2">
                                <Rating
                                    value={rated}
                                    onChange={(value) => setRated(value)}
                                />
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Suy nghĩ của bạn về sản phẩm..."
                                />
                                {loading ? (
                                    <Button disabled>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    </Button>
                                ) : (
                                    <Button
                                        disabled={!comment}
                                        onClick={handleSubmitReview}
                                    >
                                        Viết đánh giá
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            {replyMode && (
                <div className="mt-8 flex content-between">
                    <div className="grid w-full gap-2">
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={`Phản hồi ${obfuscateEmail(replyReview?.user.email)}`}
                        />
                        <Button onClick={handleReplyReview}>Gửi</Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserReview;
