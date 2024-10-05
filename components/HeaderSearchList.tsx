import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { formatPrice } from '@/lib/utils';
import { Href, useRouter } from 'expo-router';
import accountApiRequest from '@/lib/apiRequest/account';
import { useAuthStore, useUserStore } from '@/store';
import { HistorySearchItem, IProduct } from '@/types/type';
import { icons } from '@/constants';

export default function HeaderSearchList({
    searchTerm,
    setSearchTerm,
    searchList,
    searchSuggestions,
    setSearchSuggestions,
}: {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    searchList: HistorySearchItem[];
    searchSuggestions: IProduct[];
    setSearchSuggestions: Dispatch<SetStateAction<IProduct[]>>;
}) {
    const router = useRouter();
    const { accessToken } = useAuthStore((state) => state);
    const { removeLocalSearch, removeHistorySearch } = useUserStore(
        (state) => state,
    );

    const handleSearch = (searchItem?: HistorySearchItem) => {
        setSearchSuggestions([]);
        if (searchItem) {
            console.log('redirecting to search page', searchItem);
            router.push({
                pathname: '/(root)/search-results',
                params: {
                    keywords: searchItem.search_content.replaceAll(' ', '+'),
                },
            });
        }
    };

    const handleDeleteSearchItem = async (searchItem: HistorySearchItem) => {
        if (accessToken) {
            await accountApiRequest.removeHistorySearch(
                accessToken,
                searchItem,
            );
            removeHistorySearch(searchItem);
        } else {
            removeLocalSearch(searchItem);
        }
    };

    return (
        <View className="w-full bg-white">
            {searchTerm ? (
                searchSuggestions?.length > 0 ? (
                    <ScrollView className="p-2 bg-white">
                        {searchSuggestions
                            .slice(0, 5)
                            .reverse()
                            .map((item) => {
                                const selectedOption = item.product_options[0];
                                const productName = `${item.name} ${selectedOption.sku.replaceAll('-', ' ')}`;
                                const price = formatPrice(
                                    Number(
                                        item.price +
                                            selectedOption.price_modifier,
                                    ),
                                );
                                const salePrice = formatPrice(
                                    Number(
                                        item.price -
                                            (item.price *
                                                selectedOption.discount) /
                                                100 +
                                            selectedOption.price_modifier,
                                    ),
                                );
                                return (
                                    <TouchableOpacity
                                        key={selectedOption.id}
                                        onPress={() => {
                                            setSearchSuggestions([]);
                                            setSearchTerm('');
                                            router.push(
                                                '/(root)/search-results' as Href,
                                            );
                                            // router.push(
                                            //     `${item.category.slug}/${selectedOption.slug}`,
                                            // );
                                        }}
                                    >
                                        <View className="flex-row items-center p-4 border-t border-gray-200">
                                            <Image
                                                source={{
                                                    uri: selectedOption.thumbnail,
                                                }}
                                                className="w-16 h-16"
                                            />
                                            <View className="ml-2">
                                                <Text className="font-JakartaBold text-sm">
                                                    {productName}
                                                </Text>
                                                <View className="flex flex-row items-center mt-1">
                                                    <Text
                                                        className={`${
                                                            selectedOption.discount
                                                                ? 'text-red-500 font-JakartaBold'
                                                                : 'text-black font-JakartaMedium'
                                                        } text-sm`}
                                                    >
                                                        {selectedOption.discount
                                                            ? salePrice
                                                            : price}
                                                    </Text>
                                                    {selectedOption.discount >
                                                        0 && (
                                                        <Text className="line-through ml-2">
                                                            {price}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                    </ScrollView>
                ) : (
                    <View className="p-4 flex justify-center items-center">
                        <Text>Không tìm thấy sản phẩm phù hợp</Text>
                    </View>
                )
            ) : (
                <View className="p-2 bg-white">
                    {searchList &&
                        searchList?.length > 0 &&
                        searchList
                            .slice(0, 5)
                            .reverse()
                            .map((searchItem) => (
                                <View
                                    key={searchItem.id}
                                    className="flex-row justify-between items-center p-4 border-t border-gray-200"
                                >
                                    <TouchableOpacity
                                        onPress={() => handleSearch(searchItem)}
                                    >
                                        <View className="w-full">
                                            <Text className="font-JakartaMedium">
                                                {searchItem.search_content}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleDeleteSearchItem(searchItem)
                                        }
                                    >
                                        <Image
                                            source={icons.trash}
                                            className="h-6 w-6"
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                </View>
            )}
        </View>
    );
}
