import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { ProductOptionType } from '@/schemaValidations/product.schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { ProductDetailType } from '@/schemaValidations/product.schema';
import SearchProduct from '@/app/admin/products/(combo)/search-product';
import { Percent, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Props = {
    handleAddCombo: (
        mainProductId: string,
        productCombos: { productComboId: string; discount: number }[],
    ) => Promise<boolean>;
    products: ProductDetailType[];
};
export function AddComboModal(props: Props) {
    const { handleAddCombo } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const [mainProduct, setMainProduct] = useState<
        ProductOptionType | undefined
    >();
    const [productCombos, setProductCombos] = useState<ProductOptionType[]>([]);

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setMainProduct(undefined);
        setProductCombos([]);
    }, [open]);

    const handleSubmit = async () => {
        if (!mainProduct?.id || loading) return;
        setLoading(true);
        const isSuccess = await handleAddCombo(
            mainProduct.id,
            productCombos.map((i) => ({
                productComboId: i.id,
                discount: i.discount,
            })),
        );
        setLoading(false);
        if (isSuccess) {
            setOpen(false);
        }
    };

    const handleDeleteProductCombo = (id: string) => {
        setProductCombos((prev) => prev.filter((c) => c.id !== id));
    };

    const handleChangeDiscount = (id: string, newDiscount: string) => {
        setProductCombos((prev) =>
            prev.map((el) => {
                if (el.id === id) {
                    return {
                        ...el,
                        discount: +newDiscount,
                    };
                }
                return el;
            }),
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-start px-2 w-full">Thêm combo</div>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] md:min-w-[50%] rounded-md">
                <DialogHeader>
                    <DialogTitle>Tạo combo sản phẩm</DialogTitle>
                </DialogHeader>
                <ScrollArea>
                    <div className="flex flex-col gap-4 py-4 h-[700px]">
                        <div className="flex flex-col gap-4 border p-3">
                            <Label className="text-semibold">
                                Sản phẩm chính
                            </Label>
                            <SearchProduct setItems={setMainProduct} />
                            {mainProduct && (
                                <div className="flex items-center">
                                    <Image
                                        src={mainProduct.thumbnail}
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
                            <SearchProduct
                                setItems={setProductCombos}
                                mainProductId={mainProduct?.id}
                                disabled={!mainProduct?.id.length}
                            />
                            <div className="flex flex-col gap-4">
                                {productCombos &&
                                    productCombos?.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4"
                                            >
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.slug}
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
                                                <Trash
                                                    className="ml-auto cursor-pointer hover:text-red-500"
                                                    onClick={() =>
                                                        handleDeleteProductCombo(
                                                            item.id,
                                                        )
                                                    }
                                                />
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
