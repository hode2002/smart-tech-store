import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import productApiRequest, {
    ProductReviewResponseType,
    CreateProductReviewType,
} from '@/apiRequests/product';
import { useAppSelector } from '@/lib/store';
import { obfuscateEmail } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@material-tailwind/react';
import { ReviewItem } from '@/schemaValidations/product.schema';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquareQuote, PencilIcon, Trash, Upload } from 'lucide-react';
import moment from 'moment';
import { ReloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import adminApiRequest, {
    UploadMultipleFilesResponseType,
    UploadSingleFileResponseType,
} from '@/apiRequests/admin';
import { ShowReviewImageModal } from '@/app/(user)/(category)/components/ShowReviewImageModal';

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
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const userProfile = useAppSelector((state) => state.user.profile);
    const [loading, setLoading] = useState(false);

    const handleEditReview = async () => {
        if (loading) return;
        setLoading(true);

        const images: string[] = [];

        if (imageFiles && imageFiles?.length > 0) {
            const response = (await adminApiRequest.uploadMultipleFiles(
                token,
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
                token,
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
            token,
            reviewObject,
        )) as ProductReviewResponseType;

        setEditMode(!editMode);
        setLoading(false);
        setImageFiles(undefined);
        setVideoFile(undefined);

        if (response?.statusCode === 201) {
            toast({
                description: 'Cập nhật thành công',
            });
            await fetchProduct();
            setReplyMode(false);
            router.refresh();
        }
    };

    const handleDeleteReview = async (id: string) => {
        const isConfirm = window.confirm('Xóa đánh giá này?');
        if (!isConfirm) return;

        if (loading) return;
        setLoading(true);

        const response = (await productApiRequest.deleteProductReview(
            token,
            id,
        )) as ProductReviewResponseType;

        setLoading(false);

        if (response?.statusCode === 200) {
            await fetchProduct();
            router.refresh();
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

    return (
        <ul className="mt-8">
            <div className="mb-4 flex gap-4 flex-wrap">
                {reviews &&
                    getReviewImages()
                        .slice(0, 5)
                        .map((item, index) => {
                            if (index === 4) {
                                return (
                                    <ShowReviewImageModal
                                        key={index}
                                        getReviewImages={getReviewImages}
                                        url={item.url}
                                    />
                                );
                            } else {
                                return item.type === 'image' ? (
                                    <Image
                                        key={index}
                                        alt="Review image"
                                        className="object-cover rounded-md"
                                        width={116}
                                        height={116}
                                        src={item.url}
                                    />
                                ) : (
                                    <video
                                        key={index}
                                        controls
                                        className="object-contain rounded-xl"
                                        width={232}
                                        height={232}
                                        src={item.url}
                                    />
                                );
                            }
                        })}
            </div>
            {reviews &&
                reviews.map((review) => (
                    <li key={review.id} className="py-4 border-y">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <Avatar>
                                    <AvatarImage src={review.user.avatar} />
                                    <AvatarFallback>avatar</AvatarFallback>
                                </Avatar>
                                <p className="flex flex-col md:flex-row">
                                    <span className="font-bold mr-4">
                                        {userProfile.email !== review.user.email
                                            ? obfuscateEmail(review.user.email)
                                            : review.user.email}
                                    </span>
                                    <span>
                                        {moment(review.created_at).format(
                                            'DD-MM-YYYY',
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 inline-flex items-center">
                            {editMode &&
                            review.user.email === userProfile.email ? (
                                <Rating
                                    value={Math.floor(review.star)}
                                    onChange={(value) => setRated(value)}
                                />
                            ) : (
                                <Rating
                                    value={Math.floor(review.star)}
                                    readonly
                                />
                            )}
                        </div>
                        <div className="mt-2 flex flex-col gap-4">
                            {editMode &&
                            review.user.email === userProfile.email ? (
                                <div className="grid w-full gap-2 mb-4">
                                    {review.review_images && (
                                        <div className="flex flex-col gap-2 flex-wrap">
                                            <Input
                                                id="images"
                                                type="file"
                                                onChange={(e) =>
                                                    setImageFiles(
                                                        e.target
                                                            ?.files as FileList,
                                                    )
                                                }
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                            />
                                            <Input
                                                id="video"
                                                type="file"
                                                onChange={(e) =>
                                                    setVideoFile(
                                                        e.target
                                                            .files?.[0] as File,
                                                    )
                                                }
                                                className="hidden"
                                                accept="video/*"
                                            />
                                            <div className="flex gap-2 flex-wrap">
                                                {videoFile ? (
                                                    <video
                                                        controls
                                                        className="object-contain rounded-xl"
                                                        width={232}
                                                        height={232}
                                                        src={URL.createObjectURL(
                                                            videoFile,
                                                        )}
                                                    />
                                                ) : (
                                                    review?.video_url && (
                                                        <video
                                                            controls
                                                            className="object-contain rounded-xl"
                                                            width={232}
                                                            height={232}
                                                            src={
                                                                review.video_url
                                                            }
                                                        />
                                                    )
                                                )}
                                                {editMode && !videoFile && (
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
                                                {imageFiles
                                                    ? Array.from(
                                                          imageFiles,
                                                      ).map((file, index) => (
                                                          <Image
                                                              key={index}
                                                              alt="Review image"
                                                              className="object-contain rounded-md"
                                                              width={116}
                                                              height={116}
                                                              src={URL.createObjectURL(
                                                                  file,
                                                              )}
                                                          />
                                                      ))
                                                    : review.review_images?.map(
                                                          (item) => (
                                                              <Image
                                                                  key={
                                                                      item.image_url
                                                                  }
                                                                  alt="Review image"
                                                                  className="object-contain"
                                                                  width={116}
                                                                  height={116}
                                                                  src={
                                                                      item.image_url
                                                                  }
                                                              />
                                                          ),
                                                      )}
                                                {editMode && (
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
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <Textarea
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                    />
                                    <div className="flex gap-2">
                                        {loading ? (
                                            <Button
                                                disabled
                                                className="min-w-[100px]"
                                            >
                                                <ReloadIcon className="h-4 w-4 animate-spin" />
                                            </Button>
                                        ) : (
                                            <Button
                                                className="min-w-[100px]"
                                                onClick={handleEditReview}
                                            >
                                                Lưu
                                            </Button>
                                        )}
                                        <Button
                                            disabled={loading}
                                            className="min-w-[100px]"
                                            onClick={() => {
                                                setEditMode(!editMode);
                                                setImageFiles(undefined);
                                                setVideoFile(undefined);
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="w-full flex items-center justify-between gap-2">
                                        <p className="text-md font-semibold">
                                            {review.comment}
                                        </p>
                                        <div>
                                            {review.user.email ===
                                            userProfile.email
                                                ? !editMode && (
                                                      <div className="flex items-center">
                                                          <Button
                                                              disabled={loading}
                                                              variant={'ghost'}
                                                              onClick={() => {
                                                                  setComment(
                                                                      review.comment,
                                                                  );
                                                                  setEditMode(
                                                                      !editMode,
                                                                  );
                                                              }}
                                                          >
                                                              <PencilIcon />
                                                          </Button>
                                                          {loading ? (
                                                              <Button
                                                                  variant={
                                                                      'ghost'
                                                                  }
                                                                  disabled
                                                              >
                                                                  <ReloadIcon className="h-4 w-4 animate-spin" />
                                                              </Button>
                                                          ) : (
                                                              <Button
                                                                  variant={
                                                                      'ghost'
                                                                  }
                                                                  onClick={() => {
                                                                      handleDeleteReview(
                                                                          review.id,
                                                                      );
                                                                  }}
                                                              >
                                                                  <Trash />
                                                              </Button>
                                                          )}
                                                      </div>
                                                  )
                                                : token && (
                                                      <Button
                                                          variant={'ghost'}
                                                          onClick={() => {
                                                              setReplyReview(
                                                                  review,
                                                              );
                                                              setReplyMode(
                                                                  !replyMode,
                                                              );
                                                          }}
                                                      >
                                                          <MessageSquareQuote />
                                                      </Button>
                                                  )}
                                        </div>
                                    </div>
                                    {review.review_images &&
                                        review.review_images.length > 0 && (
                                            <div className="flex gap-2 pt-4 space-y-4 pl-10 relative">
                                                <div className="absolute top-0 left-4 w-0.5 bg-gray-300 h-full"></div>
                                                {review?.video_url && (
                                                    <video
                                                        controls
                                                        className="object-contain rounded-xl"
                                                        width={232}
                                                        height={232}
                                                        src={review.video_url}
                                                    />
                                                )}
                                                <div className="flex items-center gap-2 min-h-[116px] flex-wrap">
                                                    {review.review_images?.map(
                                                        (item) => (
                                                            <Image
                                                                key={
                                                                    item.image_url
                                                                }
                                                                alt="Review image"
                                                                className="object-contain rounded-md"
                                                                width={116}
                                                                height={116}
                                                                src={
                                                                    item.image_url
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                        {review?.children && (
                            <div className="pt-4 space-y-4 pl-10 relative">
                                <div className="absolute top-0 left-4 w-0.5 bg-gray-300 h-full"></div>
                                {review.children.map((child) => {
                                    return (
                                        <div
                                            key={child.created_at}
                                            className="ms-6 mt-4 relative"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={child.user.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        avatar
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="flex flex-col md:flex-row">
                                                    <span className="font-bold mr-4">
                                                        {obfuscateEmail(
                                                            child?.user.email,
                                                        )}
                                                    </span>
                                                    <span>
                                                        {moment(
                                                            child.created_at,
                                                        ).format('DD-MM-YYYY')}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="mt-1">
                                                <p className="flex items-center gap-2">
                                                    <span className="font-semibold">
                                                        {child.comment}
                                                    </span>
                                                    {child.user.email ===
                                                        userProfile.email &&
                                                        !replyMode && (
                                                            <>
                                                                {loading ? (
                                                                    <ReloadIcon className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Button
                                                                        variant={
                                                                            'ghost'
                                                                        }
                                                                        onClick={() => {
                                                                            handleDeleteReview(
                                                                                child.id,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Trash />
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </li>
                ))}
        </ul>
    );
};

export default ProductReview;
