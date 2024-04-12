import ProductList from '@/components/home/product-list';
import { Button } from '@/components/ui/button';
import { ProductType } from '@/lib/store/slices';
import React from 'react';

type Props = {
    title: string;
    products: ProductType[];
};

export default function ProductBox(props: Props) {
    const { title, products } = props;
    return (
        <div className="rounded-md shadow-md bg-white dark:bg-secondary mb-4">
            <p className="font-bold text-2xl mt-[5%] uppercase p-4 border-b border-border dark:border-foreground">
                {title}
            </p>
            <ProductList products={products} />

            <div className="flex justify-center py-4">
                <Button variant={'outline'}>Xem thêm</Button>
            </div>
        </div>
    );
}
