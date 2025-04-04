import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { PRODUCT_VARIANT_SELECT, ProductVariant } from '@/prisma/selectors';
import { IVariantQueryRepository } from '@v2/modules/product/interfaces';

@Injectable()
export class VariantQueryRepository implements IVariantQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<ProductVariant> {
        return this.prisma.productVariant.findUnique({
            where: { id },
            select: PRODUCT_VARIANT_SELECT,
        });
    }

    async findByProductId(productId: string): Promise<ProductVariant[]> {
        return this.prisma.productVariant.findMany({
            where: { product_id: productId },
            select: PRODUCT_VARIANT_SELECT,
        });
    }
}
