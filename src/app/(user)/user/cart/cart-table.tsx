'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import Image from 'next/image';
import { ChevronDownIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import Link from 'next/link';
import {
    CartItem,
    ProductCheckout,
    ProductOption,
    removeCartItem,
    setCartProducts,
    setProductCheckout,
} from '@/lib/store/slices';
import { formatPrice } from '@/lib/utils';
import accountApiRequest, {
    AddToCartResponseType,
    ChangeProductOptionResponseType,
    RemoveCartProductResponseType,
} from '@/apiRequests/account';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export type Column = {
    id: string;
    product: {
        name: string;
        thumbnail: string;
    };
    unitPrice: number;
    quantity: number;
    total: number;
    selectedOption: ProductOption;
    otherOptions?: ProductOption[];
};

export default function CartTable() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [setIsClient]);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.accessToken);
    const userProfile = useAppSelector((state) => state.user.profile);
    const userAddress = useAppSelector((state) => state.user.address);
    const cartProducts = useAppSelector((state) => state.user.cart);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const data: Column[] = useMemo(
        () =>
            cartProducts.map((cartItem: CartItem) => {
                const selectedOption = cartItem.selected_option;
                return {
                    id: cartItem.id,
                    product: {
                        thumbnail: selectedOption.thumbnail,
                        name:
                            cartItem.name +
                            ' ' +
                            selectedOption.sku.replaceAll('-', ' '),
                    },
                    quantity:
                        cartItem.quantity < selectedOption.stock
                            ? cartItem.quantity
                            : selectedOption.stock,
                    unitPrice: cartItem.price,
                    total:
                        cartItem.quantity *
                        (cartItem.price -
                            (cartItem.price * selectedOption.discount) / 100 +
                            selectedOption.price_modifier),
                    selectedOption: {
                        id: selectedOption.id,
                        price_modifier: selectedOption.price_modifier,
                        discount: selectedOption.discount,
                        thumbnail: selectedOption.thumbnail,
                        slug: selectedOption.slug,
                        sku: selectedOption.sku,
                        stock: selectedOption.stock,
                        options: selectedOption.options,
                        is_sale: selectedOption.is_sale,
                        label_image: selectedOption.label_image,
                        product_images: selectedOption.product_images,
                        weight: selectedOption.weight,
                    },
                    otherOptions: cartItem.other_product_options.map(
                        (otherOption) => ({
                            id: otherOption.id,
                            price_modifier: otherOption.price_modifier,
                            discount: otherOption.discount,
                            thumbnail: otherOption.thumbnail,
                            slug: otherOption.slug,
                            sku: otherOption.sku,
                            stock: otherOption.stock,
                            options: otherOption.options,
                            is_sale: otherOption.is_sale,
                            label_image: otherOption.label_image,
                            product_images: otherOption.product_images,
                            weight: otherOption.weight,
                        }),
                    ),
                };
            }),
        [cartProducts],
    );

    const columns: ColumnDef<Column>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'product',
            header: () => <div>Sản phẩm</div>,
            cell: ({ row }) => {
                const product = row.getValue<{
                    thumbnail: string;
                    name: string;
                }>('product');
                return (
                    <div className="text-right font-medium flex gap-2 items-center">
                        <Image
                            src={product.thumbnail}
                            alt={product.name}
                            width={80}
                            height={80}
                        />
                        <p>{product.name}</p>
                    </div>
                );
            },
        },
        {
            id: 'otherOptions',
            accessorKey: 'otherOptions',
            header: () => <></>,
            cell: ({ row }) => {
                let currOption = row.original?.selectedOption;
                const otherOptions =
                    row.getValue<ProductOption[]>('otherOptions');

                const handleSelectedOption = async (option: ProductOption) => {
                    const response =
                        (await accountApiRequest.changeProductOption(token, {
                            oldOptionId: currOption.id,
                            newOptionId: option.id,
                        })) as ChangeProductOptionResponseType;

                    if (response.statusCode === 200) {
                        accountApiRequest
                            .getProductsFromCart(token)
                            .then((response) => {
                                if (response?.statusCode === 200) {
                                    dispatch(setCartProducts(response?.data));
                                }
                            });
                        currOption = option;
                    }
                };
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div>
                                <Button
                                    className={
                                        otherOptions?.length > 0 ? '' : 'hidden'
                                    }
                                    variant="ghost"
                                >
                                    <p className="flex gap-1 items-center">
                                        <span>Phân loại</span>
                                        <ChevronDownIcon className="top-[1px] ml-1 h-3 w-3" />
                                    </p>
                                </Button>
                                <p>
                                    {currOption?.sku} ({currOption?.stock})
                                </p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <ul className="left-0 w-[200px]">
                                {otherOptions?.length > 0 &&
                                    otherOptions.map((option, index) => {
                                        if (option.stock > 0) {
                                            return (
                                                <li
                                                    key={index}
                                                    onClick={() =>
                                                        handleSelectedOption(
                                                            option,
                                                        )
                                                    }
                                                >
                                                    <DropdownMenuItem>
                                                        <div className="flex p-2 gap-3 items-center rounded-md cursor-pointer bg-popover hover:text-popover hover:bg-popover-foreground">
                                                            <Image
                                                                src={
                                                                    option.thumbnail
                                                                }
                                                                width={30}
                                                                height={30}
                                                                alt={option.sku}
                                                            />
                                                            <div className="items-start">
                                                                <div className="text-sm leading-none">
                                                                    {option.sku}
                                                                </div>
                                                            </div>
                                                            <p>
                                                                ({option?.stock}
                                                                )
                                                            </p>
                                                        </div>
                                                    </DropdownMenuItem>
                                                </li>
                                            );
                                        }
                                    })}
                            </ul>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: 'unitPrice',
            header: () => <div className="text-center">Đơn giá</div>,
            cell: ({ row }) => {
                const selectedOption = row.original?.selectedOption;
                const unitPrice = parseFloat(row.getValue('unitPrice'));
                const priceModifier =
                    unitPrice -
                    (unitPrice * selectedOption.discount) / 100 +
                    selectedOption.price_modifier;
                return (
                    <>
                        <div className="text-center font-medium">
                            {formatPrice(priceModifier)}
                        </div>
                        {selectedOption.discount !== 0 && (
                            <div className="text-center font-medium">
                                <span className="line-through">
                                    {formatPrice(
                                        unitPrice +
                                            selectedOption.price_modifier,
                                    )}
                                </span>
                                <span> - {selectedOption.discount} %</span>
                            </div>
                        )}
                    </>
                );
            },
        },
        {
            accessorKey: 'quantity',
            header: () => <div className="text-right">Số lượng</div>,
            cell: ({ row }) => {
                const productOption = row.original?.selectedOption;
                const unitPrice = row.original.unitPrice;
                const quantity = row.getValue<number>('quantity');
                const productId = row.original.id;

                const handleUpdateQuantity = async (
                    type: 'DECREASE' | 'INCREASE',
                ) => {
                    let newQuantity = quantity;

                    if (type === 'DECREASE') {
                        if (newQuantity - 1 < 1) {
                            const isConfirm = window.confirm('Xóa sản phẩm?');
                            if (!isConfirm) return;

                            const productOptionId =
                                row.original.selectedOption.id;
                            const response =
                                (await accountApiRequest.removeProductFromCart(
                                    token,
                                    { productOptionId },
                                )) as RemoveCartProductResponseType;
                            if (response.statusCode === 200) {
                                dispatch(removeCartItem({ productId }));
                                toast({ description: 'Xóa thành công' });
                                return;
                            }
                        }
                        newQuantity--;
                    } else if (type === 'INCREASE') {
                        if (newQuantity + 1 > productOption.stock) {
                            toast({
                                description: 'Không đủ số lượng.',
                            });
                            return;
                        }
                        newQuantity++;
                    }

                    const response =
                        (await accountApiRequest.updateProductQuantityFromCart(
                            token,
                            {
                                productOptionId: productOption.id,
                                quantity: newQuantity,
                            },
                        )) as AddToCartResponseType;
                    if (response.statusCode === 200) {
                        const cartItems = cartProducts.filter(
                            (p) =>
                                p.selected_option.id !==
                                response.data.selected_option.id,
                        );
                        dispatch(
                            setCartProducts([...cartItems, response.data]),
                        );
                        if (row.getIsSelected()) {
                            setTotalPrice(newQuantity * unitPrice);
                        }
                    }
                };

                return (
                    <div className="flex justify-end mr-[-21px]">
                        <div className="bg-popover text-popover-foreground dark:bg-popover-foreground dark:text-popover h-10 w-32 flex flex-row rounded-lg relative mt-1">
                            <button
                                onClick={() => handleUpdateQuantity('DECREASE')}
                                className="h-full w-20 rounded-l cursor-pointer outline-none"
                            >
                                <span className="m-auto text-2xl font-thin">
                                    −
                                </span>
                            </button>
                            <input
                                readOnly={true}
                                type="text"
                                className="border-x bg-popover dark:bg-popover-foreground outline-none focus:outline-none text-center w-full font-semibold text-md flex items-center"
                                value={quantity}
                            />
                            <button
                                onClick={() => handleUpdateQuantity('INCREASE')}
                                className="h-full w-20 rounded-r cursor-pointer outline-none"
                            >
                                <span className="m-auto text-2xl font-thin">
                                    +
                                </span>
                            </button>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'total',
            header: () => <div className="text-right">Thành tiền</div>,
            cell: ({ row }) => {
                const total = row.getValue<number>('total');
                return (
                    <div className="text-right font-extrabold text-popover-foreground">
                        {formatPrice(total)}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const handleDeleteProduct = async () => {
                    const productId = row.original.id;
                    const productOptionId = row.original.selectedOption.id;
                    const response =
                        (await accountApiRequest.removeProductFromCart(token, {
                            productOptionId,
                        })) as RemoveCartProductResponseType;
                    if (response.statusCode === 200) {
                        dispatch(removeCartItem({ productId }));
                        toast({ description: 'Xóa thành công' });
                    }
                };

                return (
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Button variant={'ghost'} asChild>
                                        <Link
                                            href={'/'}
                                            className="text-blue-gray-700 hover:text-black block cursor-default select-none rounded-sm px-2 text-start py-1.5 text-sm outline-none"
                                        >
                                            Xem thông tin chi tiết
                                        </Link>
                                    </Button>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="w-full">
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant={'ghost'}
                                            className="text-blue-gray-700 hover:text-black block cursor-default select-none rounded-sm px-2 text-start py-1.5 text-sm outline-none"
                                        >
                                            Xóa sản phẩm
                                        </Button>
                                    </AlertDialogTrigger>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Bạn chắc chắn xóa sản phẩm này khỏi giỏ
                                    hàng?
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <Button
                                    variant={'outline'}
                                    onClick={handleDeleteProduct}
                                >
                                    Xác nhận
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    const [totalPrice, setTotalPrice] = useState(0);
    // eslint-disable-next-line
    useEffect(() => {
        let totalPrice = 0;
        table.getSelectedRowModel().rows.forEach((row) => {
            totalPrice += row.original.total;
        });
        setTotalPrice(totalPrice);
    });

    const handleCheckout = () => {
        const selectedRows = table
            .getSelectedRowModel()
            .rows.filter((row) => row.getIsSelected());

        if (selectedRows.length === 0) return;
        if (!(userProfile?.phone && userAddress?.ward)) {
            toast({
                description:
                    'Vui lòng cập nhật số điện thoại và địa chỉ nhận hàng trước khi thanh toán',
            });
            return router.push(
                `/user/account/${!userProfile?.phone ? 'profile' : 'address'}`,
            );
        }

        const productCheckout: ProductCheckout[] = selectedRows.map((row) => {
            const data = row.original;
            const quantity = data.quantity;
            const priceModifier = data.selectedOption.price_modifier;
            const unitPrice = data.unitPrice;
            const discount = data.selectedOption.discount;

            return {
                id: data.selectedOption.id,
                name: data.product.name,
                thumbnail: data.selectedOption.thumbnail,
                unitPrice,
                priceModifier,
                quantity,
                weight: data.selectedOption.weight,
                discount,
            };
        });

        dispatch(setProductCheckout(productCheckout));
        router.push('/user/checkout');
    };

    return (
        <div className="px-2 md:px-0">
            <ScrollArea>
                <div className="rounded-md border min-w-[1180px]">
                    <Table>
                        <TableHeader>
                            {table?.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isClient && table?.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Chưa có đơn hàng
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {isClient && (
                <div className="border rounded-md my-10 sticky bottom-0 bg-popover">
                    <div className="flex flex-col gap-4 sm:flex-row items-end md:items-center justify-between space-x-2 py-4 px-6">
                        <div className="flex gap-4 items-center">
                            <p className="text-[14px] md:text-[18px]">
                                Tổng thanh toán
                                <span className="whitespace-nowrap mx-1">
                                    (
                                    {
                                        table.getFilteredSelectedRowModel().rows
                                            .length
                                    }
                                </span>
                                <span className="whitespace-nowrap">
                                    sản phẩm):
                                </span>
                            </p>
                            <p className="whitespace-nowrap ml-2 font-bold text-[20px] md:text-[24px] text-popover-foreground">
                                {formatPrice(totalPrice)}
                            </p>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            variant={'default'}
                            className="w-[210px] h-[40px]"
                            disabled={
                                table.getFilteredSelectedRowModel().rows
                                    .length === 0
                            }
                        >
                            Đặt hàng
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
