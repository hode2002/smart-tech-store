'use client';

import { PlusCircle, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useAppSelector } from '@/lib/store';
import adminApiRequest, {
    CreateNewsResponseType,
    DeleteNewsResponseType,
    FetchAllNewsResponseType,
    NewsResponseType,
    UpdateNewsResponseType,
} from '@/apiRequests/admin';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import TableNews from '@/app/admin/news/table-news';
import { AddNewsModal } from '@/app/admin/news/add-news-modal';

export default function News() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [news, setNews] = useState<NewsResponseType[]>([]);
    const [filterNews, setFilterNews] = useState<NewsResponseType[]>([]);

    useEffect(() => {
        (async () => {
            const response =
                (await adminApiRequest.getAllNews()) as FetchAllNewsResponseType;
            if (response?.statusCode === 200) {
                setNews(response.data);
                setFilterNews(response.data);
            }
        })();
    }, []);

    const handleAddNews = async (
        title: string,
        content: string,
        image: File,
    ) => {
        const response: CreateNewsResponseType =
            await adminApiRequest.createNews(token, {
                title,
                content,
                image,
            });
        if (response?.statusCode === 201) {
            setNews((prev) => [...prev, response.data]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const handleUpdateNews = async (
        newsUpdated: NewsResponseType,
        content?: string,
        image?: File,
    ) => {
        const response: UpdateNewsResponseType =
            await adminApiRequest.updateNews(token, newsUpdated.id, {
                content,
                image,
            });
        if (response?.statusCode === 200) {
            setNews([
                ...news.map((item) => {
                    if (item.id === response.data.id) {
                        item = response.data;
                    }
                    return item;
                }),
            ]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const handleDeleteNews = async (newsId: string) => {
        const response = (await adminApiRequest.deleteNews(
            token,
            newsId,
        )) as DeleteNewsResponseType;
        if (response?.statusCode === 200) {
            setNews((prev) => [...prev.filter((item) => item.id !== newsId)]);
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
        }
    };

    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        if (searchText) {
            setFilterNews(
                news.filter((item) =>
                    item.title.toLowerCase().includes(searchText.toLowerCase()),
                ),
            );
        } else {
            setFilterNews(news);
        }
    }, [news, setFilterNews, searchText]);

    return (
        <Tabs
            defaultValue="all"
            className="flex flex-col gap-4 px-6 bg-muted/40 p-4"
        >
            <div className="flex items-center w-full md:justify-end">
                <div className="flex items-center w-full justify-between">
                    <div className="relative md:ml-auto md:grow-0 flex gap-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            type="text"
                            placeholder="Tìm kiếm"
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        />
                    </div>
                    <Button
                        size="sm"
                        className="h-7 py-4 flex items-center gap-2 ms-4"
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <div className="whitespace-nowrap">
                            <AddNewsModal handleAddNews={handleAddNews} />
                        </div>
                    </Button>
                </div>
            </div>
            <ScrollArea>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách</CardTitle>
                            <CardDescription>
                                Tạo mới và chỉnh sửa tin tức
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TableNews
                                news={filterNews}
                                handleDeleteNews={handleDeleteNews}
                                handleUpdateNews={handleUpdateNews}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </ScrollArea>
        </Tabs>
    );
}
