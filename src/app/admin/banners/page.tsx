'use client';

import { ListFilter, PlusCircle, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useAppSelector } from '@/lib/store';
import adminApiRequest, {
    BannersResponseType,
    CreateBannerResponseType,
    FetchAllBannersResponseType,
} from '@/apiRequests/admin';
import { useCallback, useEffect, useState } from 'react';
import TableBanners from '@/app/admin/banners/table-banner';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { AddBannerModal } from '@/app/admin/banners/add-banner-modal';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Banner() {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [banners, setBanners] = useState<BannersResponseType[]>([]);
    const [filterBanners, setFilterBanners] = useState<BannersResponseType[]>(
        [],
    );
    const [status, setStatus] = useState<'show' | 'hide' | 'all'>('all');

    const fetchBanners = useCallback(async () => {
        const response = (await adminApiRequest.getAllBanners(
            token,
        )) as FetchAllBannersResponseType;
        if (response?.statusCode === 200) {
            return response.data;
        }
        return [];
    }, [token]);

    useEffect(() => {
        fetchBanners().then((banners) => {
            setBanners(banners);
            setFilterBanners(banners);
        });
    }, [fetchBanners, status]);

    const handleAddBanner = async (
        title: string,
        image: File,
        link: string,
        type: string,
    ) => {
        const response: CreateBannerResponseType =
            await adminApiRequest.createNewBanner(token, {
                title,
                image,
                link,
                type,
            });

        if (response?.statusCode === 201) {
            setBanners([...banners, response.data]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        if (searchText) {
            setFilterBanners(
                banners.filter((banner) =>
                    banner.title
                        .toLowerCase()
                        .includes(searchText.toLowerCase()),
                ),
            );
        } else {
            setFilterBanners(banners);
        }
    }, [banners, setFilterBanners, searchText]);

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
                    <div className="flex items-center gap-2 ms-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 gap-1 text-sm py-4"
                                >
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span>Lọc</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    Trạng thái
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus('all')}
                                    checked={status === 'all'}
                                >
                                    Tất cả
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus('show')}
                                    checked={status === 'show'}
                                >
                                    Đang hiển thị
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    onClick={() => setStatus('hide')}
                                    checked={status === 'hide'}
                                >
                                    Đã ẩn
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button
                        size="sm"
                        className="h-7 py-4 flex items-center gap-2 ms-4"
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap">
                            <AddBannerModal handleAddBanner={handleAddBanner} />
                        </span>
                    </Button>
                </div>
            </div>
            <ScrollArea>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách</CardTitle>
                            <CardDescription>
                                Tạo mới và chỉnh sửa banner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TableBanners
                                status={status}
                                banners={filterBanners}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </ScrollArea>
        </Tabs>
    );
}
