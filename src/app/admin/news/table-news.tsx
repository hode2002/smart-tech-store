'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import moment from 'moment';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { NewsResponseType } from '@/apiRequests/admin';
import { ScrollBar } from '@/components/ui/scroll-area';
import { EditNewsModal } from '@/app/admin/news/edit-news-modal';
import Image from 'next/image';

type Props = {
    news: NewsResponseType[];
    handleDeleteNews: (newsId: string) => void;
    handleUpdateNews: (
        news: NewsResponseType,
        content?: string,
        image?: File,
    ) => Promise<void>;
};

const TableNews = (props: Props) => {
    const { news, handleDeleteNews, handleUpdateNews } = props;
    return news && news?.length > 0 ? (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="table-cell">
                        <span className="not-sr-only md:sr-only text-nowrap">
                            Hình ảnh
                        </span>
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Tiêu đề
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Nội dung
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Slug
                    </TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Created at
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {news?.map((item) => {
                    return (
                        <TableRow key={item.id}>
                            <TableCell className="table-cell">
                                <Image
                                    alt="Banner image"
                                    className="aspect-square rounded-md object-cover"
                                    height="100"
                                    src={item.image}
                                    width="100"
                                />
                            </TableCell>
                            <TableCell className="font-medium text-nowrap max-w-[300px] truncate">
                                {item.title}
                            </TableCell>
                            <TableCell>
                                <div
                                    className="font-medium text-nowrap max-w-[500px] truncate"
                                    dangerouslySetInnerHTML={{
                                        __html: item.content,
                                    }}
                                ></div>
                            </TableCell>
                            <TableCell className="font-medium text-nowrap max-w-[300px] truncate">
                                {item.slug}
                            </TableCell>
                            <TableCell className="table-cell text-nowrap">
                                {moment(item.created_at).format('DD-MM-YYYY')}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                                Toggle menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Thao tác
                                        </DropdownMenuLabel>
                                        <EditNewsModal
                                            news={item}
                                            handleUpdateNews={handleUpdateNews}
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="flex justify-start px-2 w-full"
                                                >
                                                    Xóa
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Xóa vĩnh viễn?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tin tức sẽ được xóa khỏi
                                                        cơ sở dữ liệu.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteNews(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        Xác nhận
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <ScrollBar orientation="horizontal" />
        </Table>
    ) : (
        <p className="text-center">Không tìm thấy</p>
    );
};

export default TableNews;
