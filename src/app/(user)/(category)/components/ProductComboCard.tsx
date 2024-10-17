import ProductComboItem, {
    ComboItem,
} from '@/app/(user)/(category)/components/ProductComboItem';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { ProductCheckout, setProductCheckout } from '@/lib/store/slices';
import { formatPrice } from '@/lib/utils';
import {
    ComboType,
    ProductOptionType,
} from '@/schemaValidations/product.schema';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

const ProductComboCard = ({
    mainProduct,
    combos,
    convertProductName,
    originalPrice,
}: {
    mainProduct: ProductOptionType;
    combos: ComboType[];
    convertProductName: () => string;
    originalPrice: number;
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const userProfile = useAppSelector((state) => state.user.profile);
    const userAddress = useAppSelector((state) => state.user.address);

    const [productCombos, setProductCombos] = useState<{ [x: string]: any }>(
        {},
    );
    const [selectedProductCombos, setSelectedProductCombos] = useState<
        ComboItem[]
    >([]);

    const calculateProductPrice = useCallback((): number => {
        const selectedOptionPriceModifier = mainProduct.price_modifier;
        const discount =
            ((originalPrice + selectedOptionPriceModifier) *
                mainProduct.discount) /
            100;
        return originalPrice + selectedOptionPriceModifier - discount;
    }, [mainProduct, originalPrice]);

    const calculateTotalSavings = useCallback((): number => {
        const productModifiedPrice = calculateProductPrice();
        const totalProductComboPrice = selectedProductCombos.reduce(
            (prev, curr) =>
                prev +
                ((curr.product_option.product.price +
                    curr.product_option.price_modifier) *
                    curr.discount) /
                    100,
            0,
        );

        return (
            originalPrice +
            mainProduct.price_modifier -
            productModifiedPrice +
            totalProductComboPrice
        );
    }, [
        originalPrice,
        calculateProductPrice,
        selectedProductCombos,
        mainProduct.price_modifier,
    ]);

    const comboFiltered = useCallback(() => {
        const data: { [x: string]: any[] } = {};
        combos[0]?.product_combos?.forEach((item) => {
            const cate = item.product_option.product.category.slug;
            if (data[cate]) {
                data[cate] = [...data[cate], item];
            } else {
                data[cate] = [item];
            }
        });
        setProductCombos(data);
    }, [combos]);

    useEffect(() => {
        comboFiltered();
    }, [comboFiltered]);

    useEffect(() => {
        setSelectedProductCombos([
            ...Object.keys(productCombos).map((key) => productCombos[key][0]),
        ]);
    }, [productCombos]);

    const handleCheckoutCombo = () => {
        if (!token) {
            toast({
                description: 'Vui lòng đăng nhập để tiếp tục',
                variant: 'default',
            });
            return router.push('/login');
        }

        if (!(userProfile?.phone && userAddress?.ward)) {
            toast({
                description:
                    'Vui lòng cập nhật số điện thoại và địa chỉ nhận hàng trước khi thanh toán',
            });
            return router.push(
                `/user/account/${!userProfile?.phone ? 'profile' : 'address'}`,
            );
        }

        const productCheckout: ProductCheckout[] = selectedProductCombos.map(
            (item) => {
                const quantity = 1;
                const priceModifier = item.product_option.price_modifier;
                const unitPrice = item.product_option.product.price;
                const discount = item.discount;
                const productName =
                    item.product_option.product.name +
                    ' ' +
                    item.product_option.sku.replaceAll('-', ' ');

                return {
                    id: item.product_option.id,
                    name: productName,
                    thumbnail: item.product_option.thumbnail,
                    unitPrice,
                    priceModifier,
                    quantity,
                    weight: +item.product_option.technical_specs.specs[0].value.split(
                        'g',
                    )[0],
                    discount,
                };
            },
        );

        const product: ProductCheckout = {
            id: mainProduct.id,
            name: convertProductName(),
            thumbnail: mainProduct.thumbnail,
            unitPrice: originalPrice,
            priceModifier: mainProduct.price_modifier,
            quantity: 1,
            weight: Number(
                (
                    mainProduct.technical_specs.find(
                        (t) => t.name === 'Khối lượng',
                    ) as { name: string; value: string }
                ).value.split(' g')[0],
            ),
            discount: mainProduct.discount,
        };

        dispatch(setProductCheckout([product, ...productCheckout]));
        const comboIds = selectedProductCombos.reduce(
            (prev, curr) => (prev += curr.id + ','),
            '',
        );

        router.push(
            `/user/checkout?proId=${mainProduct.id}&comboIds=${comboIds}`,
        );
    };

    return (
        <div className="mt-14 relative">
            <div className="absolute top-[-15px] left-0 right-0 flex gap-2 items-center justify-center font-semibold text-[20px] capitalize">
                <p className="bg-white text-nowrap px-6">
                    Giảm thêm khi mua kèm
                </p>
            </div>
            <div className="border border-solid rounded-lg">
                <div className="flex items-center px-2 py-6 border-b text-[14px] capitalize">
                    <div className="flex flex-col relative justify-center items-center px-2 text-[14px] capitalize">
                        <Image
                            src={mainProduct.thumbnail}
                            width={68}
                            height={68}
                            alt={mainProduct.slug}
                        />
                        <span className="absolute bottom-[-50%] bg-white px-3">
                            <Plus />
                        </span>
                    </div>
                    <div className="px-2">
                        <p className="font-semibold flex gap-1">
                            {convertProductName()}
                        </p>
                        <div className="flex gap-2 items-center">
                            <p className="text-[#E83A45] font-bold">
                                {formatPrice(calculateProductPrice())}
                            </p>
                            {mainProduct?.discount > 0 && (
                                <p className="line-through opacity-90">
                                    {formatPrice(originalPrice)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {Object.keys(productCombos).map((key, index) => (
                    <ProductComboItem
                        key={index}
                        data={productCombos[key]}
                        setSelectedProductCombos={setSelectedProductCombos}
                    />
                ))}
                <div>
                    <Button
                        variant={'destructive'}
                        onClick={handleCheckoutCombo}
                        className="w-full flex flex-col justify-center py-7 mb-2 dark:bg-primary dark:text-primary-foreground"
                    >
                        <span>
                            Mua {selectedProductCombos.length + 1} sản phẩm
                        </span>
                        <span className="text-[12px]">
                            Tiết kiệm {formatPrice(calculateTotalSavings())}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductComboCard;
