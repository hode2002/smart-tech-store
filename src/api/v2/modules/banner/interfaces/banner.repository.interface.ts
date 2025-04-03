import { Banner } from '@prisma/client';

import { Pagination } from '@/common/types';
import { BannerWhereInput, BannerCreateInput, BannerUpdateInput } from '@v2/modules/banner/types';

export interface IBannerQueryRepository {
    findBySlug(slug: string): Promise<Banner>;
    findById(id: string, where?: BannerWhereInput): Promise<Banner>;
    findAll(page: number, limit: number, where?: BannerWhereInput): Promise<Pagination<Banner>>;
}

export interface IBannerCommandRepository {
    create(data: BannerCreateInput): Promise<Banner>;
    update(id: string, data: BannerUpdateInput): Promise<Banner>;
    delete(id: string): Promise<boolean>;
}

export interface IBannerRepository extends IBannerQueryRepository, IBannerCommandRepository {}
