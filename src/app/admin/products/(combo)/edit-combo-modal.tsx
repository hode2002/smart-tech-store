import { ComboResponseType } from '@/apiRequests/admin';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Percent } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
    combo: ComboResponseType;
    handleEditProductCombo: (combo: ComboResponseType) => Promise<void>;
};

export function EditComboModal(props: Props) {
    const { combo, handleEditProductCombo } = props;

    const [open, setOpen] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [productCombos, setProductCombos] = useState<any[]>(
        combo.product_combos,
    );

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);
        await handleEditProductCombo({
            ...combo,
            product_combos: productCombos,
        });
        setLoading(false);
    };

    const handleChangeDiscount = (id: string, newDiscount: string) => {
        setProductCombos((prev) =>
            prev.map((el) => {
                if (el.id === id) {
                    return { ...el, discount: +newDiscount };
                }
                return el;
            }),
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex justify-start px-2 w-full"
                >
                    Chỉnh sửa combo
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] md:min-w-[50%] rounded-md">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa combo sản phẩm</DialogTitle>
                </DialogHeader>
                <ScrollArea>
                    <div className="flex flex-col gap-4 py-4 h-[700px]">
                        <div className="flex flex-col gap-4 border p-3">
                            <Label className="text-semibold">
                                Sản phẩm chính
                            </Label>
                            {combo.product_option && (
                                <div className="flex items-center">
                                    <Image
                                        src={combo.product_option.thumbnail}
                                        alt=""
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-4 border p-3">
                            <Label className="text-semibold">
                                Sản phẩm đi kèm
                            </Label>
                            <div className="flex flex-col gap-4">
                                {productCombos &&
                                    productCombos?.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4"
                                            >
                                                <Image
                                                    src={
                                                        item.product_option
                                                            .thumbnail
                                                    }
                                                    alt={
                                                        item.product_option.slug
                                                    }
                                                    width={100}
                                                    height={100}
                                                />
                                                <div>
                                                    <Label>Giảm giá</Label>
                                                    <div className="flex items-center gap-1">
                                                        <Input
                                                            className="w-[50%]"
                                                            type="number"
                                                            value={
                                                                item.discount
                                                            }
                                                            onChange={(e) =>
                                                                handleChangeDiscount(
                                                                    item.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        (<Percent />)
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant={'outline'}
                        className="w-auto md:w-[180px] h-[40px]"
                        onClick={() => setOpen(false)}
                    >
                        Hủy
                    </Button>
                    {loading ? (
                        <Button
                            disabled
                            className="w-auto md:w-[180px] h-[40px]"
                        >
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Button
                            variant={'default'}
                            className="w-auto md:w-[180px] h-[40px]"
                            onClick={handleSubmit}
                        >
                            Lưu
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
