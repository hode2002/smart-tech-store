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
import { Textarea } from '@/components/ui/textarea';
import { Brand } from '@/lib/store/slices';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
    brand: Brand;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleEditBrand: (
        brand: Brand,
        description: string,
        file: File | undefined,
    ) => Promise<void>;
};
export function EditBrandModal(props: Props) {
    const { brand, open, setOpen, handleEditBrand } = props;

    useEffect(() => {
        setLogoUrl(brand.logo_url);
        setDescription(brand.description);
    }, [brand]);

    const [logoUrl, setLogoUrl] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | undefined>();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex justify-start px-2 w-full"
                >
                    Chỉnh sửa
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] md:min-w-max rounded-md">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin thương hiệu</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Tên
                        </Label>
                        <Input
                            id="name"
                            value={brand.name}
                            className="col-span-3 disabled"
                        />{' '}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Mô tả
                        </Label>
                        <Textarea
                            id="description"
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        >
                            {description ?? ''}
                        </Textarea>
                    </div>
                    <div className="flex flex-col gap-4 ms-10">
                        <Input
                            id="logo"
                            type="file"
                            onChange={(e) => setFile(e.target?.files?.[0])}
                            className="hidden"
                        />
                        <Label htmlFor="logo" className="flex justify-center">
                            {file ? (
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={brand.name}
                                    width={100}
                                    height={50}
                                />
                            ) : (
                                <Image
                                    src={logoUrl}
                                    alt={brand.name}
                                    width={100}
                                    height={50}
                                />
                            )}
                        </Label>
                        <Button variant={'outline'}>
                            <Label htmlFor="logo">Chọn logo khác</Label>
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant={'outline'} onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={() =>
                            handleEditBrand(brand, description, file)
                        }
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
