import { CreateVoucherBodyType } from '@/apiRequests/voucher';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

type Props = {
    handleAddVoucher: (data: CreateVoucherBodyType) => Promise<void>;
};
export function AddVoucherModal(props: Props) {
    const { handleAddVoucher } = props;

    const [code, setCode] = useState<string>('');
    const [type, setType] = useState<'FIXED' | 'PERCENT'>('FIXED');
    const [value, setValue] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [quantity, setQuantity] = useState<number>(0);
    const [minOrderValue, setMinOrderValue] = useState<number>(0);

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setCode('');
        setType('FIXED');
        setValue(0);
        setStartDate(new Date());
        setEndDate(new Date());
        setQuantity(0);
        setMinOrderValue(0);
    }, [open]);

    const handleSubmit = async () => {
        await handleAddVoucher({
            type,
            code,
            value,
            available_quantity: quantity,
            start_date: startDate,
            end_date: endDate,
            min_order_value: minOrderValue,
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-start px-2 w-full">
                    Thêm mã giảm giá
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] md:min-w-max rounded-md">
                <DialogHeader>
                    <DialogTitle>Tạo mới mã giảm giá</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">
                            Code
                        </Label>
                        <Input
                            id="code"
                            autoComplete="off"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="col-span-3 disabled"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Loại
                        </Label>
                        <Select
                            value={type}
                            onValueChange={(value) =>
                                setType(value as 'FIXED' | 'PERCENT')
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="FIXED">FIXED</SelectItem>
                                    <SelectItem value="PERCENT">
                                        PERCENT
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                            Giá trị
                        </Label>
                        <Input
                            id="value"
                            autoComplete="off"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(+e.target.value)}
                            className="col-span-3 disabled"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">
                            Ngày áp dụng
                        </Label>
                        <Input
                            id="startDate"
                            autoComplete="off"
                            type="date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(e) =>
                                setStartDate(new Date(e.target.value))
                            }
                            className="col-span-3 disabled"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">
                            Ngày hết hạn
                        </Label>
                        <Input
                            id="startDate"
                            autoComplete="off"
                            type="date"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) =>
                                setEndDate(new Date(e.target.value))
                            }
                            className="col-span-3 disabled"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Số lượng
                        </Label>
                        <Input
                            id="quantity"
                            autoComplete="off"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(+e.target.value)}
                            className="col-span-3 disabled"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="minOrderValue" className="text-right">
                            Đơn hàng tối thiểu
                        </Label>
                        <Input
                            id="minOrderValue"
                            autoComplete="off"
                            value={minOrderValue}
                            onChange={(e) => setMinOrderValue(+e.target.value)}
                            className="col-span-3 disabled"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant={'outline'} onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit}>Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
