import { MoreHorizontal } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/store/slices';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store';
import adminApiRequest, {
    RemoveCategoryResponseType,
    RestoreCategoryResponseType,
    UpdateCategoryResponseType,
} from '@/apiRequests/admin';
import { toast } from '@/components/ui/use-toast';
import { EditCategoryModal } from '@/app/admin/products/(category)/edit-category-modal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Props = {
    categories: Category[];
};

const CategoryTable = (props: Props) => {
    const { categories } = props;

    const [filterCategories, setFilterCategories] = useState<Category[]>([]);
    const token = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        setFilterCategories(categories);
    }, [categories]);

    const handleRemoveCategory = async (cate: Category) => {
        const response = (await adminApiRequest.removeCategory(
            token,
            cate.id,
        )) as RemoveCategoryResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
            setFilterCategories([
                ...filterCategories.filter((item) => {
                    if (item.id === cate.id) {
                        item.is_deleted = !cate.is_deleted;
                    }
                    return item;
                }),
            ]);
        }
    };

    const handleRestoreCategory = async (cate: Category) => {
        const response = (await adminApiRequest.restoreCategory(
            token,
            cate.id,
        )) as RestoreCategoryResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
            setFilterCategories([
                ...filterCategories.filter((item) => {
                    if (item.id === cate.id) {
                        item.is_deleted = !cate.is_deleted;
                    }
                    return item;
                }),
            ]);
        }
    };

    const [open, setOpen] = useState<boolean>(false);
    const handleEditCategory = async (cate: Category, description?: string) => {
        setOpen(false);

        const response: UpdateCategoryResponseType =
            await adminApiRequest.updateCategory(token, cate.id, {
                description,
            });

        if (response?.statusCode === 200) {
            const categoryUpdated = response.data;
            setFilterCategories([
                ...categories.map((item) => {
                    if (item.id === categoryUpdated.id) {
                        item.description = categoryUpdated.description;
                        return item;
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
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="table-cell">Tên</TableHead>
                    <TableHead className="table-cell">Mô tả</TableHead>
                    <TableHead className="table-cell">Trạng thái</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Ngày tạo
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories &&
                    categories?.map((category) => {
                        return (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium capitalize">
                                    {category.name}
                                </TableCell>
                                <TableCell>
                                    {category?.description ?? '--'}
                                </TableCell>
                                <TableCell>
                                    {category.is_deleted ? (
                                        <Badge variant="destructive">
                                            Đã xóa
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            Đang hoạt động
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {moment(category.created_at).format(
                                        'DD-MM-YYYY',
                                    )}
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
                                            <EditCategoryModal
                                                category={category}
                                                open={open}
                                                setOpen={setOpen}
                                                handleEditCategory={
                                                    handleEditCategory
                                                }
                                            />
                                            <AlertDialog>
                                                {category.is_deleted ? (
                                                    <>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="flex justify-start px-2 w-full"
                                                            >
                                                                Khôi phục
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Chắc chắn
                                                                    khôi phục
                                                                    danh mục
                                                                    này?
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleRestoreCategory(
                                                                            category,
                                                                        )
                                                                    }
                                                                >
                                                                    Xác nhận
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
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
                                                                    Xóa danh mục
                                                                    này?
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleRemoveCategory(
                                                                            category,
                                                                        )
                                                                    }
                                                                >
                                                                    Xác nhận
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </>
                                                )}
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};

export default CategoryTable;
