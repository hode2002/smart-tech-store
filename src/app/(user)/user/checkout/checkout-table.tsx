'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAppSelector } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export type Column = {
    id: string;
    product: {
        name: string;
        thumbnail: string;
    };
    unitPrice: number;
    quantity: number;
    total: number;
    // selectedOption: ProductOption;
};

export default function CheckoutTable() {
    const [isClient, setIsClient] = useState(false);

    const products = useAppSelector((state) => state.user.checkout);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const data: Column[] = useMemo(
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
                    total: product.total,
                };
            }),
        [products],
    );

    const columns: ColumnDef<Column>[] = useMemo(
        () => [
            {
                accessorKey: 'product',
                header: () => <div>Sản phẩm</div>,
                cell: ({ row }) => {
                    const product = row.getValue<{
                        name: string;
                        thumbnail: string;
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
                accessorKey: 'unitPrice',
                header: () => <div className="text-right">Đơn giá</div>,
                cell: ({ row }) => {
                    return (
                        <div className="text-right font-medium">
                            {formatPrice(row.original.total)}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'quantity',
                header: () => <div className="text-right">Số lượng</div>,
                cell: ({ row }) => {
                    const quantity = row.getValue<number>('quantity');
                    return (
                        <div className="flex justify-end mr-[-21px]">
                            <div className="h-10 w-32 flex justify-center items-center mt-1">
                                {quantity}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'total',
                header: () => <div className="text-right">Thành tiền</div>,
                cell: ({ row }) => {
                    const total = parseFloat(row.getValue('total'));

                    return (
                        <div className="text-right font-extrabold text-popover-foreground">
                            {formatPrice(total)}
                        </div>
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

    useEffect(() => {
        setIsClient(true);
    }, []); //eslint-disable-line

    return (
        <div>
            <ScrollArea>
                <div className="rounded-md border min-w-[800px]">
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
                                    <TableRow key={row.id}>
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
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
