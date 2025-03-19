import { Banner } from '@prisma/client';

import { Pagination } from '@/common/types';
import { BannerWhereInput, BannerWhereUniqueInput } from '@v2/modules/banner/types';
import { CreateBannerData, UpdateBannerData } from '@v2/modules/banner/types/banner-data.type';

export interface IBannerQueryRepository {
    findBySlug(slug: string): Promise<Banner>;
    findById(id: string, where?: BannerWhereUniqueInput): Promise<Banner>;
    findAll(page: number, limit: number, where?: BannerWhereInput): Promise<Pagination<Banner>>;
}

export interface IBannerCommandRepository {
    create(data: CreateBannerData): Promise<Banner>;
    update(id: string, data: UpdateBannerData): Promise<Banner>;
    delete(id: string): Promise<boolean>;
}

export interface IBannerRepository extends IBannerQueryRepository, IBannerCommandRepository {}
