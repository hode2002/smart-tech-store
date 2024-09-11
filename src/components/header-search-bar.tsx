'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    HistorySearchBody,
    HistorySearchBodyType,
} from '@/schemaValidations/account.schema';
import {
    HistorySearchItem,
    ProductType,
    setHistorySearchItem,
    setHistorySearchList,
    setLocalSearchItem,
} from '@/lib/store/slices';
import accountApiRequest from '@/apiRequests/account';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useState } from 'react';
import HeaderSearchList from '@/components/header-search-list';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import productApiRequest from '@/apiRequests/product';
import { ProductPaginationResponseType } from '@/schemaValidations/product.schema';

export default function HeaderSearchBar() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const token = useAppSelector((state) => state.auth.accessToken);

    const historySearch =
        useAppSelector((state) => state.user.historySearch) ?? [];
    const localSearch = useAppSelector((state) => state.user.localSearch);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchSuggestions, setSearchSuggestions] = useState<ProductType[]>(
        [],
    );

    useEffect(() => {
        if (token && historySearch?.length < 1) {
            accountApiRequest
                .getHistorySearch(token)
                .then((response: HistorySearchItem[]) => {
                    dispatch(setHistorySearchList(response));
                });
        }
    }, [token, dispatch, historySearch.length]);

    useEffect(() => {
        if (token && localSearch?.length > 0) {
            accountApiRequest
                .createHistorySearchList(token, localSearch)
                .then((response: HistorySearchItem[]) => {
                    dispatch(setHistorySearchList(response));
                });
        }
    }, [token, dispatch, localSearch]);

    useEffect(() => {
        const handleClick = () => setIsOpen(false);
        window.addEventListener('click', handleClick);
        () => window.removeEventListener('click', handleClick);
    }, []);

    const form = useForm<HistorySearchBodyType>({
        resolver: zodResolver(HistorySearchBody),
        defaultValues: {
            search_content: '',
        },
    });

    const getProductSuggestions = useCallback((keyword: string) => {
        productApiRequest
            .getProductsByKeyword(keyword)
            .then((response: ProductPaginationResponseType) => {
                setSearchSuggestions(response.data.products);
            });
    }, []);

    //eslint-disable-next-line
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

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!searchTerm) return;

        const searchItem = {
            id: uuidv4(),
            search_content: searchTerm,
        };

        if (token) {
            const searchItemResponse: HistorySearchItem =
                await accountApiRequest.createHistorySearch(token, searchItem);

            const isExist = historySearch.find(
                (item) =>
                    item.search_content === searchItemResponse.search_content,
            );
            if (!isExist) {
                dispatch(setHistorySearchItem(searchItemResponse));
            }
        } else {
            const isExist = localSearch.find(
                (item) => item.search_content === searchItem.search_content,
            );
            if (!isExist) {
                dispatch(setLocalSearchItem(searchItem));
            }
        }

        form.reset();

        setIsOpen(false);
        setSearchTerm('');

        router.push(
            `/search?keywords=${searchItem.search_content.replaceAll(' ', '+')}`,
        );
    };

    return (
        <div
            className="mx-4 items-center w-[94%] md:w-full"
            onClick={(e) => e.stopPropagation()}
        >
            <Form {...form}>
                <form
                    onClick={() => setIsOpen(true)}
                    className="flex w-full items-center space-x-2"
                >
                    <div className="w-full relative">
                        <FormField
                            control={form.control}
                            name="search_content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            onClick={(e) => e.preventDefault()}
                                            onChange={(e) =>
                                                handleOnChange(e.target.value)
                                            }
                                            value={searchTerm}
                                            autoComplete="off"
                                            placeholder="Bạn cần tìm gì..."
                                            className="px-2 py-5 w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <HeaderSearchList
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            searchList={
                                token ? [...historySearch] : [...localSearch]
                            }
                            searchSuggestions={searchSuggestions}
                            setSearchSuggestions={setSearchSuggestions}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                    <Button
                        className="hidden md:block"
                        onClick={(e) => onSubmit(e)}
                    >
                        <Search />
                    </Button>
                </form>
            </Form>
        </div>
    );
}
