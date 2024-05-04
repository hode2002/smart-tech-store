import ProductList from '@/components/home/product-list';
import { Button } from '@/components/ui/button';
import { ProductType } from '@/lib/store/slices';
import moment from 'moment';
import React from 'react';

type Props = {
    title: string;
    products: ProductType[];
    option?: 'today' | 'none';
};

export default function ProductBox(props: Props) {
    const { title, products, option = 'none' } = props;
    return (
        <div className="rounded-md shadow-md bg-white dark:bg-secondary mb-4">
            <p className="font-bold text-2xl mt-[5%] uppercase p-4 border-b border-border dark:border-foreground">
                {title}
            </p>

            {option === 'today' ? (
                <ProductList
                    products={products?.filter((product) =>
                        moment(product.created_at).isSame(
                            moment(new Date()),
                            'day',
                        ),
                    )}
                />
            ) : (
                <ProductList products={products} />
            )}

            <div className="flex justify-center py-4">
                <Button variant={'outline'}>Xem thêm</Button>
            </div>
        </div>
    );
}
