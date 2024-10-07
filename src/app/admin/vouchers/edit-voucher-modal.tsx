import { UpdateVoucherBodyType, VoucherType } from '@/apiRequests/voucher';
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import moment from 'moment';

type Props = {
    voucher: VoucherType;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleEditVoucher: (
        voucher: VoucherType,
        data: UpdateVoucherBodyType,
    ) => Promise<void>;
};
export function EditVoucherModal(props: Props) {
    const { voucher, open, setOpen, handleEditVoucher } = props;
    const [code, setCode] = useState<string>('');
    const [type, setType] = useState<'FIXED' | 'PERCENT'>('FIXED');
    const [value, setValue] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [quantity, setQuantity] = useState<number>(0);
    const [minOrderValue, setMinOrderValue] = useState<number>(0);

    useEffect(() => {
        setCode(voucher.code);
        setType(voucher.type);
        setValue(voucher.value);
        setStartDate(voucher.start_date);
        setEndDate(voucher.end_date);
        setQuantity(voucher.available_quantity);
        setMinOrderValue(voucher.min_order_value);
    }, [voucher, open]);

    const handleSubmit = async () => {
        await handleEditVoucher(voucher, {
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
                <Button
                    variant="ghost"
                    className="flex justify-start px-2 w-full"
                >
                    Cập nhật
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] md:min-w-max rounded-md">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin mã giảm giá</DialogTitle>
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
                            value={moment(startDate).format('YYYY-MM-DD')}
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
                            value={moment(endDate).format('YYYY-MM-DD')}
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
