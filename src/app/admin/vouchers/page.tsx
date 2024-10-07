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
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AddVoucherModal } from '@/app/admin/vouchers/add-voucher-modal';
import VoucherTable from '@/app/admin/vouchers/voucher-table';
import voucherApiRequest, {
    CreateVoucherBodyType,
    GetAllVoucherResponseType,
    VoucherResponseType,
    VoucherType,
} from '@/apiRequests/voucher';

const VoucherPage = () => {
    const token = useAppSelector((state) => state.auth.accessToken);
    const [vouchers, setVouchers] = useState<VoucherType[]>([]);
    const [filterVouchers, setFilterVouchers] = useState<VoucherType[]>([]);

    useEffect(() => {
        (async () => {
            const response = (await voucherApiRequest.getAll(
                token,
            )) as GetAllVoucherResponseType;
            if (response?.statusCode === 200) {
                setVouchers(response.data);
                setFilterVouchers(response.data);
            }
        })();
    }, [token]);

    const handleAddVoucher = async (data: CreateVoucherBodyType) => {
        const response: VoucherResponseType = await voucherApiRequest.create(
            token,
            data,
        );

        if (response?.statusCode === 201) {
            setVouchers((prev) => [...prev, response.data]);
            toast({
                title: 'Success',
                description: response.message,
            });
        }
    };

    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        if (searchText) {
            setFilterVouchers(
                vouchers.filter((item) =>
                    item.code.toLowerCase().includes(searchText.toLowerCase()),
                ),
            );
        } else {
            setFilterVouchers(vouchers);
        }
    }, [vouchers, setFilterVouchers, searchText]);

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
                            <AddVoucherModal
                                handleAddVoucher={handleAddVoucher}
                            />
                        </div>
                    </Button>
                </div>
            </div>
            <ScrollArea>
                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách mã giảm giá</CardTitle>
                            <CardDescription>
                                Tạo mới và quản lý mã giảm giá
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <VoucherTable
                                vouchers={filterVouchers}
                                setVouchers={setVouchers}
                            />
                            <ScrollBar orientation="horizontal" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </ScrollArea>
        </Tabs>
    );
};

export default VoucherPage;
