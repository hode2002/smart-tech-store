'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { ProductType, setCartProducts } from '@/lib/store/slices';
import { toast } from '@/components/ui/use-toast';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/apiRequests/account';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { formatPrice, generateSlug } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useScreen from '@/hooks/use-screen';

type Props = {
    product: ProductType;
};

export default function ProductCard(props: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const { isMobile } = useScreen();
    const cartProducts = useAppSelector((state) => state.user.cart);

    const { product } = props;
    const [productOption, setProductOption] = useState(
        product?.product_options[0],
    );
    const [selectedOptionObj, setSelectedOptionObj] = useState<
        { name: string; value: string; adjust_price?: number }[]
    >([]);

    useEffect(() => {
        setProductOption(product?.product_options[0]);
    }, [product?.product_options]);

    useEffect(() => {
        product?.product_options?.forEach((item) => {
            if (item.slug.includes(productOption.slug)) {
                setSelectedOptionObj(item.options);
            }
        });
    }, [product?.product_options, productOption.slug]);

    const productName = useMemo(
        () =>
            product.name +
            ' ' +
            productOption?.sku.replaceAll('-', ' ').toLowerCase(),
        [product, productOption],
    );

    const price = useMemo(
        () => formatPrice(Number(product.price + productOption.price_modifier)),
        [product.price, productOption.price_modifier],
    );

    const salePrice = useMemo(
        () =>
            formatPrice(
                Number(
                    product.price +
                        productOption.price_modifier -
                        ((product.price + productOption.price_modifier) *
                            productOption.discount) /
                            100,
                ),
            ),
        [product.price, productOption.discount, productOption.price_modifier],
    );

    const screenSpecs = useCallback(() => {
        const screenSizes = productOption.technical_specs.find(
            (spec) => spec.name.toLowerCase() === 'kích thước màn hình',
        )?.value;

        const screen = productOption.technical_specs
            .find((spec) => spec.name.toLowerCase() === 'màn hình')
            ?.value.split(',')
            .pop();

        return [screen, screenSizes];
    }, [productOption.technical_specs]);

    const handleAddToCart = useCallback(async () => {
        if (!token) {
            toast({
                description: 'Vui lòng đăng nhập để tiếp tục',
                variant: 'default',
            });
            return router.push('/login');
        }

        const response = (await accountApiRequest.addToCart(token, {
            productOptionId: productOption.id,
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
    }, [router, token, cartProducts, dispatch, productOption.id]);

    const handleSelectOption = useCallback(
        (optionName: string, optionValue: string) => {
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

            const selectedOption = product.product_options.find(
                (p) =>
                    p.slug.includes(optionString) ||
                    p.slug.includes(optionStringReverse),
            );

            setSelectedOptionObj(results);
            setProductOption(selectedOption ?? productOption);
        },
        [product.product_options, productOption, selectedOptionObj],
    );

    return (
        <div className="w-[185px] lg:w-auto lg:max-w-[300px]">
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="min-h-[550px] lg:max-w-[300px] bg-card w-[185px] md:w-[360px] hover:shadow-2xl hover:cursor-pointer hover:scale-[1.01] transition-all duration-300 border-[1px] border-[#ccc] rounded-md px-2 py-3 shadow-md flex flex-col justify-between">
                        <div>
                            {product?.label && (
                                <p className="mb-4 opacity-70 text-sm">
                                    <span className="bg-[#f1f1f1] text-[#333] rounded-lg animate-pulse">
                                        {product.label}
                                    </span>
                                </p>
                            )}
                            <div className="relative flex flex-col justify-center items-center gap-2">
                                <Image
                                    loading="lazy"
                                    height={100}
                                    width={100}
                                    src={productOption.label_image}
                                    alt="product sticker"
                                    className="w-[55px] md:w-[70px] absolute top-2 left-3 z-10 animate-bounce"
                                />
                                <Link
                                    href={`/${product?.category.slug}/${productOption.slug}`}
                                    className="min-h-[200px]"
                                >
                                    <Image
                                        priority
                                        height={500}
                                        width={200}
                                        src={productOption.thumbnail}
                                        alt={productName}
                                        className="w-[200px] hover:scale-[1.0] md:hover:scale-[1.1] transition-all duration-300"
                                    />
                                </Link>

                                <p className="font-bold text-center capitalize text-pretty text-sm md:text-base">
                                    {productName}
                                </p>

                                <div className="flex gap-1">
                                    <p className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs md:text-sm font-medium transition-colors bg-secondary text-secondary-foreground shadow-sm h-9 px-2 py-2">
                                        {screenSpecs()[1]}
                                    </p>
                                    <p className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs md:text-sm font-medium transition-colors bg-secondary text-secondary-foreground shadow-sm h-9 px-2 py-2">
                                        {screenSpecs()[0]}
                                    </p>
                                </div>

                                {product?.options &&
                                    product?.options?.length > 0 && (
                                        <div className="w-full flex flex-col gap-2 md:gap-6 md:my-4">
                                            {product.options?.map(
                                                (option, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-2"
                                                    >
                                                        {option?.values
                                                            ?.sort((a, b) => {
                                                                const numA =
                                                                    parseInt(
                                                                        a,
                                                                        10,
                                                                    );
                                                                const numB =
                                                                    parseInt(
                                                                        b,
                                                                        10,
                                                                    );
                                                                return (
                                                                    numA - numB
                                                                );
                                                            })
                                                            .map((el) => {
                                                                return (
                                                                    <div
                                                                        key={el}
                                                                        onClick={() =>
                                                                            handleSelectOption(
                                                                                option.name,
                                                                                el,
                                                                            )
                                                                        }
                                                                        className="min-w-max flex flex-wrap"
                                                                    >
                                                                        <Button
                                                                            className="capitalize"
                                                                            size={
                                                                                isMobile
                                                                                    ? 'sm'
                                                                                    : 'default'
                                                                            }
                                                                            variant={
                                                                                productOption.slug.includes(
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
                                                ),
                                            )}
                                        </div>
                                    )}

                                <div className="flex flex-col-reverse gap-3 mt-2 capitalize justify-center items-center">
                                    {productOption.discount === 0 ? (
                                        <p className="text-[#E83A45] font-semibold text-[18px]">
                                            {price}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-[#E83A45] font-bold text-[18px]">
                                                {salePrice}
                                            </p>
                                            <p className="text-[14px] flex gap-2">
                                                <span className="line-through">
                                                    {price}
                                                </span>
                                                <span>
                                                    -{productOption.discount}%
                                                </span>
                                            </p>
                                        </>
                                    )}
                                </div>

                                {productOption.rating.total_reviews > 0 && (
                                    <div className="flex justify-start items-center gap-2">
                                        <span className="font-bold">
                                            {productOption.rating.overall}
                                        </span>
                                        <div className="inline-flex items-center">
                                            <span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-6 h-6 text-yellow-400 cursor-pointer"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-gray-500">
                                            (
                                            {productOption.rating.total_reviews}
                                            )
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            variant={'default'}
                            className="my-4 bg-popover-foreground text-popover hover:bg-popover hover:text-popover-foreground hover:border rounded-md"
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-96 hidden lg:block">
                    {productOption.technical_specs.map((spec, idx) => (
                        <ContextMenuItem key={idx} inset>
                            <li className="px-1 block">
                                <p className="text-dark dark:text-white w-[90%] text-[14px] opacity-[0.85] list-item whitespace-nowrap">
                                    {spec.name}: {spec.value}
                                </p>
                            </li>
                        </ContextMenuItem>
                    ))}
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
}
