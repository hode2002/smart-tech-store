import { Pagination } from '@/common/types';
import { BrandBasic, BrandFull } from '@/prisma/selectors';
import { BrandWhereInput } from '@v2/modules/brand/types';

export interface IBrandQueryService {
    findAll(page?: number, limit?: number): Promise<Pagination<BrandBasic | BrandFull>>;
    adminFindAll(page?: number, limit?: number): Promise<Pagination<BrandBasic | BrandFull>>;
    findBySlug(slug: string, passthrough?: boolean): Promise<BrandBasic | BrandFull>;
    findById(
        id: string,
        where?: BrandWhereInput,
        passthrough?: boolean,
    ): Promise<BrandBasic | BrandFull>;
    findByCategory(
        slug: string,
        page?: number,
        limit?: number,
    ): Promise<Pagination<BrandBasic | BrandFull>>;
}
