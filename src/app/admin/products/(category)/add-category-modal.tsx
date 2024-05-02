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
import { useEffect, useState } from 'react';

type Props = {
    handleAddCategory: (name: string, description?: string) => Promise<void>;
};
export function AddCategoryModal(props: Props) {
    const { handleAddCategory } = props;

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setName('');
        setDescription('');
    }, [open]);

    const handleSubmit = async () => {
        await handleAddCategory(name, description);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-start px-2 w-full">
                    Thêm danh mục
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo mới danh mục</DialogTitle>
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
