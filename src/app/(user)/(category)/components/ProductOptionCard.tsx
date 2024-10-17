'use client';

import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';

import { useAppDispatch, useAppSelector } from '@/lib/store';
import { formatPrice, generateSlug } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/apiRequests/account';
import { setCartProducts } from '@/lib/store/slices';
import { ProductDetailType } from '@/schemaValidations/product.schema';
import { Skeleton } from '@/components/ui/skeleton';

const ProductOptionCard = ({
    selectedOptionObj,
    productInfo,
    selectedOptionIndex,
    slug,
}: {
    selectedOptionObj: { name: string; value: string; adjust_price: number }[];
    productInfo: ProductDetailType | undefined;
    selectedOptionIndex: number;
    slug: string;
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const cartProducts = useAppSelector((state) => state.user.cart);

    const handleAddToCart = async () => {
        if (!token) {
            toast({
                description: 'Vui lòng đăng nhập để tiếp tục',
                variant: 'default',
            });
            return router.push('/login');
        }

        const productOptionId = productInfo?.product_options[
            selectedOptionIndex
        ].id as string;

        const response = (await accountApiRequest.addToCart(token, {
            productOptionId,
            quantity: 1,
        })) as AddToCartResponseType;

        if (response?.statusCode === 201) {
            const cartItems = cartProducts.filter(
                (p) =>
                    p.selected_option.id !== response.data.selected_option.id,
            );
            dispatch(
                setCartProducts([
                    ...cartItems,
                    { ...response.data, id: response.data.selected_option.id },
                ]),
            );
            toast({
                description: 'Thêm thành công',
                variant: 'default',
            });
        }
    };

    const handleSelectOption = (optionName: string, optionValue: string) => {
        const results = selectedOptionObj.map((el) => {
            if (el.name === optionName) {
                return {
                    ...el,
                    value: optionValue,
                };
            }
            return el;
        });

        const optionString = generateSlug(
            results.map((el) => el.value).join(' '),
        );
        const optionStringReverse = generateSlug(
            results
                .map((el) => el.value)
                .reverse()
                .join(' '),
        );

        const url = productInfo?.product_options.find(
            (p) =>
                p.slug.includes(optionString) ||
                p.slug.includes(optionStringReverse),
        )?.slug;

        if (url) {
            router.push(url);
        }
    };

    const calculateProductPrice = useCallback((): number => {
        if (!productInfo) return 0;

        const selectedOption = productInfo.product_options[selectedOptionIndex];
        const selectedOptionPriceModifier = selectedOption.price_modifier;
        const discount =
            ((productInfo.price + selectedOptionPriceModifier) *
                selectedOption.discount) /
            100;
        const productModifiedPrice =
            productInfo.price + selectedOptionPriceModifier - discount;

        return productModifiedPrice;
    }, [productInfo, selectedOptionIndex]);

    return (
        <div className="w-full md:w-[40%] py-4 md:py-0 md:px-7 flex flex-col justify-evenly">
            <div>
                <div className="mb-10">
                    {productInfo ? (
                        <>
                            <p className="text-[#E83A45] font-bold text-[32px]">
                                {formatPrice(calculateProductPrice())}
                            </p>
                            <p className="opacity-80 text-[20px]">
                                {productInfo.product_options[
                                    selectedOptionIndex
                                ].discount !== 0 && (
                                    <>
                                        <span className="line-through ">
                                            {formatPrice(
                                                productInfo.price +
                                                    productInfo.product_options[
                                                        selectedOptionIndex
                                                    ].price_modifier,
                                            )}
                                        </span>
                                        <span className="ml-2">
                                            -
                                            {
                                                productInfo.product_options[
                                                    selectedOptionIndex
                                                ].discount
                                            }
                                            %
                                        </span>
                                    </>
                                )}
                            </p>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-[48px] w-[400px] rounded-lg mb-2" />
                            <Skeleton className="h-[30px] w-[400px] rounded-lg" />
                        </>
                    )}
                </div>
                <div className="w-full min-h-[150px] flex flex-col gap-6 my-8 md:my-4">
                    {productInfo && productInfo?.options ? (
                        productInfo.options?.map((option, index) => (
                            <div key={index}>
                                <p className="mb-1 font-semibold">
                                    {option.name}
                                </p>
                                <div className="flex gap-2">
                                    {option?.values.sort()?.map((el) => {
                                        return (
                                            <div
                                                key={el}
                                                onClick={() =>
                                                    handleSelectOption(
                                                        option.name,
                                                        el,
                                                    )
                                                }
                                                className="min-w-max"
                                            >
                                                <Button
                                                    className="capitalize"
                                                    variant={
                                                        slug.includes(
                                                            generateSlug(
                                                                el.toLowerCase(),
                                                            ),
                                                        )
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    {el}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index}>
                                    <div className="mb-1 font-semibold">
                                        <Skeleton className="h-[24px] w-[100px] rounded-lg" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="min-w-max">
                                            <Skeleton className="h-[36px] w-[100px] rounded-lg" />
                                        </div>
                                        <div className="min-w-max">
                                            <Skeleton className="h-[36px] w-[100px] rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
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
    );
};

export default ProductOptionCard;
