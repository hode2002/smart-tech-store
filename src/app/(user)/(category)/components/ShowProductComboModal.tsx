import { ComboItem } from '@/app/(user)/(category)/components/ProductComboItem';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

export function ShowProductComboModal({
    selectedProduct,
    data,
    handleProductChange,
}: {
    selectedProduct: ComboItem;
    data: ComboItem[];
    handleProductChange: (productSelected: ComboItem) => void;
}) {
    const [open, setOpen] = useState<boolean>(false);

    const handleSelectProduct = (item: ComboItem) => {
        handleProductChange(item);
        setOpen(!open);
    };

    return (
        data?.length > 1 && (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={'link'} className="text-[#2a83e9] px-0">
                        Chọn sản phẩm khác
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:min-w-[850px]">
                    <ScrollArea className="p-3 h-[700px]">
                        <DialogHeader>
                            <DialogTitle className="text-center">
                                Chọn mua sản phẩm khác
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-8 py-4 flex-wrap">
                            {data.map((item, index) => (
                                <div
                                    key={index}
                                    className="max-w-[200px] border p-2 flex flex-col justify-center items-center gap-2"
                                >
                                    <Image
                                        key={index}
                                        alt="Review image"
                                        className="object-contain rounded-xl"
                                        width={150}
                                        height={150}
                                        src={item.product_option.thumbnail}
                                    />
                                    <p className="">
                                        {item.product_option.product.name}{' '}
                                        {item.product_option.sku.replaceAll(
                                            '-',
                                            ' ',
                                        )}
                                    </p>
                                    <div className="flex flex-col gap-2 items-center">
                                        <p className="text-[#E83A45] font-semibold">
                                            {formatPrice(
                                                item.product_option.product
                                                    .price +
                                                    item.product_option
                                                        .price_modifier -
                                                    ((item.product_option
                                                        .product.price +
                                                        item.product_option
                                                            .price_modifier) *
                                                        item.discount) /
                                                        100,
                                            )}
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="line-through opacity-90">
                                                {formatPrice(
                                                    item.product_option.product
                                                        .price +
                                                        item.product_option
                                                            .price_modifier,
                                                )}
                                            </span>
                                            <span>-{item.discount}%</span>
                                        </p>
                                    </div>
                                    {selectedProduct.product_option.slug ===
                                    item.product_option.slug ? (
                                        <Button disabled>Đã chọn</Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                handleSelectProduct(item)
                                            }
                                        >
                                            Chọn mua
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        )
    );
}
