'use client';

import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem } from '@/lib/store/slices';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
    products: CartItem[];
};

export default function CartProductList(props: Props) {
    const { products } = props;

    return (
        <ul className="left-0 p-4 w-[400px] lg:w-[500px] h-[450px]">
            <ScrollArea className="h-[400px]">
                {products.map((cartItem) => {
                    const selectedOption = cartItem.selected_option;

                    const productName =
                        cartItem.name +
                        ' ' +
                        selectedOption.sku.replaceAll('-', ' ');
                    const price = formatPrice(
                        Number(cartItem.price + selectedOption.price_modifier),
                    );

                    const salePrice = formatPrice(
                        Number(
                            cartItem.price -
                            (cartItem.price * selectedOption.discount) /
                            100 +
                            selectedOption.price_modifier,
                        ),
                    );

                    return (
                        <li key={selectedOption.id}>
                            <NavigationMenuLink asChild>
                                <Link
                                    href={'/smartphone/' + selectedOption.slug}
                                    className={
                                        'block space-y-1 rounded-md p-3 leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                    }
                                >
                                    <div className="flex gap-3 items-center capitalize">
                                        <Image
                                            src={selectedOption.thumbnail}
                                            width={70}
                                            height={70}
                                            alt={
                                                cartItem.name +
                                                ' ' +
                                                selectedOption.sku.replaceAll(
                                                    '-',
                                                    ' ',
                                                )
                                            }
                                        />
                                        <div className="items-start">
                                            <p className="font-bold text-md leading-none">
                                                {productName}
                                            </p>
                                            <p className="mt-4 flex gap-2 font-semibold">
                                                <span className="text-[#d0021c]">
                                                    {selectedOption.discount > 0
                                                        ? salePrice
                                                        : price}
                                                </span>
                                                x
                                                <span>{cartItem.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </li>
                    );
                })}
            </ScrollArea>
        </ul>
    );
}
