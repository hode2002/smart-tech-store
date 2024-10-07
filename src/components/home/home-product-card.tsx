'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ProductType, setCartProducts } from '@/lib/store/slices';
import { ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { randomElement } from '../../lib/utils';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/apiRequests/account';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

type Props = {
    product: ProductType;
    option?: number;
};

export default function HomeProductCard(props: Props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const cartProducts = useAppSelector((state) => state.user.cart);

    const { product, option = 0 } = props;
    const productOption = product.product_options[option];
    const productName =
        product.name + ' ' + productOption.sku.replaceAll('-', ' ');
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
            dispatch(
                setCartProducts([
                    ...cartItems,
                    { ...response.data, id: productOption.id },
                ]),
            );

            toast({
                description: 'Thêm thành công',
                variant: 'default',
            });
        }
    };

    return (
        <div className="w-[200px] lg:w-auto lg:max-w-[300px]">
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="min-h-[410px] lg:h-[650px] bg-card hover:shadow-2xl hover:cursor-pointer hover:scale-[1.00] md:hover:scale-[1.1] transition-all duration-300 border-[1px] border-[#ccc] rounded-md px-2 py-3 max-w-[300px] shadow-md m-3 flex flex-col justify-between">
                        {product?.label && (
                            <p className="mb-4 opacity-70 text-sm">
                                <span className="bg-[#f1f1f1] text-[#333] rounded-lg animate-pulse">
                                    {product.label}
                                </span>
                            </p>
                        )}
                        <Link
                            href={`/${product?.category.slug}/${productOption.slug}`}
                            className="relative flex flex-col justify-center items-center gap-2 object-contain"
                        >
                            <Image
                                loading="lazy"
                                height={500}
                                width={500}
                                src={productOption.label_image}
                                alt="product sticker"
                                className="h-auto w-[55px] md:w-[70px] absolute top-2 left-3 z-10 animate-bounce"
                            />

                            <div>
                                <Image
                                    loading="lazy"
                                    height={500}
                                    width={200}
                                    src={productOption.thumbnail}
                                    alt={productName}
                                    className="w-[150px] md:w-[200px] hover:scale-[1.0] md:hover:scale-[1.1] transition-all duration-300"
                                />
                            </div>

                            <div className="flex flex-col gap-2 capitalize">
                                <p className="text-center font-bold capitalize text-pretty">
                                    {productName}
                                </p>
                                <div className="flex flex-col lg:flex-row gap-3 mt-2 justify-center items-center">
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
                                        {productOption.rating.total_reviews}
                                    </p>
                                </div>
                            )}

                            <div className="text-center text-[12px] hidden lg:block">
                                <div className="text-[#E83A45] font-semibold flex justify-around items-center gap-2">
                                    <Image
                                        priority
                                        height={15}
                                        width={15}
                                        className="animate-ping"
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGVSURBVHgB7VbRTcMwFDyHfvCB2oyQDegIZQM2gE5QOgFlAroB3QCYoGWClAnIBkSCD5Cg5vyS0tR1HAuRH+hJjq28892Lo1wLOKC7uNQ9PMvgGjVgbVThXSMEpbjWMSZcz2TdxYWHN5VR8CbNBj2kJN5UhKbSYYzk+x7X6yYsXmrrRQ6PHApxhTGRe3pjipUcW6byrY57wrOg7Bvs6rwUu+P8WLKOeT3lfIIPrg4w53XB+oMIK/Q5D2g8VC+YeQ0qJmdcJlY7Y15j1kYyb7Ck+L0tLlsoFrOrPkLQwZLHkusjdhsA9YqF4ot52um0Du/kHfI5tOwJwSIKFv8ZBhFaxl8wULhCW2hTe+OBIlv4LSRORkciIXOVGvbl3LcsiOvU3B2pfIg1MDXhuPaWgel7yZnJHvPl1hGkZvIJ7if0GeyIS0SbjouRhJq4DVYYV89dBDUT9E0i2YTd3DLJ8IlhuEGEW/MjsyW+HSlJ1cSceRnhgQYFzFH0HeK2iTeJO74iBVL4kTRx9mH3bwyiMpR+V1n+8nwB+DO/44jWMeQAAAAASUVORK5CYII="
                                        alt="product promotion"
                                    />
                                    <p className="my-2">
                                        {randomElement(product.promotions)}
                                    </p>
                                    <Image
                                        priority
                                        height={15}
                                        width={15}
                                        className="animate-ping"
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGVSURBVHgB7VbRTcMwFDyHfvCB2oyQDegIZQM2gE5QOgFlAroB3QCYoGWClAnIBkSCD5Cg5vyS0tR1HAuRH+hJjq28892Lo1wLOKC7uNQ9PMvgGjVgbVThXSMEpbjWMSZcz2TdxYWHN5VR8CbNBj2kJN5UhKbSYYzk+x7X6yYsXmrrRQ6PHApxhTGRe3pjipUcW6byrY57wrOg7Bvs6rwUu+P8WLKOeT3lfIIPrg4w53XB+oMIK/Q5D2g8VC+YeQ0qJmdcJlY7Y15j1kYyb7Ck+L0tLlsoFrOrPkLQwZLHkusjdhsA9YqF4ot52um0Du/kHfI5tOwJwSIKFv8ZBhFaxl8wULhCW2hTe+OBIlv4LSRORkciIXOVGvbl3LcsiOvU3B2pfIg1MDXhuPaWgel7yZnJHvPl1hGkZvIJ7if0GeyIS0SbjouRhJq4DVYYV89dBDUT9E0i2YTd3DLJ8IlhuEGEW/MjsyW+HSlJ1cSceRnhgQYFzFH0HeK2iTeJO74iBVL4kTRx9mH3bwyiMpR+V1n+8nwB+DO/44jWMeQAAAAASUVORK5CYII="
                                        alt="product promotion"
                                    />
                                </div>
                                <div className="my-2">
                                    <p>{randomElement(product.promotions)}</p>
                                </div>
                            </div>
                        </Link>

                        <Button
                            onClick={handleAddToCart}
                            className="py-4 bg-popover-foreground text-popover hover:bg-popover hover:text-popover-foreground hover:border rounded-md"
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64 hidden lg:block">
                    {product.warranties?.map((warranty) => (
                        <ContextMenuItem inset key={warranty} className="px-0">
                            <li className="py-1 flex w-full items-start gap-2">
                                <ShieldCheck
                                    color="#2ac050"
                                    className="w-[40px]"
                                />
                                <p className="text-popover-foreground w-[90%] text-[14px] opacity-[0.85]">
                                    {warranty}
                                </p>
                            </li>
                        </ContextMenuItem>
                    ))}
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
}
