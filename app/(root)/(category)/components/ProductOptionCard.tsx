import React, { useCallback } from 'react';
import { Button } from '@/components/Button';
import { formatPrice, generateSlug } from '@/lib/utils';
import { ProductDetailType } from '@/schemaValidations/product.schema';
import { Skeleton } from '@/components/Skeleton';
import Toast from 'react-native-toast-message';
import { Href, router } from 'expo-router';
import { useAuthStore, useUserStore } from '@/store';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/lib/apiRequest/account';
import { Text, View } from 'react-native';

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
    const { accessToken } = useAuthStore((state) => state);
    const { cart: cartProducts, setCartProducts } = useUserStore(
        (state) => state,
    );

    const handleAddToCart = async () => {
        if (!accessToken) {
            Toast.show({
                type: 'info',
                text1: 'Vui lòng đăng nhập để tiếp tục',
            });
            return router.push('/login');
        }

        const productOptionId = productInfo?.product_options[
            selectedOptionIndex
        ].id as string;

        const response = (await accountApiRequest.addToCart(accessToken, {
            productOptionId,
            quantity: 1,
        })) as AddToCartResponseType;

        if (response?.statusCode === 201) {
            const cartItems = cartProducts.filter(
                (p) =>
                    p.selected_option.id !== response.data.selected_option.id,
            );
            setCartProducts([
                ...cartItems,
                { ...response.data, id: response.data.selected_option.id },
            ]);
            Toast.show({
                type: 'success',
                text1: 'Thêm thành công',
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
            router.navigate(url as Href);
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
        <View className="px-2 py-4 w-full bg-white">
            <View>
                {productInfo ? (
                    <>
                        <Text className="text-[#E83A45] font-JakartaBold text-[32px]">
                            {formatPrice(calculateProductPrice())}
                        </Text>
                        <View className="flex-row opacity-80">
                            {productInfo.product_options[selectedOptionIndex]
                                .discount !== 0 && (
                                <>
                                    <Text className="text-[20px] line-through">
                                        {formatPrice(
                                            productInfo.price +
                                                productInfo.product_options[
                                                    selectedOptionIndex
                                                ].price_modifier,
                                        )}
                                    </Text>
                                    <Text className="text-[20px] ml-2">
                                        -
                                        {
                                            productInfo.product_options[
                                                selectedOptionIndex
                                            ].discount
                                        }
                                        %
                                    </Text>
                                </>
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <Skeleton className="h-[48px] w-[400px] rounded-lg mb-2" />
                        <Skeleton className="h-[30px] w-[400px] rounded-lg" />
                    </>
                )}
                <View className="w-full my-8">
                    {productInfo && productInfo?.options ? (
                        productInfo.options?.map((option, index) => (
                            <View key={index} className="my-2">
                                <Text className="mb-1 font-semibold">
                                    {option.name}
                                </Text>
                                <View className="flex-row gap-2">
                                    {option?.values
                                        .sort()
                                        ?.map((el) => (
                                            <Button
                                                key={el}
                                                onPress={() =>
                                                    handleSelectOption(
                                                        option.name,
                                                        el,
                                                    )
                                                }
                                                label={el}
                                                className={`capitalize ${
                                                    slug.includes(
                                                        generateSlug(
                                                            el.toLowerCase(),
                                                        ),
                                                    )
                                                        ? 'bg-black'
                                                        : ''
                                                }`}
                                                labelClasses={
                                                    slug.includes(
                                                        generateSlug(
                                                            el.toLowerCase(),
                                                        ),
                                                    )
                                                        ? 'text-white'
                                                        : 'text-black'
                                                }
                                            />
                                        ))}
                                </View>
                            </View>
                        ))
                    ) : (
                        <>
                            {Array.from({ length: 2 }).map((_, index) => (
                                <View key={index}>
                                    <View className="mb-1 font-semibold">
                                        <Skeleton className="h-[24px] w-[100px] rounded-lg" />
                                    </View>
                                    <View className="flex-row gap-2">
                                        <View className="min-w-max">
                                            <Skeleton className="h-[36px] w-[100px] rounded-lg" />
                                        </View>
                                        <View className="min-w-max">
                                            <Skeleton className="h-[36px] w-[100px] rounded-lg" />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </View>
            <Button
                label="Mua ngay"
                className="w-full mb-4 bg-red-500"
                labelClasses="font-JakartaBold text-white"
            />
            <Button
                label="Thêm vào giỏ hàng"
                onPress={handleAddToCart}
                className="w-full bg-black"
                labelClasses="font-JakartaBold text-white"
            />
        </View>
    );
};

export default ProductOptionCard;
