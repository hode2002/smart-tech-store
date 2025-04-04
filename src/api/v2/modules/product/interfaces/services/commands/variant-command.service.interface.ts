import { ProductVariant } from '@/prisma/selectors';
import { CreateVariantDto, UpdateVariantDto } from '@v2/modules/product/dtos';

export interface IVariantCommandService {
    create(productId: string, createVariantDto: CreateVariantDto): Promise<ProductVariant>;
    update(variantId: string, updateVariantDto: UpdateVariantDto): Promise<ProductVariant>;
    softDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<boolean>;
}
