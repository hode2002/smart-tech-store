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
import { Category } from '@/lib/store/slices';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
    category: Category;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleEditCategory: (
        category: Category,
        description: string,
    ) => Promise<void>;
};
export function EditCategoryModal(props: Props) {
    const { category, open, setOpen, handleEditCategory } = props;

    useEffect(() => {
        setDescription(category.description);
    }, [category]);

    const [description, setDescription] = useState<string>('');

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
                            value={category.name}
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
                            {description ?? ''}
                        </Textarea>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant={'outline'} onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={() =>
                            handleEditCategory(category, description)
                        }
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
