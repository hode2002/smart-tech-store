import { ProductReview } from '@/apiRequests/product';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PencilLine } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
    review: ProductReview;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleReplyReview: (reviewId: string, comment: string) => Promise<void>;
};
export function ReplyReviewModal(props: Props) {
    const { review, open, setOpen, handleReplyReview } = props;

    useEffect(() => {
        setComment(
            review.children.find((child) => child.user.role === 'ADMIN')
                ?.comment ?? '',
        );
    }, [review, open]);

    const [comment, setComment] = useState<string>('');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex justify-start px-2 w-full"
                >
                    Phản hồi
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] min-w-[825px]">
                <DialogHeader>
                    <DialogTitle>Phản hồi đánh giá của khách hàng</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Tên khách hàng</Label>
                        <Input
                            readOnly
                            value={review.user.name}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Tên sản phẩm
                        </Label>
                        <Input
                            readOnly
                            value={
                                review.product_option.product.name +
                                ' ' +
                                review.product_option.sku
                                    .toLowerCase()
                                    .replaceAll('-', ' ')
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right"></Label>
                        <Image
                            className="flex justify-center"
                            src={review.product_option.thumbnail}
                            alt={review.product_option.sku}
                            width={100}
                            height={50}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Đánh giá của khách hàng
                        </Label>
                        <Textarea
                            readOnly
                            name="user-comment"
                            value={review.comment}
                            className="col-span-3"
                        />
                    </div>
                    <DropdownMenuSeparator className="border-b" />
                    <div className="flex flex-col items-center gap-4">
                        <Label className="font-bold flex items-center gap-2">
                            Viết phản hồi <PencilLine />
                        </Label>
                        <Textarea
                            onChange={(e) => setComment(e.target.value)}
                            className="col-span-12"
                            autoFocus={true}
                            value={comment}
                        />
                        <div className="w-full justify-end flex gap-4">
                            <Button
                                variant={'outline'}
                                onClick={() => setOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={() =>
                                    handleReplyReview(review.id, comment)
                                }
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
