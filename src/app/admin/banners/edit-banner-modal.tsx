import { BannersResponseType } from '@/apiRequests/admin';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
    banner: BannersResponseType;
    handleUpdateBanner: (
        banner: BannersResponseType,
        status: string,
        image: File,
        link: string,
        type: string,
    ) => Promise<void>;
};
export function EditBannerModal(props: Props) {
    const { banner, handleUpdateBanner } = props;

    const [type, setType] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [file, setFile] = useState<File>();

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setLink(banner.link);
        setType(banner.type);
        setStatus(banner.status);
        setImage(banner.image);
    }, [banner, open]);

    const handleSubmit = () => {
        handleUpdateBanner(banner, status, file as File, link, type);
        setOpen(false);
    };

    const selectTypeArr = ['slide', 'big', 'side'];
    const selectStatusArr = ['show', 'hide'];

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa banner</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Title</Label>
                        <Input
                            readOnly
                            value={banner.title}
                            className="col-span-3 disabled"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="link" className="text-right">
                            Link
                        </Label>
                        <Input
                            id="link"
                            autoComplete="off"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="col-span-3 disabled"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="w-[180px] capitalize">
                                <SelectValue placeholder={type} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Loại banner</SelectLabel>
                                    {selectTypeArr.map((item) => (
                                        <SelectItem
                                            key={item}
                                            value={item}
                                            className="capitalize"
                                        >
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px] capitalize">
                                <SelectValue placeholder={status} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Trạng thái</SelectLabel>
                                    {selectStatusArr.map((item) => (
                                        <SelectItem
                                            key={item}
                                            value={item}
                                            className="capitalize"
                                        >
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-4 ms-10">
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
                                    alt={banner.title}
                                    width={300}
                                    height={200}
                                />
                            ) : (
                                <Image
                                    src={image}
                                    alt={banner.title}
                                    width={300}
                                    height={200}
                                />
                            )}
                        </Label>
                        <Button variant={'outline'}>
                            <Label htmlFor="img_file">Chọn ảnh</Label>
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
