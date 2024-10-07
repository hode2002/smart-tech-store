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
import { useEffect, useRef, useState } from 'react';
import { CreateNotificationBodyType } from '@/apiRequests/notification';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import adminApiRequest, {
    UploadMultipleFilesResponseType,
} from '@/apiRequests/admin';
import { useAppSelector } from '@/lib/store';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Editor as TinyMCEEditor } from 'tinymce';
import CustomEditor from '@/components/custom-editor';

type Props = {
    handleAddNotification: (data: CreateNotificationBodyType) => Promise<void>;
};
export function AddNotificationModal(props: Props) {
    const { handleAddNotification } = props;
    const token = useAppSelector((state) => state.auth.accessToken);

    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [title, setTitle] = useState<string>('');
    const [files, setFiles] = useState<FileList | undefined>();
    const [type, setType] = useState<
        'ORDER' | 'VOUCHER' | 'COMMENT' | 'COMMON'
    >('COMMON');
    const [link, setLink] = useState<string>('');

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setTitle('');
        setFiles(undefined);
        setType('COMMON');
        setLink('#');
    }, [open]);

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);

        const images: string[] = [];
        if (files) {
            const response = (await adminApiRequest.uploadMultipleFiles(
                token,
                files,
                '/Notifications',
            )) as UploadMultipleFilesResponseType;
            response?.data?.map((res) => {
                if (res?.is_success) {
                    images.push(res.key);
                }
            });
        }

        const content = editorRef.current!.getContent();
        await handleAddNotification({
            type,
            title,
            content,
            images: JSON.stringify(images),
            link,
        });

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
                    Tạo thông báo
                </div>
            </DialogTrigger>
            <ScrollArea className="h-full">
                <DialogContent className="max-w-[400px] md:min-w-[80%] rounded-md">
                    <DialogHeader>
                        <DialogTitle>Tạo mới thông báo</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <Label
                                htmlFor="title"
                                className="w-[10%] text-right"
                            >
                                Tiêu đề
                            </Label>
                            <Input
                                id="title"
                                autoComplete="off"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <Input
                                id="images"
                                type="file"
                                onChange={(e) =>
                                    setFiles(e.target?.files as FileList)
                                }
                                className="hidden"
                                multiple
                                accept="image/*"
                            />
                            {files && (
                                <div className="w-[90%] flex gap-2">
                                    {Array.from(files).map((file, index) => (
                                        <Image
                                            key={index}
                                            alt="image"
                                            height={80}
                                            width={80}
                                            src={URL.createObjectURL(file)}
                                        />
                                    ))}
                                </div>
                            )}
                            <Button variant={'outline'} className="w-[90%]">
                                <Label htmlFor="images">Chọn ảnh</Label>
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label
                                htmlFor="type"
                                className="text-right w-[10%]"
                            >
                                Loại
                            </Label>
                            <Select
                                value={type}
                                onValueChange={(value) =>
                                    setType(
                                        value as
                                            | 'ORDER'
                                            | 'VOUCHER'
                                            | 'COMMENT'
                                            | 'COMMON',
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder="Loại"
                                        className="w-[10%]"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="COMMON">
                                            COMMON
                                        </SelectItem>
                                        <SelectItem value="VOUCHER">
                                            VOUCHER
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label
                                htmlFor="link"
                                className="w-[10%] text-right"
                            >
                                Link
                            </Label>
                            <Input
                                id="link"
                                autoComplete="off"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Label htmlFor="type" className="text-right w-[8%]">
                                Nội dung
                            </Label>
                            <div className="w-[90%]">
                                <CustomEditor
                                    initialValue={''}
                                    height={400}
                                    onInit={(evt, editor) =>
                                        (editorRef.current = editor)
                                    }
                                />
                            </div>
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
            </ScrollArea>
        </Dialog>
    );
}
