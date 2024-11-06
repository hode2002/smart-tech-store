import ProductComboItem, {
    ComboItem,
} from '@/app/(root)/(category)/components/ProductComboItem';
import { icons } from '@/constants';
import { formatPrice } from '@/lib/utils';
import {
    ComboType,
    ProductOptionType,
} from '@/schemaValidations/product.schema';
import { useAuthStore, useUserStore } from '@/store';
import { ProductCheckout } from '@/types/type';
import { Href, router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

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
    const { accessToken } = useAuthStore((state) => state);
    const {
        profile: userProfile,
        address: userAddress,
        setProductCheckout,
    } = useUserStore((state) => state);

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
        if (!accessToken) {
            Toast.show({
                type: 'info',
                text1: 'Vui lòng đăng nhập để tiếp tục',
            });
            return router.push('/login');
        }

        if (!(userProfile?.phone && userAddress?.ward)) {
            Toast.show({
                type: 'info',
                text1: 'Vui lòng cập nhật số điện thoại và địa chỉ nhận hàng trước khi thanh toán',
            });
            return router.push('/(root)/edit-address' as Href);
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

        setProductCheckout([product, ...productCheckout]);
        const comboIds = selectedProductCombos.reduce(
            (prev, curr) => (prev += curr.id + ','),
            '',
        );

        router.replace(
            `/(root)/checkout?proId=${mainProduct.id}&comboIds=${comboIds}` as Href,
        );
    };

    return (
        <View className="my-10 relative">
            <View className="mb-4 flex-row gap-2 items-center justify-center font-JakartaSemiBold text-[20px] capitalize">
                <Text className="bg-white text-nowrap px-6 font-JakartaBold">
                    Giảm thêm khi mua kèm
                </Text>
            </View>
            <View className="border border-solid rounded-lg mb-4">
                <View className="flex-row items-center px-2 py-6 border-b text-[14px] capitalize">
                    <View className="flex-col relative justify-center items-center px-2 text-[14px] capitalize">
                        <Image
                            source={{ uri: mainProduct.thumbnail }}
                            width={68}
                            height={68}
                            alt={mainProduct.slug}
                        />
                        <View className="absolute bottom-[-50%] bg-white px-3">
                            <Image
                                source={icons.plus}
                                resizeMode="contain"
                                className="w-8 h-8 mx-2"
                            />
                        </View>
                    </View>
                    <View className="px-2">
                        <Text className="font-JakartaSemiBold flex-row gap-1">
                            {convertProductName()}
                        </Text>
                        <View className="flex-row gap-2 items-center">
                            <Text className="text-[#E83A45] font-JakartaBold">
                                {formatPrice(calculateProductPrice())}
                            </Text>
                            {mainProduct?.discount > 0 && (
                                <Text className="line-through opacity-90">
                                    {formatPrice(originalPrice)}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
                {Object.keys(productCombos).map((key, index) => (
                    <ProductComboItem
                        key={index}
                        data={productCombos[key]}
                        setSelectedProductCombos={setSelectedProductCombos}
                        className={
                            index === Object.keys(productCombos).length - 1
                                ? 'border-b-0'
                                : 'border-b'
                        }
                    />
                ))}
            </View>
            <TouchableOpacity onPress={handleCheckoutCombo}>
                <View className="w-full flex-col py-2 justify-center items-center bg-red-500 rounded-lg">
                    <Text className="text-white font-JakartaBold">
                        Mua {selectedProductCombos.length + 1} sản phẩm
                    </Text>
                    <Text className="text-white text-[10px] font-JakartaMedium">
                        Tiết kiệm {formatPrice(calculateTotalSavings())}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ProductComboCard;
