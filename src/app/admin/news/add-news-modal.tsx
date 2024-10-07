import CustomEditor from '@/components/custom-editor';
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
import { ReloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

type Props = {
    handleAddNews: (
        title: string,
        content: string,
        image: File,
    ) => Promise<void>;
};
export function AddNewsModal(props: Props) {
    const { handleAddNews } = props;

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [image, setImage] = useState<File>();

    useEffect(() => {
        setTitle('');
        setImage(undefined);
    }, [open]);

    const handleSubmit = () => {
        if (loading) return;
        setLoading(true);

        const content = editorRef.current!.getContent();
        handleAddNews(title, content, image as File);

        setLoading(false);
        setOpen(false);
    };

    const onOpenChange = () => {
        const content = editorRef.current?.getContent();
        if (title || content) {
            const isConfirm = window.confirm(
                'Đang soạn thảo nội dung, xác nhận thoát?',
            );
            if (!isConfirm) return;
        }
        setOpen(!open);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <div className="flex justify-start px-2 w-full">
                    Thêm tin tức
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:min-w-[1600px]">
                <DialogHeader>
                    <DialogTitle>Tạo tin tức</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <Label
                            htmlFor="title"
                            className="text-nowrap font-semibold"
                        >
                            Tiêu đề
                        </Label>
                        <Input
                            id="title"
                            autoComplete="off"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="disabled capitalize"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Input
                            id="img_file"
                            type="file"
                            onChange={(e) => setImage(e.target?.files?.[0])}
                            className="hidden"
                            accept="image/*"
                        />
                        <Label
                            htmlFor="img_file"
                            className="flex justify-center"
                        >
                            {image && (
                                <Image
                                    src={URL.createObjectURL(image)}
                                    alt={title}
                                    width={150}
                                    height={100}
                                />
                            )}
                        </Label>
                        <Button variant={'outline'}>
                            <Label htmlFor="img_file">Chọn ảnh</Label>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <CustomEditor
                            initialValue={''}
                            height={400}
                            onInit={(evt, editor) =>
                                (editorRef.current = editor)
                            }
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant={'outline'}
                        className="w-auto md:w-[180px] h-[40px]"
                        onClick={onOpenChange}
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
