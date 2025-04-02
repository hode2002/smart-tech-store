import { Brand } from '@prisma/client';

import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';

export interface IBrandCommandService {
    create(createBrandDto: CreateBrandDto, file: Express.Multer.File): Promise<Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File): Promise<Brand>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<Brand>;
}
