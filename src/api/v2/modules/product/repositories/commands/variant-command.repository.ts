import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { PRODUCT_BASIC_SELECT, PRODUCT_VARIANT_SELECT, ProductVariant } from '@/prisma/selectors';
import { CreateVariantDto, UpdateVariantDto } from '@v2/modules/product/dtos';
import { IVariantCommandRepository } from '@v2/modules/product/interfaces';

@Injectable()
export class VariantCommandRepository implements IVariantCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(productId: string, createVariantDto: CreateVariantDto): Promise<ProductVariant> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: PRODUCT_BASIC_SELECT,
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const {
            images: newImages,
            attributes: newAttributes,
            technical_specs: newTechnicalSpecs,
            warranties: newWarranties,
            additional_specs: newAdditionalSpecs,
            ...variantDto
        } = createVariantDto;

        const images = {
            createMany: {
                data: newImages,
            },
        };

        const attributes = {
            createMany: {
                data: newAttributes,
            },
        };

        const technical_specs = {
            create: {
                specs: {
                    createMany: {
                        data: newTechnicalSpecs.items,
                    },
                },
            },
        };

        const warranties = {
            createMany: {
                data: newWarranties,
            },
        };

        const additional_specs = {
            createMany: {
                data: newAdditionalSpecs,
            },
        };

        const createdVariant = await this.prisma.productVariant.create({
            data: {
                product_id: product.id,
                ...variantDto,
                images,
                attributes,
                technical_specs,
                warranties,
                additional_specs,
            },
            select: PRODUCT_VARIANT_SELECT,
        });

        await Promise.all([
            this.prisma.variantAttribute.createMany({
                data: createVariantDto.attributes.map(attr => ({
                    variant_id: createdVariant.id,
                    attribute_id: attr.attribute_id,
                    value: attr.value,
                })),
            }),
            this.prisma.inventory.create({
                data: {
                    variant_id: createdVariant.id,
                    quantity_change: createdVariant.stock_quantity,
                    reason: 'INITIAL',
                },
            }),
        ]);

        return createdVariant;
    }

    async update(variantId: string, updateVariantDto: UpdateVariantDto): Promise<ProductVariant> {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
            select: PRODUCT_VARIANT_SELECT,
        });

        if (!variant) {
            throw new NotFoundException(`Variant with ID ${variantId} not found`);
        }

        const {
            images: newImages,
            attributes: newAttributes,
            technical_specs: newTechnicalSpecs,
            warranties: newWarranties,
            additional_specs: newAdditionalSpecs,
            ...variantData
        } = updateVariantDto;

        let images = {};
        if (newImages) {
            images = {
                deleteMany: {},
                createMany: {
                    data: newImages,
                },
            };
        } else {
            images = variant.images;
        }

        let attributes = {};
        if (newAttributes) {
            attributes = {
                createMany: {
                    data: newAttributes,
                },
            };
        } else {
            attributes = variant.attributes;
        }

        let technical_specs = {};
        if (newTechnicalSpecs) {
            technical_specs = {
                create: {
                    specs: {
                        createMany: {
                            data: newTechnicalSpecs,
                        },
                    },
                },
            };
        } else {
            technical_specs = variant.technical_specs;
        }

        let warranties = {};
        if (newWarranties) {
            warranties = {
                createMany: {
                    data: newWarranties,
                },
            };
        } else {
            warranties = variant.warranties;
        }

        let additional_specs = {};
        if (newAdditionalSpecs) {
            additional_specs = {
                createMany: {
                    data: newAdditionalSpecs,
                },
            };
        } else {
            additional_specs = variant.additional_specs;
        }

        return this.prisma.productVariant.update({
            where: { id: variantId },
            data: {
                ...variantData,
                images,
                attributes,
                technical_specs,
                warranties,
                additional_specs,
            },
            select: PRODUCT_VARIANT_SELECT,
        });
    }

    async softDelete(id: string): Promise<boolean> {
        return this.updateDeletedStatus(id, true);
    }

    async restore(id: string): Promise<boolean> {
        return this.updateDeletedStatus(id, false);
    }

    private async updateDeletedStatus(id: string, isDeleted: boolean): Promise<boolean> {
        const result = await this.prisma.productVariant.update({
            where: { id },
            data: { deleted_at: isDeleted ? new Date() : null },
            select: { id: true },
        });

        return result !== null;
    }
}
