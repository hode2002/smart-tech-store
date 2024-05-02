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
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

type Props = {
    product: ProductType;
};

export default function ProductCard(props: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const cartProducts = useAppSelector((state) => state.user.cart);

    const { product } = props;
    const [option, setOption] = useState<number>(0);
    const productOption = product.product_options[option];

    const productName =
        product.name +
        ' ' +
        productOption.sku.replaceAll('-', ' ').toLowerCase();

    const price = formatPrice(
        Number(product.price + productOption.price_modifier),
    );

    const salePrice = formatPrice(
        Number(
            product.price -
                (product.price * productOption.discount) / 100 +
                productOption.price_modifier,
        ),
    );

    const screenSpecs = () => {
        const screenSizes = productOption.technical_specs.find(
            (spec) => spec.name.toLowerCase() === 'kích thước màn hình',
        )?.value;

        const screen = productOption.technical_specs.find(
            (spec) => spec.name.toLowerCase() === 'màn hình',
        )?.value;

        return [screen, screenSizes];
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
    };

    return (
        <div className="my-4">
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="min-h-[630px] bg-card w-[360px] hover:shadow-2xl hover:cursor-pointer hover:scale-[1.01] transition-all duration-300 border-[1px] border-[#ccc] rounded-md px-2 py-3 shadow-md m-3 flex flex-col justify-between">
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
                                    height={70}
                                    width={70}
                                    src={productOption.label_image}
                                    alt="product sticker"
                                    className="absolute top-2 left-3 z-10 animate-bounce"
                                />
                                <Link
                                    href={`/${product?.category.slug}/${productOption.slug}`}
                                    className="min-h-[200px]"
                                >
                                    <Image
                                        height={500}
                                        width={200}
                                        src={productOption.thumbnail}
                                        alt={productName}
                                        className="hover:scale-[1.05] transition-all duration-300"
                                    />
                                </Link>

                                {product.product_options[0]?.options?.length >
                                    0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {product.product_options.map(
                                            (p, idx) => {
                                                return (
                                                    <Button
                                                        key={idx}
                                                        className=""
                                                        onClick={() =>
                                                            setOption(idx)
                                                        }
                                                        variant={
                                                            idx === option
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {p.options[0]?.value} -{' '}
                                                        {p.options[1]?.value}
                                                    </Button>
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                                <p className="my-4 font-bold text-center capitalize">
                                    {productName}
                                </p>

                                <div className="flex gap-1">
                                    <p className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground shadow-sm h-9 px-2 py-2">
                                        {screenSpecs()[1]}
                                    </p>
                                    <p className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground shadow-sm h-9 px-2 py-2">
                                        {screenSpecs()[0]}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 capitalize">
                                    <div className="flex gap-3 mt-2 justify-center items-center">
                                        {productOption.discount === 0 ? (
                                            <p className="text-[#E83A45] font-semibold text-[18px]">
                                                {price}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-[#E83A45] font-bold text-[18px]">
                                                    {salePrice}
                                                </p>
                                                <p className="line-through text-[14px]">
                                                    {price}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* <div className="flex justify-start items-center gap-2">
                                <span className="font-bold"> 4.7 </span>
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
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-gray-500 cursor-pointer"
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
                                    (134)
                                </p>
                            </div> */}

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
                <ContextMenuContent className="w-96">
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
