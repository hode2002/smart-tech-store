import HomeProductCard from './home-product-card';
import { ProductType } from '@/lib/store/slices';
import ProductSkeletonCard from '@/components/home/product-skeleton-card';

type Props = {
    products: ProductType[];
};

export default function ProductList(props: Props) {
    const { products } = props;
    return (
        <>
            {products?.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-8">
                    {products.map((product) => (
                        <HomeProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center flex-wrap">
                    <ProductSkeletonCard />
                    <ProductSkeletonCard />
                    <ProductSkeletonCard />
                    <ProductSkeletonCard />
                </div>
            )}
        </>
    );
}
