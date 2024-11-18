import { ShowProductComboModal } from '@/app/(user)/(category)/components/ShowProductComboModal';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export type ComboItem = {
    id: string;
    discount: number;
    product_option: {
        id: string;
        slug: string;
        sku: string;
        thumbnail: string;
        price_modifier: number;
        technical_specs: {
            specs: {
                key: string;
                value: string;
            }[];
        };
        product: {
            name: string;
            price: number;
            category: {
                slug: string;
            };
        };
    };
};

const ProductComboItem = ({
    data,
    setSelectedProductCombos,
}: {
    data: ComboItem[];
    setSelectedProductCombos: React.Dispatch<React.SetStateAction<ComboItem[]>>;
}) => {
    const [selectedProduct, setSelectedProduct] = useState<
        ComboItem | undefined
    >();

    useEffect(() => {
        setSelectedProduct(data[0]);
    }, [data, setSelectedProductCombos]);

    const handleProductChange = (productSelected: ComboItem) => {
        setSelectedProduct(productSelected);
        setSelectedProductCombos((prev) => [
            ...prev.filter(
                (p) =>
                    p.product_option.product.category.slug !==
                    productSelected.product_option.product.category.slug,
            ),
            productSelected,
        ]);
    };

    return (
        selectedProduct && (
            <div className="flex items-center px-2 py-6 border-b text-[14px] capitalize">
                <Link
                    href={`/${selectedProduct.product_option.product.category.slug}/${selectedProduct.product_option.slug}`}
                    className="flex flex-col justify-center items-center px-2 text-[14px] capitalize"
                >
                    <Image
                        src={selectedProduct.product_option.thumbnail}
                        width={68}
                        height={68}
                        alt={selectedProduct.product_option.slug}
                    />
                    <p className="font-semibold text-[#039855] flex justify-center gap-1 py-1 text-[12px]">
                        <span>Giảm </span>
                        <span className="font-bold">
                            {selectedProduct.discount}%
                        </span>
                    </p>
                </Link>
                <div className="px-2">
                    <p className="font-semibold flex gap-1">
                        {selectedProduct.product_option.product.name}
                        {selectedProduct.product_option.sku.replace('-', ' ')}
                    </p>
                    <div className="flex gap-2 items-center">
                        <p className="text-[#E83A45] font-semibold">
                            {formatPrice(
                                selectedProduct.product_option.product.price +
                                    selectedProduct.product_option
                                        .price_modifier -
                                    ((selectedProduct.product_option.product
                                        .price +
                                        selectedProduct.product_option
                                            .price_modifier) *
                                        selectedProduct.discount) /
                                        100,
                            )}
                        </p>
                        <p className="line-through opacity-90">
                            {formatPrice(
                                selectedProduct.product_option.product.price +
                                    selectedProduct.product_option
                                        .price_modifier,
                            )}
                        </p>
                    </div>
                    <ShowProductComboModal
                        selectedProduct={selectedProduct}
                        data={data}
                        handleProductChange={handleProductChange}
                    />
                </div>
            </div>
        )
    );
};

export default ProductComboItem;
