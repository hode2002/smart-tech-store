import { ProductVariant } from '@/prisma/selectors';

export interface IVariantQueryService {
    findByProductId(productId: string): Promise<ProductVariant[]>;
    findById(id: string): Promise<ProductVariant>;
}
