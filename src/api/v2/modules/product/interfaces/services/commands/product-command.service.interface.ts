import { ProductBasic, ProductWithVariant } from '@/prisma/selectors';
import { CreateProductDto, UpdateProductDto } from '@v2/modules/product/dtos';

export interface IProductCommandService {
    create(createProductDto: CreateProductDto): Promise<ProductWithVariant>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<ProductBasic>;
    softDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<boolean>;
}
