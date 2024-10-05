import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { CartItem } from '../lib/store/slices';
import { formatPrice } from '../lib/utils';
import { useNavigation } from '@react-navigation/native';

type Props = {
    products: any[]; //CartItem[];
};

export default function CartProductList(props: Props) {
    const { products } = props;
    const navigation = useNavigation();

    return (
        <View className="p-4 w-[400px] h-[450px]">
            <ScrollView className="h-[400px]">
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
                        <TouchableOpacity
                            key={selectedOption.id}
                            // onPress={() =>
                            //     navigation.navigate('ProductDetails', {
                            //         slug: selectedOption.slug,
                            //     })
                            // }
                            className="block space-y-1 rounded-md p-3 transition-colors bg-white hover:bg-gray-100"
                        >
                            <View className="flex-row gap-3 items-center capitalize">
                                <Image
                                    source={{ uri: selectedOption.thumbnail }}
                                    style={{ width: 70, height: 70 }}
                                    alt={`${cartItem.name} ${selectedOption.sku.replaceAll('-', ' ')}`}
                                />
                                <View className="flex-1">
                                    <Text className="font-bold text-md">
                                        {productName}
                                    </Text>
                                    <View className="mt-4 flex-row gap-2 font-semibold">
                                        <Text className="text-[#d0021c]">
                                            {selectedOption.discount > 0
                                                ? salePrice
                                                : price}
                                        </Text>
                                        <Text>x {cartItem.quantity}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
