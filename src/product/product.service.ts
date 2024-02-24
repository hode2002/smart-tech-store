import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateProductDto,
    RemoveProductDto,
    RestoreProductDto,
    UpdateProductDto,
    UpdateProductOptionDto,
} from './dto';
import { PrismaService } from './../prisma/prisma.service';
import slugify from 'slugify';
import { Request } from 'express';
import { pagination } from 'src/utils';

@Injectable()
export class ProductService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        const { descriptions, product_options, ...productDto } =
            createProductDto;

        const isExist = await this.prismaService.product.findFirst({
            where: {
                name: productDto.name,
                product_options: {
                    none: {
                        slug:
                            this.generateSlug(productDto.name) +
                            product_options[0].SKU.trim()
                                .replaceAll(' ', '-')
                                .toLowerCase(),
                    },
                },
            },
        });

        if (isExist) {
            throw new ConflictException('Product Already Exists');
        }

        const newProduct = await this.prismaService.product.create({
            data: {
                ...productDto,
                descriptions: {
                    createMany: {
                        data: descriptions,
                    },
                },
            },
        });

        const productOptionPromises = product_options.map(
            async (product_option) => {
                const { options, product_images, ...other } = product_option;

                return this.prismaService.productOption.create({
                    data: {
                        product_id: newProduct.id,
                        options: {
                            createMany: {
                                data: options,
                            },
                        },
                        product_images: {
                            createMany: {
                                data: product_images,
                            },
                        },
                        slug:
                            this.generateSlug(newProduct.name) +
                            '-' +
                            other.SKU.trim().replaceAll(' ', '-').toLowerCase(),
                        ...other,
                    },
                });
            },
        );

        await Promise.all(productOptionPromises);

        return await this.findById(newProduct.id);
    }

    async findAll(request: Request) {
        const countRecords = await this.prismaService.product.count();
        const { limit, page, skip, totalPages } = pagination(
            request,
            countRecords,
        );

        if (page > totalPages) {
            return [];
        }

        const products = await this.prismaService.product.findMany({
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                name: true,
                price: true,
                promotions: true,
                warranties: true,
                label: true,
                descriptions: {
                    select: {
                        id: true,
                        content: true,
                    },
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                product_options: {
                    where: {
                        is_deleted: false,
                    },
                    select: {
                        id: true,
                        SKU: true,
                        thumbnail: true,
                        price_modifier: true,
                        discount: true,
                        is_sale: true,
                        stock: true,
                        label_image: true,
                        slug: true,
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        options: {
                            select: {
                                id: true,
                                name: true,
                                value: true,
                                additional_cost: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            totalPages,
            ...(page < totalPages && { nextPage: page + 1 }),
            ...(page > 1 && page <= totalPages && { previousPage: page - 1 }),
            products,
        };
    }

    async findById(id: number) {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.prismaService.product.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                price: true,
                promotions: true,
                warranties: true,
                label: true,
                descriptions: {
                    select: {
                        id: true,
                        content: true,
                    },
                },
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                product_options: {
                    where: {
                        is_deleted: false,
                    },
                    select: {
                        id: true,
                        SKU: true,
                        thumbnail: true,
                        price_modifier: true,
                        stock: true,
                        discount: true,
                        is_sale: true,
                        slug: true,
                        label_image: true,
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        options: {
                            select: {
                                id: true,
                                name: true,
                                value: true,
                                additional_cost: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async getByParameters(request: Request) {
        return await this.prismaService.product.findMany({
            where: {
                ...(request.query['cId'] && {
                    category_id: +request.query['cId'],
                }),
                ...(request.query['bId'] && {
                    brand_id: +request.query['bId'],
                }),
            },
            select: {
                id: true,
                name: true,
                price: true,
                promotions: true,
                warranties: true,
                label: true,
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                product_options: {
                    where: {
                        AND: [
                            {
                                is_deleted: false,
                            },
                            {
                                options: {
                                    some: {
                                        name: 'RAM',
                                        value: request.query['ram']
                                            .toString()
                                            ?.replaceAll('-', ' ')
                                            .toUpperCase(),
                                    },
                                },
                            },
                            {
                                options: {
                                    some: {
                                        name: 'Dung lượng lưu trữ',
                                        value: request.query['rom']
                                            .toString()
                                            ?.replaceAll('-', ' ')
                                            .toUpperCase(),
                                    },
                                },
                            },
                        ],
                    },
                    select: {
                        id: true,
                        SKU: true,
                        thumbnail: true,
                        price_modifier: true,
                        stock: true,
                        discount: true,
                        is_sale: true,
                        slug: true,
                        label_image: true,
                        options: {
                            select: {
                                id: true,
                                name: true,
                                value: true,
                                additional_cost: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        const { product_options, descriptions, ...other } = updateProductDto;

        await this.prismaService.product.update({
            where: { id },
            data: {
                descriptions: {
                    deleteMany: {
                        product_id: id,
                    },
                    createMany: {
                        data: descriptions,
                    },
                },
                ...other,
            },
        });

        for (const productOption of product_options) {
            await this.updateProductOption(productOption.id, productOption);

            /*
            const { options, product_images, ...other } = productOption;
            const id = other?.id;

            const isExist = await this.prismaService.productOption.findUnique({
                where: { id },
            });

            if (!isExist) {
                throw new NotFoundException(
                    `Not found: product_options with id: ${id} not found`,
                );
            }

            await this.prismaService.productOption.update({
                where: { id },
                data: {
                    product_images: {
                        deleteMany: { product_option_id: id },
                        createMany: {
                            data: product_images,
                        },
                    },
                    options: {
                        deleteMany: { product_option_id: id },
                        createMany: {
                            data: options,
                        },
                    },
                    ...other,
                },
            });

            */
        }

        return await this.findById(id);
    }

    async updateProductOption(
        productOptionId: number,
        updateProductOptionDto: UpdateProductOptionDto,
    ) {
        if (!productOptionId) {
            throw new BadRequestException('Missing product option id');
        }

        const { options, product_images, ...other } = updateProductOptionDto;
        const productId = other?.product_id;

        const isExist = await this.prismaService.productOption.findUnique({
            where: {
                id: productOptionId,
                product_id: productId,
            },
        });

        if (!isExist) {
            throw new NotFoundException(
                `Not found: product_options with id: ${productOptionId} not found`,
            );
        }

        return await this.prismaService.productOption.update({
            where: { id: productOptionId, product_id: productId },
            data: {
                product_images: {
                    deleteMany: { product_option_id: productOptionId },
                    createMany: {
                        data: product_images,
                    },
                },
                options: {
                    deleteMany: { product_option_id: productOptionId },
                    createMany: {
                        data: options,
                    },
                },
                ...other,
            },
            select: {
                id: true,
                SKU: true,
                thumbnail: true,
                price_modifier: true,
                stock: true,
                discount: true,
                is_sale: true,
                slug: true,
                label_image: true,
                product_images: {
                    select: {
                        id: true,
                        image_url: true,
                        image_alt_text: true,
                    },
                },
                options: {
                    select: {
                        id: true,
                        name: true,
                        value: true,
                        additional_cost: true,
                    },
                },
            },
        });
    }

    async restore(restoreProductDto: RestoreProductDto) {
        const { productId, variantId } = restoreProductDto;

        const isExist = await this.findById(productId);
        if (!isExist) {
            throw new NotFoundException('Product not found');
        }

        const isUpdated = await this.prismaService.productOption.update({
            where: {
                id: variantId,
                product_id: productId,
            },
            data: {
                is_deleted: false,
            },
        });

        return {
            is_success: isUpdated ? true : false,
        };
    }

    async remove(removeProductDto: RemoveProductDto) {
        const { productId, variantId } = removeProductDto;

        const isExist = await this.findById(productId);
        if (!isExist) {
            throw new NotFoundException('Product not found');
        }

        const isDeleted = await this.prismaService.productOption.update({
            where: {
                id: variantId,
                product_id: productId,
            },
            data: {
                is_deleted: true,
            },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }

    generateSlug(text: string) {
        return slugify(text, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true,
        });
    }
}
