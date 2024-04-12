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
    setHistorySearchItem,
    setHistorySearchList,
    setLocalSearchItem,
} from '@/lib/store/slices';
import accountApiRequest from '@/apiRequests/account';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import HeaderSearchList from '@/components/header-search-list';

export default function HeaderSearchBar() {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.accessToken);
    const historySearch = useAppSelector((state) => state.user.historySearch);
    const localSearch = useAppSelector((state) => state.user.localSearch);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (token && historySearch.length < 1) {
            accountApiRequest
                .getHistorySearch(token)
                .then((response: HistorySearchItem[]) => {
                    dispatch(setHistorySearchList(response));
                });
        }

        if (token && localSearch?.length > 0) {
            accountApiRequest
                .createHistorySearchList(token, localSearch)
                .then((response: HistorySearchItem[]) => {
                    dispatch(setHistorySearchList(response));
                });
        }

        const handleClick = () => setIsOpen(false);
        window.addEventListener('click', handleClick);
        () => window.removeEventListener('click', handleClick);
    }, [token, dispatch]); // eslint-disable-line

    const form = useForm<HistorySearchBodyType>({
        resolver: zodResolver(HistorySearchBody),
        defaultValues: {
            search_content: '',
        },
    });

    const onSubmit = async ({ search_content }: HistorySearchBodyType) => {
        if (!search_content) return;

        const searchItem = {
            id: uuidv4(),
            search_content,
        };

        if (token) {
            const searchItemResponse: HistorySearchItem =
                await accountApiRequest.createHistorySearch(token, searchItem);
            dispatch(setHistorySearchItem(searchItemResponse));
        } else {
            dispatch(setLocalSearchItem(searchItem));
        }

        form.reset();
    };

    return (
        <div
            className="mx-4 items-center w-full"
            onClick={(e) => e.stopPropagation()}
        >
            <Form {...form}>
                <form
                    onClick={() => setIsOpen(true)}
                    onSubmit={form.handleSubmit(onSubmit)}
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
                            searchList={token ? historySearch : localSearch}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                    <Button className="hidden md:block" type="submit">
                        <Search />
                    </Button>
                </form>
            </Form>
        </div>
    );
}
