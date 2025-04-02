import { Brand } from '@prisma/client';

import { Pagination } from '@/common/types';
import { BrandBasic, BrandFull } from '@/prisma/selectors';
import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import { BrandWhereInput } from '@v2/modules/brand/types';

export interface IBrandService {
    create(createBrandDto: CreateBrandDto, file: Express.Multer.File): Promise<Brand>;
    findAll(page?: number, limit?: number): Promise<Pagination<BrandBasic | BrandFull>>;
    adminFindAll(page?: number, limit?: number): Promise<Pagination<BrandBasic | BrandFull>>;
    findBySlug(slug: string): Promise<BrandBasic | BrandFull>;
    findById(id: string, where?: BrandWhereInput): Promise<BrandBasic | BrandFull>;
    findByCategory(
        slug: string,
        page?: number,
        limit?: number,
    ): Promise<Pagination<BrandBasic | BrandFull>>;
    update(id: string, updateBrandDto: UpdateBrandDto, file: Express.Multer.File): Promise<Brand>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<Brand>;
}
