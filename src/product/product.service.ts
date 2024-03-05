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
import { generateSlug, pagination, translateSpecs } from 'src/utils';
import {
    ProductDetailDB,
    ProductDetailResponse,
    ProductParameterDB,
    ProductParameterResponse,
} from './types';

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
                        logo_url: true,
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
                    where: { is_deleted: false },
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
                        technical_specs: {
                            select: {
                                screen: true,
                                screen_size: true,
                                os: true,
                                front_camera: true,
                                rear_camera: true,
                                chip: true,
                                ram: true,
                                rom: true,
                                sim: true,
                                battery: true,
                                weight: true,
                                connection: true,
                            },
                        },
                        product_option_value: {
                            select: {
                                option: {
                                    select: { name: true },
                                },
                                value: true,
                                adjust_price: true,
                            },
                        },
                        reviews: {
                            where: { parent_id: null },
                            select: {
                                id: true,
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        name: true,
                                        avatar: true,
                                    },
                                },
                                star: true,
                                comment: true,
                                _count: true,
                                children: {
                                    select: {
                                        user: {
                                            select: {
                                                id: true,
                                                email: true,
                                                name: true,
                                                avatar: true,
                                            },
                                        },
                                        comment: true,
                                        created_at: true,
                                    },
                                },
                                created_at: true,
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
            products: products.map((product) =>
                this.convertProductResponse(product),
            ),
        };
    }

    async findById(id: string): Promise<ProductDetailResponse> {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.prismaService.product.findFirst({
            where: { id },
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
                        logo_url: true,
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
                    where: { is_deleted: false },
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
                        technical_specs: {
                            select: {
                                screen: true,
                                screen_size: true,
                                os: true,
                                front_camera: true,
                                rear_camera: true,
                                chip: true,
                                ram: true,
                                rom: true,
                                sim: true,
                                battery: true,
                                weight: true,
                                connection: true,
                            },
                        },
                        product_option_value: {
                            select: {
                                option: {
                                    select: {
                                        name: true,
                                    },
                                },
                                value: true,
                                adjust_price: true,
                            },
                        },
                        reviews: {
                            where: {
                                parent_id: null,
                            },
                            select: {
                                id: true,
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        name: true,
                                        avatar: true,
                                    },
                                },
                                star: true,
                                comment: true,
                                _count: true,
                                children: {
                                    select: {
                                        user: {
                                            select: {
                                                id: true,
                                                email: true,
                                                name: true,
                                                avatar: true,
                                            },
                                        },
                                        comment: true,
                                        created_at: true,
                                    },
                                },
                                created_at: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.convertProductResponse(product);
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

    async getByParameters(
        request: Request,
    ): Promise<ProductParameterResponse[]> {
        const products = await this.prismaService.technicalSpecs.findMany({
            where: {
                product_option: {
                    product: {
                        AND: [
                            {
                                ...(request.query['ca'] && {
                                    category_id: <string>request.query['ca'],
                                }),
                            },
                            {
                                ...(request.query['b'] && {
                                    brand_id: <string>request.query['b'],
                                }),
                            },
                            {
                                price: {
                                    ...(request.query['pf'] && {
                                        gte:
                                            Number(request.query['pf']) *
                                            1000000,
                                    }),
                                    ...(request.query['pt'] && {
                                        lte:
                                            Number(request.query['pt']) *
                                            1000000,
                                    }),
                                },
                            },
                        ],
                    },
                },
                AND: [
                    {
                        ...(request.query['ro'] && {
                            rom: {
                                equals: <string>request.query['ro'],
                            },
                        }),
                    },
                    {
                        ...(request.query['co'] && {
                            connection: {
                                contains: <string>request.query['co'],
                            },
                        }),
                    },
                    {
                        ...(request.query['ra'] && {
                            ram: {
                                contains: <string>request.query['ra'],
                            },
                        }),
                    },
                    {
                        ...(request.query['c'] && {
                            battery: {
                                contains: <string>request.query['c'],
                            },
                        }),
                    },
                    {
                        ...(request.query['p'] && {
                            battery: {
                                gte: <string>request.query['p'],
                            },
                        }),
                    },
                    {
                        ...(request.query['o'] && {
                            os: {
                                contains: <string>request.query['o'],
                            },
                        }),
                    },
                ],
            },
            include: {
                product_option: {
                    include: {
                        product: {
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
                                        logo_url: true,
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
                            },
                        },
                        product_option_value: {
                            select: {
                                option: {
                                    select: {
                                        name: true,
                                    },
                                },
                                value: true,
                                adjust_price: true,
                            },
                        },
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        reviews: {
                            where: {
                                parent_id: null,
                            },
                            select: {
                                id: true,
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        name: true,
                                        avatar: true,
                                    },
                                },
                                star: true,
                                comment: true,
                                _count: true,
                                children: {
                                    select: {
                                        user: {
                                            select: {
                                                id: true,
                                                email: true,
                                                name: true,
                                                avatar: true,
                                            },
                                        },
                                        comment: true,
                                        created_at: true,
                                    },
                                },
                                created_at: true,
                            },
                        },
                    },
                },
            },
        });

        return products.map((product) =>
            this.convertProductParameterResponse(product),
        );
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

    private convertProductResponse(
        product: ProductDetailDB,
    ): ProductDetailResponse {
        return {
            ...product,
            product_options: product.product_options.map((productOption) => {
                const rating = <number[]>Array(6).fill(0);
                let overall = 0;

                productOption.reviews.forEach((review) => {
                    rating[review.star]++;
                });

                rating.forEach((item, idx) => {
                    if (item >= 1) {
                        overall += idx;
                    }
                });

                overall /= productOption.reviews.length;

                const { product_option_value } = productOption;
                delete productOption.product_option_value;

                return {
                    ...productOption,
                    technical_specs: translateSpecs(
                        productOption.technical_specs,
                    ),
                    options: product_option_value.map((el) => ({
                        name: el.option.name,
                        value: el.value,
                        adjust_price: el.adjust_price,
                    })),
                    rating: {
                        total_reviews: productOption.reviews.length,
                        details: rating,
                        overall: overall ? overall : 0,
                    },
                    reviews: productOption.reviews,
                };
            }),
        };
    }

    private convertProductParameterResponse(
        productParameter: ProductParameterDB,
    ): ProductParameterResponse {
        const { product_option } = productParameter;
        const { product, product_option_value, id } = product_option;

        delete product_option.product_option_value;
        delete productParameter.product_option;
        delete product_option.product_id;
        delete product_option.created_at;
        delete product_option.updated_at;
        delete product_option.is_deleted;
        delete product_option.product;
        delete product_option.id;

        const rating = <number[]>Array(6).fill(0);
        let overall = 0;

        product_option.reviews.forEach((review) => {
            rating[review.star]++;
        });

        rating.forEach((item, idx) => {
            if (item >= 1) {
                overall += idx;
            }
        });

        overall /= product_option.reviews.length;

        return {
            product_option_id: id,
            ...product,
            ...product_option,
            technical_specs: translateSpecs(productParameter),
            options: product_option_value.map((el) => ({
                name: el.option.name,
                value: el.value,
                adjust_price: el.adjust_price,
            })),
            rating: {
                total_reviews: product_option.reviews.length,
                details: rating,
                overall: overall ? overall : 0,
            },
            reviews: product_option.reviews,
        };
    }
}
