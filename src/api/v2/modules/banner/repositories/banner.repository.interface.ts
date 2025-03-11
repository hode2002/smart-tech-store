import { Prisma } from '@prisma/client';

import { CreateBannerDto, UpdateBannerDto } from '@/api/v2/modules/banner/dto';
import { Pagination } from '@/common/types';
import { BannerBasic, BannerFull } from '@/prisma/selectors';

export interface IBannerRepository {
    findBySlug(slug: string): Promise<BannerBasic | null>;
    findById(id: string, filter?: Prisma.BannerWhereUniqueInput): Promise<BannerFull | null>;
    findBanners(
        where: Prisma.BannerWhereInput,
        page: number,
        limit: number,
    ): Promise<Pagination<BannerBasic>>;
    create(data: CreateBannerDto, image: string, slug: string): Promise<BannerBasic>;
    update(id: string, data: UpdateBannerDto, image?: string): Promise<BannerBasic>;
    delete(id: string): Promise<boolean>;
}
