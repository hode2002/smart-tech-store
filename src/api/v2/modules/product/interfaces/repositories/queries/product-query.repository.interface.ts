import { Request } from 'express';

import { Pagination } from '@/common/types';
import { ProductDetail } from '@/prisma/selectors';

export interface IProductQueryRepository {
    findAll(request: Request): Promise<Pagination<ProductDetail>>;
    findAllManagement(request: Request): Promise<Pagination<ProductDetail>>;
    findById(id: string): Promise<ProductDetail>;
    findBySlug(slug: string): Promise<ProductDetail>;
    findBySlugAndSku(slug: string, sku: string): Promise<ProductDetail>;
    findByVariantId(variantId: string): Promise<ProductDetail>;
}
