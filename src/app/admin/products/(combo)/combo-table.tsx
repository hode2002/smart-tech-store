import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import adminApiRequest, {
    ComboResponseType,
    UpdateComboResponseType,
    UpdateProductComboResponseType,
} from '@/apiRequests/admin';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useAppSelector } from '@/lib/store';
import { EditComboModal } from '@/app/admin/products/(combo)/edit-combo-modal';

const ComboTable = ({ combos }: { combos: ComboResponseType[] }) => {
    const token = useAppSelector((state) => state.auth.accessToken);

    const [filterCombos, setFilterCombos] = useState<ComboResponseType[]>([]);

    useEffect(() => {
        setFilterCombos(combos);
    }, [combos]);

    const handleUpdateComboStatus = async (
        combo: ComboResponseType,
        status: number,
    ) => {
        const response = (await adminApiRequest.updateCombo(token, combo.id, {
            status,
        })) as UpdateComboResponseType;
        if (response?.statusCode === 200) {
            toast({
                title: 'Success',
                description: response.message,
                variant: 'default',
            });
            setFilterCombos([
                ...filterCombos.filter((item) => {
                    if (item.id === combo.id) {
                        item.status = status;
                    }
                    return item;
                }),
            ]);
        }
    };

    const handleEditProductCombo = async (combo: ComboResponseType) => {
        const data = combo.product_combos.map((item) => ({
            product_option_id: item.product_option.id,
            discount: item.discount,
        }));
        const response: UpdateProductComboResponseType =
            await adminApiRequest.updateProductCombo(token, combo.id, {
                productCombos: data,
            });
        if (response?.statusCode === 200) {
            setFilterCombos([
                ...combos.map((item) => {
                    if (item.id === combo.id) {
                        return combo;
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
                    <TableHead className="w-[100px] table-cell">
                        <span className="md:sr-only text-nowrap">Hình ảnh</span>
                    </TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Sản phẩm đi kèm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="table-cell text-nowrap">
                        Ngày tạo
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filterCombos &&
                    filterCombos?.map((combo) => {
                        const product = combo?.product_option.product;
                        const discountPercent = combo.product_option.discount;
                        const originalPrice =
                            combo.product_option.product.price;
                        const priceModified =
                            originalPrice + combo.product_option.price_modifier;
                        const discountPrice =
                            priceModified -
                            (priceModified * discountPercent) / 100;
                        return (
                            <TableRow key={combo.id}>
                                <TableCell className="table-cell">
                                    <Image
                                        alt="Main product image"
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={combo.product_option?.thumbnail}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="table-cell font-medium capitalize text-nowrap">
                                    {product.name +
                                        ' ' +
                                        combo.product_option.sku.replaceAll(
                                            '-',
                                            ' ',
                                        )}
                                </TableCell>
                                <TableCell className="table-cell">
                                    <p>{formatPrice(discountPrice)}</p>
                                    {discountPercent > 0 && (
                                        <>
                                            <span className="line-through opacity-90">
                                                {discountPercent > 0 &&
                                                    formatPrice(product.price)}
                                            </span>
                                            <span> -{discountPercent}%</span>
                                        </>
                                    )}
                                </TableCell>
                                <TableCell className="flex flex-wrap gap-2">
                                    {combo?.product_combos &&
                                        combo.product_combos.map((item) => {
                                            return (
                                                <Image
                                                    key={item.id}
                                                    alt="Product combo image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    width="64"
                                                    src={
                                                        item?.product_option
                                                            .thumbnail
                                                    }
                                                />
                                            );
                                        })}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {combo.status ? (
                                        <Badge variant="destructive">
                                            Đã dừng
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            Đang hoạt động
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="table-cell text-nowrap">
                                    {moment(combo.created_at).format(
                                        'DD-MM-YYYY HH:mm:ss',
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
                                            <EditComboModal
                                                combo={combo}
                                                handleEditProductCombo={
                                                    handleEditProductCombo
                                                }
                                            />
                                            <AlertDialog>
                                                {combo.status ? (
                                                    <>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="flex justify-start px-2 w-full"
                                                            >
                                                                Kích hoạt
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Chắc chắn
                                                                    kích hoạt
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
                                                                        handleUpdateComboStatus(
                                                                            combo,
                                                                            0,
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
                                                                Dừng khuyến mãi
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Dừng khuyến
                                                                    mãi cho sản
                                                                    phẩm này?
                                                                </AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Hủy
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleUpdateComboStatus(
                                                                            combo,
                                                                            1,
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

export default ComboTable;
