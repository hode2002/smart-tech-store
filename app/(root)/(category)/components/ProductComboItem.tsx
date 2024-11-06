import { Button } from '@/components/Button';
import { formatPrice } from '@/lib/utils';
import { Href, Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Image, Text } from 'react-native';

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
    className,
    setSelectedProductCombos,
}: {
    data: ComboItem[];
    className?: string;
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

    const handleSelectProduct = (item: ComboItem) => {
        handleProductChange(item);
    };

    const [modalVisible, setModalVisible] = useState(false);

    return (
        selectedProduct && (
            <>
                <View
                    className={`flex-row items-center px-2 py-6 text-[14px] capitalize ${className}`}
                >
                    <Link
                        href={
                            `/(category)/${selectedProduct.product_option.slug}` as Href
                        }
                        className="flex-col justify-center items-center px-2 text-[14px] capitalize"
                    >
                        <View>
                            <Image
                                source={{
                                    uri: selectedProduct.product_option
                                        .thumbnail,
                                }}
                                width={68}
                                height={68}
                                alt={selectedProduct.product_option.slug}
                            />
                            <Text className="font-JakartaSemiBold text-[#039855] py-1 text-[12px]">
                                Giảm{' '}
                                <Text className="font-JakartaBold">
                                    {selectedProduct.discount}%
                                </Text>
                            </Text>
                        </View>
                    </Link>
                    <View className="px-2">
                        <View className="flex-row gap-1">
                            <Text className="font-JakartaSemiBold">
                                {selectedProduct.product_option.product.name}
                            </Text>
                            <Text className="font-JakartaSemiBold">
                                {selectedProduct.product_option.sku.replace(
                                    '-',
                                    ' ',
                                )}
                            </Text>
                        </View>
                        <View className="flex-row gap-2 items-center">
                            <Text className="text-[#E83A45] font-JakartaSemiBold">
                                {formatPrice(
                                    selectedProduct.product_option.product
                                        .price +
                                        selectedProduct.product_option
                                            .price_modifier -
                                        ((selectedProduct.product_option.product
                                            .price +
                                            selectedProduct.product_option
                                                .price_modifier) *
                                            selectedProduct.discount) /
                                            100,
                                )}
                            </Text>
                            <Text className="line-through opacity-90">
                                {formatPrice(
                                    selectedProduct.product_option.product
                                        .price +
                                        selectedProduct.product_option
                                            .price_modifier,
                                )}
                            </Text>
                        </View>
                        {/* <ShowProductComboModal
                            selectedProduct={selectedProduct}
                            data={data}
                            handleProductChange={handleProductChange}
                        /> */}
                        <Button
                            onPress={() => setModalVisible(true)}
                            label="Chọn sản phẩm khác"
                            variant={'link'}
                            labelClasses="px-0"
                            className="text-[#2a83e9] px-0 flex-row justify-start"
                        />
                    </View>
                </View>
                <View className="flex-1 justify-center items-center">
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 bg-white justify-center items-center">
                            <ScrollView className="flex-col p-3 h-[700px]">
                                <Text className="text-center font-JakartaBold my-4">
                                    Chọn mua sản phẩm khác
                                </Text>
                                <View className="flex-row gap-8 py-4 flex-wrap">
                                    {data.map((item, index) => (
                                        <View
                                            key={index}
                                            className="max-w-[200px] border rounded-lg p-2 flex-col justify-center items-center gap-2"
                                        >
                                            <Image
                                                key={index}
                                                alt="Review image"
                                                className="object-contain rounded-xl"
                                                width={100}
                                                height={100}
                                                source={{
                                                    uri: item.product_option
                                                        .thumbnail,
                                                }}
                                            />
                                            <Text className="font-JakartaMedium truncate w-[150px]">
                                                {
                                                    item.product_option.product
                                                        .name
                                                }{' '}
                                                {item.product_option.sku.replaceAll(
                                                    '-',
                                                    ' ',
                                                )}
                                            </Text>
                                            <View className="flex-col gap-2 items-center my-2">
                                                <Text className="text-[#E83A45] font-JakartaBold">
                                                    {formatPrice(
                                                        item.product_option
                                                            .product.price +
                                                            item.product_option
                                                                .price_modifier -
                                                            ((item
                                                                .product_option
                                                                .product.price +
                                                                item
                                                                    .product_option
                                                                    .price_modifier) *
                                                                item.discount) /
                                                                100,
                                                    )}
                                                </Text>
                                                <Text className="flex gap-2">
                                                    <Text className="line-through opacity-90">
                                                        {formatPrice(
                                                            item.product_option
                                                                .product.price +
                                                                item
                                                                    .product_option
                                                                    .price_modifier,
                                                        )}
                                                    </Text>
                                                    <Text>
                                                        -{item.discount}%
                                                    </Text>
                                                </Text>
                                            </View>
                                            {selectedProduct.product_option
                                                .slug ===
                                            item.product_option.slug ? (
                                                <Button
                                                    label="Đã chọn"
                                                    disabled
                                                />
                                            ) : (
                                                <Button
                                                    label="Chọn mua"
                                                    labelClasses="text-white"
                                                    className="bg-black"
                                                    onPress={() =>
                                                        handleSelectProduct(
                                                            item,
                                                        )
                                                    }
                                                />
                                            )}
                                        </View>
                                    ))}
                                </View>
                                <Button
                                    onPress={() => setModalVisible(false)}
                                    label={`Xác nhận`}
                                    labelClasses="font-JakartaBold text-white"
                                    className="mt-10 font-JakartaBold bg-black min-w-[120px] rounded-md"
                                />
                            </ScrollView>
                        </View>
                    </Modal>
                </View>
            </>
        )
    );
};

export default ProductComboItem;
