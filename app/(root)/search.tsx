import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    TextInput,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce';
import HeaderSearchList from '@/components/HeaderSearchList';
import { icons } from '@/constants';
import productApiRequest from '@/lib/apiRequest/product';
import { useAuthStore, useProductStore, useUserStore } from '@/store';
import accountApiRequest from '@/lib/apiRequest/account';
import { HistorySearchItem, IProduct } from '@/types/type';
import {
    HistorySearchBody,
    HistorySearchBodyType,
} from '@/schemaValidations/account.schema';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function Search() {
    const router = useRouter();

    const { accessToken } = useAuthStore((state) => state);
    const {
        historySearch,
        setHistorySearchList,
        setHistorySearchItem,
        localSearch,
        setLocalSearchItem,
    } = useUserStore((state) => state);
    const { setProductsSearch } = useProductStore((state) => state);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchSuggestions, setSearchSuggestions] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (accessToken && historySearch?.length < 1) {
            accountApiRequest
                .getHistorySearch(accessToken)
                .then((response: HistorySearchItem[]) => {
                    setHistorySearchList(response);
                });
        }
    }, [accessToken, setHistorySearchList, historySearch]);

    useEffect(() => {
        if (accessToken && localSearch?.length > 0) {
            accountApiRequest
                .createHistorySearchList(accessToken, localSearch)
                .then((response: HistorySearchItem[]) => {
                    setHistorySearchList(response);
                });
        }
    }, [accessToken, setHistorySearchList, localSearch]);

    const form = useForm<HistorySearchBodyType>({
        resolver: zodResolver(HistorySearchBody),
        defaultValues: {
            search_content: '',
        },
    });

    const getProductSuggestions = useCallback((keyword: string) => {
        productApiRequest.getProductsByKeyword(keyword).then((response) => {
            setSearchSuggestions(response.data.products);
        });
    }, []);

    // eslint-disable-next-line
    const debouncedSearch = useCallback(
        debounce((query) => {
            getProductSuggestions(query);
        }, 500),
        [],
    );

    const handleOnChange = (keyword: string) => {
        setSearchTerm(keyword);
        if (keyword) {
            debouncedSearch(keyword);
        }
    };

    const onSubmit = async () => {
        if (!searchTerm) return;

        const searchItem = {
            id: uuidv4(),
            search_content: searchTerm,
        };

        if (accessToken) {
            const searchItemResponse =
                await accountApiRequest.createHistorySearch(
                    accessToken,
                    searchItem,
                );
            const isExist = historySearch.find(
                (item) =>
                    item.search_content === searchItemResponse.search_content,
            );
            if (!isExist) {
                setHistorySearchItem(searchItemResponse);
            }
        } else {
            const isExist = localSearch.find(
                (item) => item.search_content === searchItem.search_content,
            );
            if (!isExist) {
                setLocalSearchItem(searchItem);
            }
        }

        form.reset();
        setSearchTerm('');

        router.push({
            pathname: '/(root)/search-results',
            params: {
                keywords: searchItem.search_content.replaceAll(' ', '+'),
            },
        });
    };

    const pickImage = async () => {
        if (loading) return;
        setLoading(true);
        const result: ImagePicker.ImagePickerResult =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

        if (!result.canceled) {
            validateFile(result.assets[0]);
        }
    };

    const validateFile = (file: any) => {
        if (file.uri && /\.(jpg|jpeg|png)$/.test(file.uri)) {
            handleSearchByImage(file);
        } else {
            Toast.show({ type: 'error', text1: 'Không đúng định dạng ảnh' });
        }
        setLoading(false);
    };

    const handleSearchByImage = async (file: File) => {
        const response = await productApiRequest.getProductsByImage(file);
        console.log({ response });
        setLoading(false);
        if (response.statusCode === 200) {
            setProductsSearch(response.data);
            router.push({
                pathname: '/(root)/search-results',
            });
        }
    };

    return (
        <View className="bg-white">
            <SafeAreaView>
                <View className="mx-2 flex-row justify-center items-center my-5">
                    <View className="flex-row items-center justify-start px-2">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Image
                                source={icons.backArrow}
                                resizeMode="cover"
                                className="w-10 h-10"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="w-[80%]">
                        <TouchableOpacity>
                            <View className="w-full relative">
                                <TextInput
                                    ref={inputRef}
                                    onChangeText={handleOnChange}
                                    value={searchTerm}
                                    placeholder="Bạn cần tìm gì..."
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                    onSubmitEditing={onSubmit}
                                />
                                {loading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#000"
                                        className="absolute top-3 right-4"
                                    />
                                ) : (
                                    <View className="absolute top-3 right-3">
                                        <TouchableOpacity onPress={pickImage}>
                                            <Image
                                                source={icons.camera}
                                                className="h-6 w-6"
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <HeaderSearchList
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchList={
                        accessToken ? [...historySearch] : [...localSearch]
                    }
                    searchSuggestions={searchSuggestions}
                    setSearchSuggestions={setSearchSuggestions}
                />
            </SafeAreaView>
        </View>
    );
}
