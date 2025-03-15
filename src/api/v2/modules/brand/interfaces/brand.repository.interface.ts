import { Brand } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import { BrandWhereInput } from '@v2/modules/brand/types';

export interface IBrandQueryRepository {
    findById(id: string, where?: BrandWhereInput): Promise<Brand>;
    findBySlug(slug: string, where?: BrandWhereInput): Promise<Brand>;
    findAll(page: number, limit: number, where?: BrandWhereInput): Promise<Pagination<Brand>>;
}

export interface IBrandCommandRepository {
    create(data: CreateBrandDto & { logo_url: string; slug: string }): Promise<Brand>;
    update(id: string, data: UpdateBrandDto & { logo_url?: string }): Promise<Brand>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
}

export interface IBrandRepository extends IBrandQueryRepository, IBrandCommandRepository {}
