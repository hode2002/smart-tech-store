import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateProductDto,
    RemoveProductDto,
    RestoreProductDto,
    UpdateProductDto,
} from './dto';
import { PrismaService } from './../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class ProductService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        const { descriptions, product_options, ...productDto } =
            createProductDto;

        const newProduct = await this.prismaService.product.create({
            data: {
                name: productDto.name,
                brand_id: productDto.brand_id,
                category_id: productDto.category_id,
                price: productDto.price,
                descriptions: {
                    createMany: {
                        data: descriptions,
                    },
                },
            },
        });

        const data = product_options.map((item) => {
            const slug =
                this.generateSlug(newProduct.name) +
                '-' +
                item.SKU.trim().replaceAll(' ', '-').toLowerCase();
            return {
                ...item,
                slug,
            };
        });

        for (const productOption of data) {
            const { options, product_images, ...other } = productOption;

            await this.prismaService.productOption.create({
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
                    ...other,
                },
            });
        }

        return await this.prismaService.product.findUnique({
            where: {
                id: newProduct.id,
            },
            include: {
                product_options: {
                    select: {
                        id: true,
                        SKU: true,
                        thumbnail: true,
                        price_modifier: true,
                        stock: true,
                        discount: true,
                        is_sale: true,
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
    }

    async findAll() {
        return await this.prismaService.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                descriptions: {
                    select: {
                        id: true,
                        content: true,
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
    }

    async findById(id: number) {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.prismaService.product.findUnique({
            where: {
                id,
            },
            include: {
                descriptions: {
                    select: {
                        id: true,
                        content: true,
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
            const { options, product_images, ...other } = productOption;
            const { id } = other;

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
                },
            });
        }

        return await this.findById(id);
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
