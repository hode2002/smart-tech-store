import { NewsResponseType } from '@/apiRequests/admin';
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
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

type Props = {
    news: NewsResponseType;
    handleUpdateNews: (
        news: NewsResponseType,
        content?: string,
        image?: File,
    ) => Promise<void>;
};
export function EditNewsModal(props: Props) {
    const { news, handleUpdateNews } = props;

    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [file, setFile] = useState<File>();
    const [image, setImage] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setImage(news.image);
    }, [news, open]);

    const handleSubmit = () => {
        const content = editorRef.current!.getContent();
        handleUpdateNews(news, content, file as File);
        setOpen(false);
    };

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
            <DialogContent className="sm:max-w-[425px] md:min-w-[1600px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa tin tức</DialogTitle>
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
                            readOnly
                            value={news.title}
                            className="disabled"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Input
                            id="img_file"
                            type="file"
                            onChange={(e) => setFile(e.target?.files?.[0])}
                            className="hidden"
                            accept="image/*"
                        />
                        <Label
                            htmlFor="img_file"
                            className="flex justify-center"
                        >
                            {file ? (
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={news.title}
                                    width={300}
                                    height={200}
                                />
                            ) : (
                                <Image
                                    src={image}
                                    alt={news.title}
                                    width={300}
                                    height={200}
                                />
                            )}
                        </Label>
                        <Button variant={'outline'}>
                            <Label htmlFor="img_file">Chọn ảnh</Label>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <CustomEditor
                            initialValue={news.content}
                            height={400}
                            onInit={(evt, editor) =>
                                (editorRef.current = editor)
                            }
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
