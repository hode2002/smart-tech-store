import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Text,
} from 'react-native';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
import {
    HistorySearchBody,
    HistorySearchBodyType,
} from '../schemaValidations/account.schema';
// import {
//     HistorySearchItem,
//     setHistorySearchItem,
//     setHistorySearchList,
//     setLocalSearchItem,
//     setProductsSearch,
// } from '../lib/store/slices';
// import accountApiRequest from '../apiRequests/account';
// import { v4 as uuidv4 } from 'uuid';
// import debounce from 'lodash/debounce';
// import productApiRequest from '../apiRequests/product';
// import { useNavigation } from '@react-navigation/native';
import HeaderSearchList from '@/components/HeaderSearchList';
import { icons } from '@/constants';
import { Href, router } from 'expo-router';

export default function HeaderSearchBar() {
    // const navigation = useNavigation();

    // const token = useAppSelector((state) => state.auth.accessToken);
    // const historySearch =
    //     useAppSelector((state) => state.user.historySearch) ?? [];
    // const localSearch = useAppSelector((state) => state.user.localSearch);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchSuggestions, setSearchSuggestions] = useState<
        any[] //ProductType[]
    >([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // useEffect(() => {
    //     if (token && historySearch?.length < 1) {
    //         accountApiRequest
    //             .getHistorySearch(token)
    //             .then((response: HistorySearchItem[]) => {
    //                 dispatch(setHistorySearchList(response));
    //             });
    //     }
    // }, [token, dispatch, historySearch.length]);

    // useEffect(() => {
    //     if (token && localSearch?.length > 0) {
    //         accountApiRequest
    //             .createHistorySearchList(token, localSearch)
    //             .then((response: HistorySearchItem[]) => {
    //                 dispatch(setHistorySearchList(response));
    //             });
    //     }
    // }, [token, dispatch, localSearch]);

    // const form = useForm<HistorySearchBodyType>({
    //     resolver: zodResolver(HistorySearchBody),
    //     defaultValues: {
    //         search_content: '',
    //     },
    // });

    // const getProductSuggestions = useCallback((keyword: string) => {
    //     productApiRequest.getProductsByKeyword(keyword).then((response) => {
    //         setSearchSuggestions(response.data.products);
    //     });
    // }, []);

    // const debouncedSearch = useCallback(
    //     debounce((query) => {
    //         getProductSuggestions(query);
    //     }, 500),
    //     [],
    // );

    const handleOnChange = (keyword: string) => {
        setSearchTerm(keyword);
        if (keyword) {
            console.log('Search term changed', keyword);
            // debouncedSearch(keyword);
        }
    };

    const onSubmit = async () => {
        return;
        // if (!searchTerm) return;

        // const searchItem = {
        //     id: 'asdfjsdf', //uuidv4()
        //     search_content: searchTerm,
        // };

        // if (token) {
        //     const searchItemResponse =
        //         await accountApiRequest.createHistorySearch(token, searchItem);
        //     const isExist = historySearch.find(
        //         (item) =>
        //             item.search_content === searchItemResponse.search_content,
        //     );
        //     if (!isExist) {
        //         dispatch(setHistorySearchItem(searchItemResponse));
        //     }
        // } else {
        //     const isExist = localSearch.find(
        //         (item) => item.search_content === searchItem.search_content,
        //     );
        //     if (!isExist) {
        //         dispatch(setLocalSearchItem(searchItem));
        //     }
        // }

        // form.reset();
        // setIsOpen(false);
        // setSearchTerm('');
        // navigation.navigate('Search', {
        //     keywords: searchItem.search_content.replaceAll(' ', '+'),
        // });
    };

    const handleSearchByImage = async (image) => {
        return;
        // if (loading) return;
        // setLoading(true);
        // const response = await productApiRequest.getProductsByImage(image);
        // setLoading(false);
        // if (response.statusCode === 200) {
        //     dispatch(setProductsSearch(response.data));
        //     navigation.navigate('Search');
        // }
    };

    const validateFile = (event: ChangeEvent<HTMLInputElement>) => {
        return;
        // const image = event.target.files?.[0];
        // if (image) {
        //     if (inputRef.current) {
        //         inputRef.current.value = '';
        //     }
        //     handleSearchByImage(image);
        // }
    };

    return (
        <View className="mx-2 items-center w-[80%]">
            <View className="w-full space-x-2">
                <View className="w-full relative" style={{ zIndex: 100000 }}>
                    <TextInput
                        // onChangeText={handleOnChange}
                        // value={searchTerm}
                        onPress={() => router.push('/(root)/search' as Href)}
                        placeholder="Bạn cần tìm gì..."
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    {loading ? (
                        <ActivityIndicator
                            size="small"
                            className="absolute top-2 right-4"
                        />
                    ) : (
                        <Image
                            //  onPress={() => inputRef.current?.click()}
                            source={icons.camera}
                            className="h-6 w-6 absolute top-3 right-3"
                            resizeMode="contain"
                        />
                    )}
                    <HeaderSearchList
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchList={
                            []
                            // token ? [...historySearch] : [...localSearch]
                        }
                        searchSuggestions={searchSuggestions}
                        setSearchSuggestions={setSearchSuggestions}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                </View>
                {/* <View>
                    <TouchableOpacity
                        onPress={onSubmit}
                        className="px-4 py-2 bg-blue-500 rounded-lg"
                    >
                        <Image
                            source={icons.search}
                            className="h-6 w-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View> */}
            </View>
        </View>
    );
}
