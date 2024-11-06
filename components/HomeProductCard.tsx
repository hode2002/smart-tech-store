import { Image, Text, View } from 'react-native';
import { Href, Link, router } from 'expo-router';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/Button';
import { IProduct } from '@/types/type';
import { useAuthStore, useUserStore } from '@/store';
import accountApiRequest, {
    AddToCartResponseType,
} from '@/lib/apiRequest/account';
import Toast from 'react-native-toast-message';
import React from 'react';
import { icons } from '@/constants';

type HomeProductCardProps = {
    product: IProduct;
    option?: number;
};

export default function HomeProductCard({
    product,
    option = 0,
}: HomeProductCardProps) {
    const { accessToken } = useAuthStore((state) => state);
    const { cart: cartProducts, setCartProducts } = useUserStore(
        (state) => state,
    );
    const productOption = product.product_options[option];
    const productName =
        product.name + ' ' + productOption.sku.replaceAll('-', ' ');
    const price = formatPrice(
        Number(product.price + productOption.price_modifier),
    );
    const salePrice = formatPrice(
        Number(
            product.price +
                productOption.price_modifier -
                ((product.price + productOption.price_modifier) *
                    productOption.discount) /
                    100,
        ),
    );
    const handleAddToCart = async () => {
        if (!accessToken) {
            Toast.show({
                type: 'info',
                text1: 'Vui lòng đăng nhập để tiếp tục',
            });
            return router.push('/(auth)/login');
        }
        const response = (await accountApiRequest.addToCart(accessToken, {
            productOptionId: productOption.id,
            quantity: 1,
        })) as AddToCartResponseType;
        if (response?.statusCode === 201) {
            Toast.show({
                type: 'success',
                text1: 'Thêm thành công',
            });
            const cartItems = cartProducts.filter(
                (p) =>
                    p.selected_option.id !== response.data.selected_option.id,
            );
            setCartProducts([...cartItems, response.data]);
        }
    };

    return (
        <View className="min-h-[400px] max-w-[185px] border-[1px] border-[#ccc] bg-white rounded-md shadow-md m-3">
            <View className="flex flex-col justify-between gap-4 px-2 py-3">
                {product?.label && (
                    <Text className="bg-[#f1f1f1] text-[#333] rounded-lg animate-pulse w-1/2">
                        <Text className="mb-4 opacity-70 text-sm">
                            {product.label}
                        </Text>
                    </Text>
                )}
                <Link
                    href={`/(category)/${productOption.slug}` as Href}
                    className="relative flex flex-col justify-center items-center object-contain"
                >
                    <View>
                        <Image
                            height={55}
                            width={55}
                            resizeMode="contain"
                            source={{ uri: productOption.label_image }}
                            alt="product sticker"
                            className="absolute top-2 left-3 z-10 animate-bounce"
                        />
                        <View>
                            <Image
                                height={200}
                                width={200}
                                resizeMode="contain"
                                source={{
                                    uri: productOption.thumbnail,
                                }}
                                alt={productName}
                                className="w-[150px] transition-all duration-300"
                            />
                        </View>
                        <Text
                            className="font-bold capitalize w-[150px] truncate"
                            numberOfLines={1}
                        >
                            {productName}
                        </Text>
                        <View className="flex flex-col gap-3 mt-2 justify-center items-center">
                            {productOption.discount === 0 ? (
                                <Text className="text-[#E83A45] font-semibold text-[18px]">
                                    {price}
                                </Text>
                            ) : (
                                <>
                                    <Text className="text-[#E83A45] font-bold text-[18px]">
                                        {salePrice}
                                    </Text>
                                    <Text className="line-through text-[14px]">
                                        {price}
                                    </Text>
                                </>
                            )}
                        </View>
                        {productOption.rating.total_reviews > 0 && (
                            <View className="flex-row items-center justify-center gap-2 px-5 py-3">
                                <Text className="font-bold">
                                    {productOption.rating.overall}
                                </Text>
                                <Image
                                    source={icons.star}
                                    resizeMode="contain"
                                    className="w-5 h-5"
                                    tintColor={'#fbc02d'}
                                />
                                <Text className="block text-base antialiased font-medium leading-relaxed text-gray-500">
                                    ({productOption.rating.total_reviews})
                                </Text>
                            </View>
                        )}
                    </View>
                </Link>
                <Button
                    label="Thêm vào giỏ"
                    labelClasses="font-JakartaBold text-white"
                    className="text-white bg-black rounded-md py-2"
                    onPress={handleAddToCart}
                />
            </View>
        </View>
    );
}
