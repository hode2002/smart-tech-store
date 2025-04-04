import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DiscountType } from '@prisma/client';

import { generateSlug } from '@/common/utils';
import { PrismaService } from '@/prisma/prisma.service';
import { ComboDetail } from '@/prisma/selectors';
import { CacheService } from '@v2/modules/cache/cache.service';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { CreateComboDto, UpdateComboDto } from '@v2/modules/product/dtos';
import {
    IComboCommandService,
    IComboCommandRepository,
    IComboQueryRepository,
} from '@v2/modules/product/interfaces';
import { ComboUpdateInput } from '@v2/modules/product/types';

@Injectable()
export class ComboCommandService implements IComboCommandService {
    constructor(
        @Inject(PRODUCT_TOKENS.REPOSITORIES.COMBO_COMMAND)
        private readonly commandRepository: IComboCommandRepository,
        @Inject(PRODUCT_TOKENS.REPOSITORIES.COMBO_QUERY)
        private readonly queryRepository: IComboQueryRepository,
        private readonly cacheService: CacheService,
        private readonly prisma: PrismaService,
    ) {}

    async create(createComboDto: CreateComboDto): Promise<ComboDetail> {
        const { mainVariantId, name } = createComboDto;

        const mainVariant = await this.queryRepository.findById(mainVariantId);
        if (!mainVariant) {
            throw new NotFoundException(`Main variant with ID ${mainVariantId} not found`);
        }

        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: createComboDto.items.map(i => i.variantId) } },
            select: { id: true, price: true, stock_quantity: true },
        });

        if (variants.length !== createComboDto.items.length) {
            throw new NotFoundException('Some variants not found');
        }

        const variantsWithStock = variants.filter(v => v.stock_quantity > 0);
        if (variantsWithStock.length !== createComboDto.items.length) {
            throw new NotFoundException('Some variants are out of stock');
        }

        let originalPrice = mainVariant.price;
        let totalPrice = mainVariant.price;

        const discountItemsData = createComboDto.items.map(item => {
            const variant = variants.find(v => v.id === item.variantId);
            const itemOriginalPrice = variant.price * item.quantity;
            let itemDiscount = 0;

            if (item.discountType === DiscountType.PERCENTAGE) {
                itemDiscount = itemOriginalPrice * (item.discount / 100);
            } else if (item.discountType === DiscountType.FIXED) {
                itemDiscount = item.discount;
            }

            originalPrice += itemOriginalPrice;
            totalPrice += itemOriginalPrice - itemDiscount;

            return {
                variant_id: item.variantId,
                quantity: item.quantity,
                discount: item.discount,
                discount_type: item.discountType,
            };
        });

        const slug = generateSlug(name);

        const [combo] = await Promise.all([
            this.commandRepository.create({
                name,
                slug,
                main_variant: { connect: { id: mainVariantId } },
                original_price: originalPrice,
                price: totalPrice,
                items: { create: discountItemsData },
            }),
            this.invalidateComboCache(),
        ]);

        return combo;
    }

    async update(id: string, updateComboDto: UpdateComboDto): Promise<ComboDetail> {
        const combo = await this.queryRepository.findById(id);

        if (!combo) {
            throw new NotFoundException(`Combo with ID ${id} not found`);
        }

        const { mainVariantId, name, description, startDate, endDate } = updateComboDto;

        const mainVariant = await this.queryRepository.findById(mainVariantId);
        if (!mainVariant) {
            throw new Error(`Main variant with ID ${mainVariantId} not found`);
        }

        const comboUpdateData: ComboUpdateInput = {};

        if (name) {
            comboUpdateData.name = name;
            comboUpdateData.slug = generateSlug(name);
        }

        if (description) {
            comboUpdateData.description = description;
        }

        if (startDate) {
            comboUpdateData.start_date = startDate;
        }

        if (endDate) {
            comboUpdateData.end_date = endDate;
        }

        if (mainVariantId) {
            comboUpdateData.main_variant = { connect: { id: mainVariantId } };
        }

        const [updatedCombos] = await Promise.all([
            this.commandRepository.update(id, comboUpdateData),
            this.invalidateComboCache(),
        ]);

        return updatedCombos;
    }

    async softDelete(id: string): Promise<boolean> {
        const combo = await this.queryRepository.findById(id);
        if (!combo) {
            throw new NotFoundException(`Combo with ID ${id} not found`);
        }

        return this.commandRepository.softDelete(id);
    }

    async restore(id: string): Promise<boolean> {
        const combo = await this.queryRepository.findById(id);
        if (!combo) {
            throw new NotFoundException(`Combo with ID ${id} not found`);
        }

        return this.commandRepository.restore(id);
    }

    private async invalidateComboCache(): Promise<void> {
        await Promise.all([
            this.cacheService.del('all_product_combos'),
            this.cacheService.deleteByPattern('product_combo_*'),
            this.cacheService.deleteByPattern('products_*'),
        ]);
    }
}
