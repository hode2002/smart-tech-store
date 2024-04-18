import { ProductType } from '@/lib/store/slices';
import ProductCard from '@/app/(user)/(category)/product-card';

type Props = {
    products: ProductType[];
};

export default function CategoryProductList(props: Props) {
    const { products } = props;
    return (
        <>
            {products?.length ? (
                <div className="my-5">
                    <div className="flex flex-wrap gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center mt-12">
                    <p className="font-bold text-lg">
                        Không tìm thấy sản phẩm phù hợp
                    </p>
                    <p>Vui lòng điều chỉnh lại bộ lọc</p>
                </div>
            )}
        </>
    );
}
