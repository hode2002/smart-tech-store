import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { useState } from 'react';
import { useAppSelector } from '@/lib/store';
import adminApiRequest from '@/apiRequests/admin';
import { toast } from '@/components/ui/use-toast';
import {
    ProductReview,
    ProductReviewResponseType,
} from '@/apiRequests/product';
import Image from 'next/image';
import { ReplyReviewModal } from '@/app/admin/dashboard/components/edit-review-modal';
import { Rating } from '@material-tailwind/react';

type Props = {
    reviews: ProductReview[];
    fetchReviews: () => Promise<void>;
};

const ProductReviewTable = (props: Props) => {
    const { reviews, fetchReviews } = props;

    const token = useAppSelector((state) => state.auth.accessToken);

    const [open, setOpen] = useState<boolean>(false);
    const handleReplyReview = async (reviewId: string, comment: string) => {
        setOpen(false);

        const response = (await adminApiRequest.createReplyReview(
            token,
            reviewId,
            comment,
        )) as ProductReviewResponseType;

        if (response?.statusCode === 201) {
            toast({
                title: 'Success',
                description: response.message,
            });
            await fetchReviews();
        }
    };
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[50px] sm:table-cell">
                        <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead className="hidden w-[50px] sm:table-cell">
                        <span className="sr-only">Product Image</span>
                    </TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Số sao</TableHead>
                    <TableHead className="hidden md:table-cell truncate">
                        Ngày tạo
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reviews &&
                    reviews?.map((review) => {
                        return (
                            <TableRow key={review.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt="Product image"
                                        className="aspect-square rounded-md object-cover"
                                        height="40"
                                        src={review.user.avatar}
                                        width="40"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {review.user.email}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {review.user?.name}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt="Product image"
                                        className="rounded-md object-cover"
                                        height="40"
                                        src={review.product_option.thumbnail}
                                        width="40"
                                    />
                                </TableCell>
                                <TableCell className="capitalize">
                                    {review.product_option.product.name +
                                        ' ' +
                                        review.product_option.sku
                                            .toLowerCase()
                                            .replaceAll('-', ' ')}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Rating
                                        value={Math.floor(review.star)}
                                        readonly
                                    />
                                </TableCell>
                                <TableCell>
                                    {moment(review.created_at).format(
                                        'DD-MM-YYYY',
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Toggle menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Thao tác
                                            </DropdownMenuLabel>
                                            <ReplyReviewModal
                                                review={review}
                                                open={open}
                                                setOpen={setOpen}
                                                handleReplyReview={
                                                    handleReplyReview
                                                }
                                            />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};

export default ProductReviewTable;
