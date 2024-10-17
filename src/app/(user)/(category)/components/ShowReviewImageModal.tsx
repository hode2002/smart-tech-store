import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rating } from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';

export function ShowReviewImageModal({
    getReviewImages,
    url,
}: {
    getReviewImages: () => {
        url: string;
        star: number;
        type: 'image' | 'video';
    }[];
    url: string;
}) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="bg-[rgba(0,0,0,.8)] relative rounded-xl cursor-pointer">
                    {url.includes('/image') ? (
                        <Image
                            alt="Review image"
                            className="object-contain opacity-25"
                            width={232}
                            height={232}
                            src={url}
                        />
                    ) : (
                        <video
                            className="object-contain rounded-xl opacity-25"
                            width={232}
                            height={232}
                            src={url}
                        />
                    )}
                    <p className="text-sm text-white text-wrap absolute top-0 right-0 h-full w-full flex justify-center items-center">
                        <span className="text-center">
                            Xem {getReviewImages().length - 5} ảnh từ khách hàng
                        </span>
                    </p>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:min-w-[850px]">
                <ScrollArea className="p-3 h-[700px]">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            {getReviewImages().length} ảnh từ khách hàng
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-8 py-4 flex-wrap">
                        {getReviewImages().map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-center items-center gap-2"
                            >
                                {item.type === 'image' ? (
                                    <Image
                                        key={index}
                                        alt="Review image"
                                        className="object-contain rounded-xl"
                                        width={232}
                                        height={232}
                                        src={item.url}
                                    />
                                ) : (
                                    <video
                                        key={index}
                                        controls
                                        className="object-contain rounded-xl"
                                        width={232}
                                        height={232}
                                        src={item.url}
                                    />
                                )}

                                <Rating
                                    value={Math.floor(item.star)}
                                    readonly
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
