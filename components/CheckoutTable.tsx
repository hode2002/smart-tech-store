import React, { useMemo, useState } from 'react';
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
import { formatPrice } from '@/lib/utils';
import { useUserStore } from '@/store';
import { CheckoutTableColumn } from '@/types/type';
import { Image, Text, TextInput, View } from 'react-native';

export default function CheckoutTable() {
    const { checkout: products } = useUserStore((state) => state);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const data: CheckoutTableColumn[] = useMemo(
        () =>
            products.map((product) => {
                return {
                    id: product.id,
                    product: {
                        name: product.name,
                        thumbnail: product.thumbnail,
                    },
                    unitPrice: product.unitPrice,
                    quantity: product.quantity,
                    total:
                        product.quantity *
                        (product.unitPrice +
                            product.priceModifier -
                            ((product.unitPrice + product.priceModifier) *
                                product.discount) /
                                100),
                    discount: product.discount,
                    priceModifier: product.priceModifier,
                };
            }),
        [products],
    );

    const columns: ColumnDef<CheckoutTableColumn>[] = useMemo(
        () => [
            {
                accessorKey: 'product',
                cell: ({ row }) => {
                    const product = row.getValue<{
                        thumbnail: string;
                        name: string;
                    }>('product');
                    return (
                        <View className="flex-row w-11/12 items-start gap-2">
                            <Image
                                source={{ uri: product.thumbnail }}
                                alt={product.name}
                                width={80}
                                height={80}
                            />
                            <View className="w-[75%]">
                                <Text className="font-JakartaBold flex-wrap w-11/12">
                                    {product.name}
                                </Text>
                            </View>
                        </View>
                    );
                },
            },
            {
                accessorKey: 'unitPrice',
                cell: ({ row }) => {
                    const unitPrice = row.original.unitPrice;
                    const priceModifier =
                        unitPrice +
                        row.original.priceModifier -
                        ((unitPrice + row.original.priceModifier) *
                            row.original.discount) /
                            100;
                    return (
                        <View className="z-10 absolute w-[55%] left-[88px] flex-col top-[-55px] ml-2">
                            <View className="text-center mt-2">
                                <Text className="font-JakartaBold text-lg text-red-500">
                                    {formatPrice(priceModifier)}
                                </Text>
                            </View>
                            {row.original.discount !== 0 && (
                                <View className="flex-row gap-2 text-center">
                                    <Text className="line-through text-sm font-JakartaMedium text-gray-400">
                                        {formatPrice(
                                            unitPrice +
                                                row.original.priceModifier,
                                        )}
                                    </Text>
                                    <Text className="font-JakartaMedium text-sm">
                                        -{row.original.discount} %
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                },
            },
            {
                accessorKey: 'quantity',
                cell: ({ row }) => {
                    const quantity = row.getValue<number>('quantity');
                    return (
                        <View className="absolute top-[-10px] left-[88px]">
                            <View className="flex-row items-center">
                                <Text className="ps-2 pe-1 font-JakartaMedium">
                                    Số lượng:
                                </Text>
                                <TextInput
                                    editable={false}
                                    className="text-black text-center w-4 font-JakartaSemiBold text-md flex items-center justify-center"
                                    value={String(quantity)}
                                />
                            </View>
                        </View>
                    );
                },
            },
        ],
        [],
    );

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

    return (
        <View className="bg-[#f2f2f2]">
            {table?.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <View
                        key={row.id}
                        className="flex-col pt-4 pb-6 bg-white w-full"
                    >
                        {row.getVisibleCells().map((cell) => {
                            const value = cell.getValue();
                            if (!value) return;
                            return (
                                <View key={cell.id} className="p-2">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))
            ) : (
                <View>
                    <Text className="h-24 text-center">No results.</Text>
                </View>
            )}
        </View>
    );
}
