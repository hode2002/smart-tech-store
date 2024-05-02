import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { ProductDetailType } from '@/schemaValidations/product.schema';
import moment from 'moment';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

type Props = {
    products: ProductDetailType[];
};

const ProductTable = (props: Props) => {
    const { products } = props;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Danh mục
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Thương hiệu
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Ngày tạo
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products &&
                    products?.map((product) => {
                        return (
                            <TableRow key={product.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt="Product image"
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={
                                            product?.product_options[0]
                                                ?.thumbnail ||
                                            'https://cdn.tgdd.vn/Products/Images/42/289705/iphone-14-pro-max-tim-thumb-600x600.jpg'
                                        }
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium capitalize">
                                    {product.name}
                                </TableCell>
                                <TableCell>
                                    {formatPrice(product.price)}
                                </TableCell>
                                <TableCell
                                    className={`capitalize ${product.category.is_deleted ? 'line-through' : ''}`}
                                >
                                    {product.category.name}
                                </TableCell>
                                <TableCell
                                    className={`capitalize ${product.brand.is_deleted ? 'line-through' : ''}`}
                                >
                                    {product.brand.name}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {moment(product.created_at).format(
                                        'DD-MM-YYYY HH:mm:ss',
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!product.brand.is_deleted &&
                                        !product.category.is_deleted && (
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
                                                    <Link
                                                        key={product.id}
                                                        href={
                                                            '/admin/products/edit/' +
                                                            product.id
                                                        }
                                                    >
                                                        <DropdownMenuItem>
                                                            Cập nhật
                                                        </DropdownMenuItem>
                                                    </Link>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
            </TableBody>
        </Table>
    );
};

export default ProductTable;
