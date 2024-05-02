'use client';

import React, { useState, useEffect } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Scrollbar, A11y, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    BadgeCheck,
    MessageSquareQuote,
    PencilIcon,
    ShieldCheck,
    Trash,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';
import productApiRequest, {
    ProductReviewResponseType,
    CreateProductReviewType,
} from '@/apiRequests/product';
import {
    ProductDetailType,
    GetProductDetailResponseType,
    ProductDescriptionType,
    TechnicalSpecsItem,
    RatingType,
    ReviewItem,
} from '@/schemaValidations/product.schema';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/apiRequests/account';
import { setCartProducts } from '@/lib/store/slices';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@material-tailwind/react';
import orderApiRequest, {
    GetOrderStatusResponseType,
    OrderResponseType,
} from '@/apiRequests/order';

type Props = {
    params: { slug: string };
};

export default function SmartphoneDetailPage({ params }: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const userProfile = useAppSelector((state) => state.user.profile);
    const cartProducts = useAppSelector((state) => state.user.cart);
    const [userOrders, setUserOrders] = useState<OrderResponseType[] | []>([]);

    const fetchProduct = async () => {
        const response = (await productApiRequest.getProductsBySlug(
            params.slug,
        )) as GetProductDetailResponseType;
        setProductInfo(response.data);
    };

    const fetchUserOrder = async () => {
        const response = (await orderApiRequest.getOrdersByStatus(
            token,
            2,
        )) as GetOrderStatusResponseType;
        setUserOrders(response?.data);
    };

    useEffect(() => {
        fetchProduct().then();
        if (token) {
            fetchUserOrder().then();
        }
    }, [token]);

    const [productInfo, setProductInfo] = useState<ProductDetailType>();
    const [selectedOption, setSelectedOption] = useState<number>(0);
    const warranties = productInfo?.warranties as string[];
    const promotions = productInfo?.promotions as string[];
    const descriptions = productInfo?.descriptions as ProductDescriptionType[];
    const technicalSpecs = productInfo?.product_options?.[selectedOption]
        ?.technical_specs as TechnicalSpecsItem[];
    const rating = productInfo?.product_options?.[selectedOption]
        ?.rating as RatingType;
    const reviews = productInfo?.product_options?.[selectedOption]
        ?.reviews as ReviewItem[];

    useEffect(() => {
        productInfo?.product_options?.forEach((item, index) => {
            if (item.slug === params.slug) {
                setSelectedOption(index);
            }
        });
    }, [productInfo]);

    const convertProductName = () => {
        return (
            productInfo?.name +
            ' ' +
            productInfo?.product_options[selectedOption].sku.replaceAll(
                '-',
                ' ',
            )
        ).toLowerCase();
    };

    const handleAddToCart = async () => {
        if (!token) {
            toast({
                description: 'Vui lòng đăng nhập để tiếp tục',
                variant: 'default',
            });
            return router.push('/login');
        }

        const response = (await accountApiRequest.addToCart(token, {
            productOptionId: productInfo?.product_options[selectedOption]
                .id as string,
            quantity: 1,
        })) as AddToCartResponseType;

        if (response?.statusCode === 201) {
            const cartItems = cartProducts.filter(
                (p) =>
                    p.selected_option.id !== response.data.selected_option.id,
            );
            dispatch(setCartProducts([...cartItems, response.data]));
            toast({
                description: 'Thêm thành công',
                variant: 'default',
            });
        }
    };

    const [rated, setRated] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [replyReview, setReplyReview] = useState<ReviewItem>();
    const [replyMode, setReplyMode] = useState<boolean>(false);

    const handleSubmitReview = async () => {
        if (!comment) return;

        const reviewObject: CreateProductReviewType = {
            product_option_id: productInfo?.product_options?.[selectedOption]
                .id as string,
            comment,
            star: rated,
        };

        const response = (await productApiRequest.createProductReview(
            token,
            reviewObject,
        )) as ProductReviewResponseType;

        if (response?.statusCode === 201) {
            toast({
                description: 'Đánh giá của bạn đã được ghi lại',
            });
            await fetchProduct();
        }

        setComment('');
        setRated(5);
        router.refresh();
    };

    const handleEditReview = async () => {
        setEditMode(!editMode);
        const reviewObject: CreateProductReviewType = {
            product_option_id: productInfo?.product_options?.[selectedOption]
                .id as string,
            comment,
            star: rated,
        };

        const response = (await productApiRequest.createProductReview(
            token,
            reviewObject,
        )) as ProductReviewResponseType;

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
        const response = (await productApiRequest.deleteProductReview(
            token,
            id,
        )) as ProductReviewResponseType;

        if (response?.statusCode === 200) {
            await fetchProduct();
            router.refresh();
        }

        setComment('');
        setRated(5);
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

    return (
        productInfo && (
            <div className="py-2 bg-popover min-h-screen">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link className="underline" href="/">
                                Trang chủ
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link className="underline" href="/smartphone">
                                Điện thoại
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="capitalize">
                                {convertProductName()}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="w-full flex flex-col md:flex-row md:gap-16 py-4 border-b-2 border-border bg-background">
                    <p className="font-bold text-[24px] capitalize">
                        {convertProductName()}
                    </p>
                    {rating && rating?.total_reviews !== 0 && (
                        <div className="flex justify-start items-center gap-2">
                            <span className="font-bold text-[24px]">
                                {rating.overall}
                            </span>
                            <div className="inline-flex items-center">
                                <Rating
                                    value={Math.floor(rating.overall)}
                                    readonly
                                />
                            </div>
                            <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                                ({rating.total_reviews})
                            </p>
                        </div>
                    )}
                </div>

                <div className="my-8 flex flex-col md:flex-row">
                    <div className="w-full md:w-[60%] md:pr-4 h-full">
                        <Swiper
                            className="h-auto rounded-lg"
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={50}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                        >
                            {productInfo &&
                                productInfo?.product_options[
                                    selectedOption
                                ].product_images.map((item) => {
                                    return (
                                        <SwiperSlide key={item.id}>
                                            <Link href={'#'} className="h-full">
                                                <Image
                                                    className="rounded-lg"
                                                    src={item.image_url}
                                                    height={400}
                                                    width={786}
                                                    alt={item.image_alt_text}
                                                />
                                            </Link>
                                        </SwiperSlide>
                                    );
                                })}
                        </Swiper>
                    </div>

                    <div className="w-full md:w-[40%] py-4 md:py-0 md:px-7 flex flex-col justify-evenly">
                        <div>
                            <div className="mb-10">
                                <p className="text-[#E83A45] font-bold text-[32px]">
                                    {formatPrice(
                                        productInfo.price -
                                        (productInfo.price *
                                            productInfo.product_options[
                                                selectedOption
                                            ].discount) /
                                        100 +
                                        productInfo.product_options[
                                            selectedOption
                                        ].price_modifier,
                                    )}
                                </p>

                                <p className="opacity-80 text-[20px]">
                                    {productInfo.product_options[selectedOption]
                                        .discount !== 0 && (
                                            <>
                                                <span className="line-through ">
                                                    {formatPrice(
                                                        productInfo.price +
                                                        productInfo
                                                            .product_options[
                                                            selectedOption
                                                        ].price_modifier,
                                                    )}
                                                </span>
                                                <span className="ml-2">
                                                    -
                                                    {
                                                        productInfo.product_options[
                                                            selectedOption
                                                        ].discount
                                                    }
                                                    %
                                                </span>
                                            </>
                                        )}
                                </p>
                            </div>

                            {productInfo?.product_options?.[0]?.options
                                ?.length > 0 && (
                                    <div className="w-full">
                                        <div className="flex gap-2 items-center my-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {productInfo?.product_options?.map(
                                                    (productOption, index) => (
                                                        <Link
                                                            key={index}
                                                            href={
                                                                productOption.slug
                                                            }
                                                        >
                                                            <Button
                                                                className="capitalize"
                                                                variant={
                                                                    index ===
                                                                        selectedOption
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                            >
                                                                {productOption.options.map(
                                                                    (el, elIdx) => {
                                                                        return (
                                                                            <span
                                                                                className="capitalize mx-1 min-w-[80px]"
                                                                                key={
                                                                                    elIdx
                                                                                }
                                                                            >
                                                                                {
                                                                                    el.value
                                                                                }
                                                                            </span>
                                                                        );
                                                                    },
                                                                )}
                                                            </Button>
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div>
                            <Button
                                variant={'destructive'}
                                className="w-full px-5 py-8 mb-2 dark:bg-primary dark:text-primary-foreground"
                            >
                                Mua ngay
                            </Button>
                            <Button
                                variant={'outline'}
                                onClick={handleAddToCart}
                                className="w-full px-5 py-8 bg-primary text-primary-foreground"
                            >
                                Thêm vào giỏ hàng
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="my-8 flex flex-col-reverse md:flex-row">
                    <div className="w-full md:w-[60%] md:pr-4 h-full">
                        <div className="flex items-center justify-center rounded-lg border border-solid">
                            <ul className="block md:flex flex-wrap">
                                {warranties &&
                                    warranties.map((warranty, index) => {
                                        return (
                                            <li
                                                key={index}
                                                className="p-4 flex w-full md:w-[50%] items-start gap-4"
                                            >
                                                <ShieldCheck
                                                    color="#2ac050"
                                                    className="w-[40px]"
                                                />
                                                <p className="w-[90%]">
                                                    {warranty}
                                                </p>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <Image
                                src={productInfo?.main_image}
                                width={710}
                                height={533}
                                alt="Điện thoại iPhone 14 Pro Max 1TB"
                            />
                        </div>

                        <div className="mt-8">
                            <p className="text-[20px] font-bold">
                                Thông tin sản phẩm
                            </p>
                            <ul>
                                {descriptions &&
                                    descriptions.map((description) => (
                                        <li
                                            key={description.id}
                                            className="py-4"
                                        >
                                            <p className="text-[20px] font-bold">
                                                {description.content}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div className="mt-8 border border-solid p-8 rounded-lg">
                            <p className="py-2 rounded-md text-[20px] font-bold capitalize">
                                Đánh giá {convertProductName()}
                            </p>

                            {rating && rating?.total_reviews !== 0 ? (
                                <div>
                                    <div className="flex justify-start items-center gap-2">
                                        <span className="font-bold">
                                            {rating?.overall}
                                        </span>
                                        <Rating
                                            value={Math.floor(rating.overall)}
                                            readonly
                                        />
                                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                                            ({rating?.total_reviews})
                                        </p>
                                    </div>

                                    <ul className="mt-8">
                                        {rating?.total_reviews &&
                                            rating.details
                                                .map((star, index) => {
                                                    if (index === 0) return;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex items-center mt-4"
                                                        >
                                                            <span className="font-medium flex gap-1 items-center">
                                                                {index}
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                    className="w-4 h-4 text-[#fbc02d] cursor-pointer"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                        clipRule="evenodd"
                                                                    ></path>
                                                                </svg>
                                                            </span>
                                                            <div className="w-2/4 h-2 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                                <div
                                                                    className={`h-2 bg-[#fbc02d] rounded ${star === 0 ? 'w-0' : `w-[${(Number(star / rating.total_reviews) * 1) / 100}%]`}`}
                                                                ></div>
                                                            </div>
                                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                <span>
                                                                    {Number(
                                                                        star /
                                                                        rating.total_reviews,
                                                                    ) * 100}
                                                                </span>
                                                                <span>%</span>
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                                .reverse()}
                                    </ul>

                                    <ul className="mt-8">
                                        {reviews &&
                                            reviews.map((review) => {
                                                return (
                                                    <li
                                                        key={review.id}
                                                        className="py-4 border-y"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar>
                                                                    <AvatarImage
                                                                        src={
                                                                            review
                                                                                .user
                                                                                .avatar
                                                                        }
                                                                    />
                                                                    <AvatarFallback>
                                                                        avatar
                                                                    </AvatarFallback>
                                                                </Avatar>

                                                                <p className="flex flex-col md:flex-row">
                                                                    <span className="font-bold mr-4">
                                                                        {
                                                                            review
                                                                                .user
                                                                                .email
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        {moment(
                                                                            review.created_at,
                                                                        ).format(
                                                                            'DD-MM-YYYY',
                                                                        )}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-2 inline-flex items-center">
                                                            {editMode ? (
                                                                <Rating
                                                                    value={Math.floor(
                                                                        review.star,
                                                                    )}
                                                                    onChange={(
                                                                        value,
                                                                    ) =>
                                                                        setRated(
                                                                            value,
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <Rating
                                                                    value={Math.floor(
                                                                        review.star,
                                                                    )}
                                                                    readonly
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="mt-2 flex gap-4">
                                                            {editMode ? (
                                                                <div className="grid w-full gap-2">
                                                                    <Textarea
                                                                        value={
                                                                            comment
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setComment(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            onClick={
                                                                                handleEditReview
                                                                            }
                                                                        >
                                                                            Lưu
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() =>
                                                                                setEditMode(
                                                                                    !editMode,
                                                                                )
                                                                            }
                                                                        >
                                                                            Hủy
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p>
                                                                    {
                                                                        review.comment
                                                                    }
                                                                </p>
                                                            )}

                                                            {review.user
                                                                .email ===
                                                                userProfile.email
                                                                ? !editMode && (
                                                                    <>
                                                                        <PencilIcon
                                                                            className="cursor-pointer"
                                                                            onClick={() => {
                                                                                setComment(
                                                                                    review.comment,
                                                                                );
                                                                                setEditMode(
                                                                                    !editMode,
                                                                                );
                                                                            }}
                                                                            color="#000000"
                                                                        />
                                                                        <Trash
                                                                            className="cursor-pointer"
                                                                            onClick={() => {
                                                                                handleDeleteReview(
                                                                                    review.id,
                                                                                );
                                                                            }}
                                                                            color="#000000"
                                                                        />
                                                                    </>
                                                                )
                                                                : token && (
                                                                    <MessageSquareQuote
                                                                        className="cursor-pointer"
                                                                        onClick={() => {
                                                                            setReplyReview(
                                                                                review,
                                                                            );
                                                                            setReplyMode(
                                                                                !replyMode,
                                                                            );
                                                                        }}
                                                                        color="#000000"
                                                                    />
                                                                )}
                                                        </div>

                                                        {review?.children &&
                                                            review.children.map(
                                                                (child) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                child.created_at
                                                                            }
                                                                            className="ms-6 mt-4"
                                                                        >
                                                                            <div className="flex gap-2 items-center">
                                                                                <Avatar>
                                                                                    <AvatarImage
                                                                                        src={
                                                                                            child
                                                                                                .user
                                                                                                .avatar
                                                                                        }
                                                                                    />
                                                                                    <AvatarFallback>
                                                                                        avatar
                                                                                    </AvatarFallback>
                                                                                </Avatar>

                                                                                <p className="flex flex-col md:flex-row">
                                                                                    <span className="font-bold mr-4">
                                                                                        {
                                                                                            child
                                                                                                .user
                                                                                                .email
                                                                                        }
                                                                                    </span>
                                                                                    <span>
                                                                                        {moment(
                                                                                            child.created_at,
                                                                                        ).format(
                                                                                            'DD-MM-YYYY',
                                                                                        )}
                                                                                    </span>
                                                                                </p>
                                                                            </div>

                                                                            <div className="mt-1">
                                                                                <p className="flex gap-2">
                                                                                    {
                                                                                        child.comment
                                                                                    }
                                                                                    {child
                                                                                        .user
                                                                                        .email ===
                                                                                        userProfile.email &&
                                                                                        !replyMode && (
                                                                                            <Trash
                                                                                                className="cursor-pointer"
                                                                                                onClick={() => {
                                                                                                    handleDeleteReview(
                                                                                                        child.id,
                                                                                                    );
                                                                                                }}
                                                                                                color="#000000"
                                                                                            />
                                                                                        )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-center">Chưa có đánh giá</p>
                            )}

                            {reviews.every(
                                (review) =>
                                    review.user.email !== userProfile.email,
                            ) &&
                                userOrders.some((el) =>
                                    el.order_details.some(
                                        (item) =>
                                            item.product.id ===
                                            productInfo?.product_options?.[
                                                selectedOption
                                            ].id,
                                    ),
                                ) && (
                                    <div className="mt-8 flex content-between">
                                        <div className="grid w-full gap-2">
                                            <Rating
                                                value={rated}
                                                onChange={(value) =>
                                                    setRated(value)
                                                }
                                            />
                                            <Textarea
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                                placeholder="Suy nghĩ của bạn về sản phẩm..."
                                            />
                                            <Button
                                                onClick={handleSubmitReview}
                                            >
                                                Viết đánh giá
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            {replyMode && (
                                <div className="mt-8 flex content-between">
                                    <div className="grid w-full gap-2">
                                        <Textarea
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                            placeholder={`Phản hồi ${replyReview?.user.email}`}
                                        />
                                        <Button onClick={handleReplyReview}>
                                            Gửi
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-[40%] py-4 md:py-0 md:px-7">
                        <div>
                            <p className="border border-solid p-2 rounded-t-lg">
                                Khuyến mãi
                            </p>
                            <ul className="border border-solid rounded-b-lg">
                                {promotions &&
                                    promotions.map((promotion, index) => (
                                        <li
                                            key={index}
                                            className="p-4 flex items-start gap-4"
                                        >
                                            <BadgeCheck
                                                color="#2ac050"
                                                className="w-[40px]"
                                            />
                                            <p className="text-sm w-[90%]">
                                                {promotion}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div className="mt-8">
                            <p className="font-bold text-[20px] capitalize">
                                Cấu hình {convertProductName()}
                            </p>
                            <ul className="border border-solid mt-2 rounded-lg">
                                {technicalSpecs &&
                                    technicalSpecs.map((item, index) => (
                                        <li
                                            key={index}
                                            className="px-2 py-3 flex border-b text-[14px] capitalize"
                                        >
                                            <p className="w-[45%]">
                                                {item.name}:
                                            </p>
                                            <div className="px-2 w-[calc(50%)]">
                                                <span>{item.value}</span>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
