import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateProductDto,
    CreateProductOptionDto,
    UpdateProductDto,
    UpdateProductOptionDto,
} from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { Request } from 'express';
import { generateSlug, pagination } from 'src/utils';

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
                            generateSlug(productDto.name) +
                            product_options[0].sku
                                .trim()
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
                const {
                    technical_specs,
                    product_option_value,
                    product_images,
                    ...other
                } = product_option;

                return this.prismaService.productOption.create({
                    data: {
                        ...other,
                        product_id: newProduct.id,
                        product_images: {
                            createMany: {
                                data: product_images,
                            },
                        },
                        technical_specs: {
                            create: technical_specs,
                        },
                        product_option_value: {
                            createMany: {
                                data: product_option_value,
                            },
                        },
                        slug:
                            generateSlug(newProduct.name) +
                            '-' +
                            generateSlug(other.sku),
                    },
                });
            },
        );

        return {
            ...newProduct,
            product_options: await Promise.all(productOptionPromises),
        };
    }

    async createProductOption(createProductOptionDto: CreateProductOptionDto) {
        const { product_id, product_options } = createProductOptionDto;

        const product = await this.findById(product_id);
        if (!product) {
            throw new NotFoundException('Product Does Not Exist');
        }

        const productOptionPromises = product_options.map(
            async (product_option) => {
                const {
                    technical_specs,
                    product_option_value,
                    product_images,
                    ...other
                } = product_option;

                return this.prismaService.productOption.create({
                    data: {
                        ...other,
                        product_id: product.id,
                        product_images: {
                            createMany: {
                                data: product_images,
                            },
                        },
                        technical_specs: {
                            create: technical_specs,
                        },
                        product_option_value: {
                            createMany: {
                                data: product_option_value,
                            },
                        },
                        slug:
                            generateSlug(product.name) +
                            '-' +
                            generateSlug(other.sku),
                    },
                });
            },
        );

        await Promise.all(productOptionPromises);

        return await this.findById(product_id);
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
                        sku: true,
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
                        technical_specs: true,
                        product_option_value: {
                            select: {
                                id: true,
                                value: true,
                                adjust_price: true,
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

    async findById(id: string) {
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
                        sku: true,
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
                        technical_specs: true,
                        product_option_value: {
                            select: {
                                id: true,
                                value: true,
                                adjust_price: true,
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

    async findByProductOptionId(id: string) {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.prismaService.productOption.findUnique({
            where: {
                id,
                is_deleted: false,
            },
            select: {
                id: true,
                sku: true,
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
                technical_specs: true,
                product_option_value: {
                    select: {
                        id: true,
                        value: true,
                        adjust_price: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product option not found');
        }

        return product;
    }

    async getByParameters(request: Request) {
        return await this.prismaService.product.findMany({
            where: {
                ...(request.query['cId'] && {
                    category_id: request.query['cId'].toString(),
                }),
                ...(request.query['bId'] && {
                    brand_id: request.query['bId'].toString(),
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
                            // {
                            //     options: {
                            //         some: {
                            //             name: 'RAM',
                            //             value: request.query['ram']
                            //                 .toString()
                            //                 ?.replaceAll('-', ' ')
                            //                 .toUpperCase(),
                            //         },
                            //     },
                            // },
                            // {
                            //     options: {
                            //         some: {
                            //             name: 'Dung lượng lưu trữ',
                            //             value: request.query['rom']
                            //                 .toString()
                            //                 ?.replaceAll('-', ' ')
                            //                 .toUpperCase(),
                            //         },
                            //     },
                            // },
                        ],
                    },
                    select: {
                        id: true,
                        sku: true,
                        thumbnail: true,
                        price_modifier: true,
                        stock: true,
                        discount: true,
                        is_sale: true,
                        slug: true,
                        label_image: true,
                        // options: {
                        //     select: {
                        //         id: true,
                        //         name: true,
                        //         value: true,
                        //         additional_cost: true,
                        //     },
                        // },
                    },
                },
            },
        });
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
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

        const productOptionsPromises = product_options.map(
            async (product_option) => {
                return this.updateProductOption(
                    product_option.id,
                    product_option,
                );
            },
        );

        await Promise.all(productOptionsPromises);

        return await this.findById(id);
    }

    async updateProductOption(
        productOptionId: string,
        updateProductOptionDto: UpdateProductOptionDto,
    ) {
        if (!productOptionId) {
            throw new BadRequestException('Missing product option id');
        }

        const { product_images, ...other } = updateProductOptionDto;

        const isExist = await this.prismaService.productOption.findUnique({
            where: {
                id: productOptionId,
            },
        });

        if (!isExist) {
            throw new NotFoundException(
                `Not found: product_options with id: ${productOptionId} not found`,
            );
        }

        return await this.prismaService.productOption.update({
            where: { id: productOptionId },
            data: {
                product_images: {
                    deleteMany: { product_option_id: productOptionId },
                    createMany: {
                        data: product_images,
                    },
                },
                ...other,
            },
            select: {
                id: true,
                sku: true,
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
                technical_specs: true,
                product_option_value: {
                    select: {
                        id: true,
                        value: true,
                        adjust_price: true,
                    },
                },
            },
        });
    }

    async restoreProductOption(product_option_id: string) {
        const isExist = await this.prismaService.productOption.findUnique({
            where: { id: product_option_id },
        });
        if (!isExist) {
            throw new NotFoundException('Product option not found');
        }

        const isDeleted = await this.prismaService.productOption.update({
            where: {
                id: product_option_id,
            },
            data: {
                is_deleted: false,
            },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }

    async removeProductOption(product_option_id: string) {
        const isExist = await this.findByProductOptionId(product_option_id);
        if (!isExist) {
            throw new NotFoundException('Product option not found');
        }

        const isDeleted = await this.prismaService.productOption.update({
            where: {
                id: product_option_id,
            },
            data: {
                is_deleted: true,
            },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }
}
