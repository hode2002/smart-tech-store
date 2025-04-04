import { ProductVariant } from '@/prisma/selectors';

export interface IVariantQueryRepository {
    findById(id: string): Promise<ProductVariant>;
    findByProductId(productId: string): Promise<ProductVariant[]>;
}
