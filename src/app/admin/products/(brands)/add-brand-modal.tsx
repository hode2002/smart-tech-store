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
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
    handleAddBrand: (
        name: string,
        file: File,
        description?: string,
    ) => Promise<void>;
};
export function AddBrandModal(props: Props) {
    const { handleAddBrand } = props;

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File>();

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setName('');
        setDescription('');
        setFile(undefined);
    }, [open]);

    const handleSubmit = () => {
        handleAddBrand(name, file as File, description);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-start px-2 w-full">
                    Thêm thương hiệu
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo mới thương hiệu</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Tên
                        </Label>
                        <Input
                            id="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3 disabled"
                        />
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
                            {description}
                        </Textarea>
                    </div>
                    <div className="flex flex-col gap-4 ms-10">
                        <Input
                            id="logo"
                            type="file"
                            onChange={(e) => setFile(e.target?.files?.[0])}
                            className="hidden"
                            accept="image/*"
                        />
                        <Label htmlFor="logo" className="flex justify-center">
                            {file && (
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={name}
                                    width={100}
                                    height={50}
                                />
                            )}
                        </Label>
                        <Button variant={'outline'}>
                            <Label htmlFor="logo">Chọn logo</Label>
                        </Button>
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
