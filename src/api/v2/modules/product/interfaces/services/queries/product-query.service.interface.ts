import { Request } from 'express';

import { Pagination } from '@/common/types';
import { ResponseProductDto } from '@v2/modules/product/dtos';

export interface IProductQueryService {
    findAll(request: Request): Promise<Pagination<ResponseProductDto>>;
    findAllManagement(request: Request): Promise<Pagination<ResponseProductDto>>;
    findById(id: string): Promise<ResponseProductDto>;
    findBySlug(slug: string): Promise<ResponseProductDto>;
    findByVariantId(variantId: string): Promise<ResponseProductDto>;
}
