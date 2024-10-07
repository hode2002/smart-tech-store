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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
    NotificationType,
    UpdateNotificationBodyType,
} from '@/apiRequests/notification';
import adminApiRequest, {
    UploadMultipleFilesResponseType,
} from '@/apiRequests/admin';
import { useAppSelector } from '@/lib/store';
import Image from 'next/image';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Editor as TinyMCEEditor } from 'tinymce';
import CustomEditor from '@/components/custom-editor';

type Props = {
    notification: NotificationType;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleEditNotification: (
        notification: NotificationType,
        data: UpdateNotificationBodyType,
    ) => Promise<void>;
};
export function EditNotificationModal(props: Props) {
    const { notification, open, setOpen, handleEditNotification } = props;
    const token = useAppSelector((state) => state.auth.accessToken);

    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [title, setTitle] = useState<string>('');
    const [images, setImages] = useState<string>('');
    const [files, setFiles] = useState<FileList | undefined>();
    const [type, setType] = useState<
        'ORDER' | 'VOUCHER' | 'COMMENT' | 'COMMON'
    >('COMMON');
    const [link, setLink] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setTitle(notification.title);
        setImages(notification.images);
        setFiles(undefined);
        setType(notification.type);
        setLink(notification.link);
    }, [notification, open]);

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
                    return images.push(res.key);
                }
            });
        }

        const content = editorRef.current!.getContent();
        await handleEditNotification(notification, {
            title,
            type,
            content,
            images: JSON.stringify(images),
            link,
        });

        setLoading(false);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex justify-start px-2 w-full"
                >
                    Cập nhật
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] md:min-w-[80%] rounded-md">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Label htmlFor="title" className="w-[10%] text-right">
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
                        <div className="w-[90%] flex gap-2">
                            {files
                                ? Array.from(files).map((file, index) => (
                                      <Image
                                          key={index}
                                          alt="image"
                                          height={80}
                                          width={80}
                                          src={URL.createObjectURL(file)}
                                      />
                                  ))
                                : images &&
                                  (JSON.parse(images) as string[])?.map(
                                      (image, index) => (
                                          <Image
                                              key={index}
                                              alt="image"
                                              height={80}
                                              width={80}
                                              src={image}
                                          />
                                      ),
                                  )}
                        </div>
                        <Button variant={'outline'} className="w-[90%]">
                            <Label htmlFor="images">Chọn ảnh</Label>
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Label htmlFor="type" className="text-right w-[10%]">
                            Loại
                        </Label>
                        <Select
                            value={type}
                            onValueChange={(value) =>
                                setType(
                                    value as
                                        | 'ORDER'
                                        | 'COMMON'
                                        | 'VOUCHER'
                                        | 'COMMENT',
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
                        <Label htmlFor="link" className="w-[10%] text-right">
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
                                initialValue={notification.content}
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
