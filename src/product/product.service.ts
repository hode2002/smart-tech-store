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
import { ProductDetailDB, ProductDetailResponse } from './types';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class ProductService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const { descriptions, product_options, ...productDto } =
            createProductDto;

        if (product_options && product_options?.length > 0) {
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
            select: {
                id: true,
                name: true,
                category: { select: { slug: true } },
            },
        });
        let productOptionPromises = [];
        if (product_options && product_options.length > 0) {
            productOptionPromises = product_options.map(
                async (product_option) => {
                    const {
                        technical_specs,
                        product_option_value,
                        product_images,
                        price_modifier,
                        ...other
                    } = product_option;
                    const technicalSpecs =
                        await this.prismaService.technicalSpecs.create({
                            data: {
                                specs: {
                                    create: technical_specs.map((spec) => ({
                                        ...spec,
                                        spec_type: newProduct.category.slug,
                                    })),
                                },
                            },
                            select: {
                                id: true,
                            },
                        });
                    return this.prismaService.productOption.create({
                        data: {
                            ...other,
                            ...(price_modifier && { price_modifier }),
                            product_id: newProduct.id,
                            product_images: {
                                createMany: {
                                    data: product_images,
                                },
                            },
                            technical_specs_id: technicalSpecs.id,
                            ...(product_option_value && {
                                product_option_value: {
                                    createMany: {
                                        data: product_option_value,
                                    },
                                },
                            }),
                            slug:
                                generateSlug(newProduct.name) +
                                '-' +
                                generateSlug(other.sku),
                        },
                    });
                },
            );
        }

        return {
            ...newProduct,
            ...(productOptionPromises &&
                productOptionPromises?.length > 0 && {
                    product_options: await Promise.all(productOptionPromises),
                }),
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
                const technicalSpecs =
                    await this.prismaService.technicalSpecs.create({
                        data: {
                            specs: {
                                create: technical_specs.map((spec) => ({
                                    ...spec,
                                    spec_type: product.category.slug,
                                })),
                            },
                        },
                        select: {
                            id: true,
                        },
                    });
                return this.prismaService.productOption.create({
                    data: {
                        ...other,
                        product_id: product.id,
                        product_images: {
                            createMany: {
                                data: product_images,
                            },
                        },
                        technical_specs_id: technicalSpecs.id,
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
            where: {
                product_options: {
                    none: {
                        stock: { equals: 0 },
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                name: true,
                main_image: true,
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
                    where: { is_deleted: false, stock: { gte: 1 } },
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
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
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
                                        id: true,
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

    async findDetailManagement(id: string) {
        const product = await this.prismaService.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                main_image: true,
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
                created_at: true,
                product_options: {
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
                        is_deleted: true,
                        created_at: true,
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        technical_specs: {
                            select: {
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
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
                                        id: true,
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

        return this.convertProductResponse(product);
    }

    async findAllManagement(request: Request) {
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
                main_image: true,
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
                brand: true,
                category: true,
                created_at: true,
                product_options: {
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
                        is_deleted: true,
                        created_at: true,
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        technical_specs: {
                            select: {
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
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
                                        id: true,
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

    async getProductImages() {
        const productImages = await this.prismaService.productImage.findMany({
            select: {
                product_option_id: true,
                image_url: true,
            },
        });

        const productOptions = await this.prismaService.productOption.findMany({
            select: {
                id: true,
                thumbnail: true,
            },
        });

        const productThumbs = productOptions.map((productOption) => {
            return {
                product_option_id: productOption.id,
                image_url: productOption.thumbnail,
            };
        });

        return [...productThumbs, ...productImages];
    }

    async getProductSale() {
        const products = await this.prismaService.product.findMany({
            where: {
                product_options: {
                    none: {
                        stock: { lte: 0 },
                    },
                    some: {
                        is_sale: true,
                        is_deleted: false,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                name: true,
                price: true,
                main_image: true,
                promotions: true,
                warranties: true,
                label: true,
                created_at: true,
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
                    where: {
                        stock: { gt: 0 },
                        is_sale: true,
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
                        technical_specs: {
                            select: {
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
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
                                        id: true,
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

        return products.map((product) => this.convertProductResponse(product));
    }

    async getByBrand(slug: string) {
        const products = await this.prismaService.product.findMany({
            where: {
                brand: { slug },
                product_options: {
                    none: {
                        stock: { lte: 0 },
                    },
                    some: {
                        is_deleted: false,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                name: true,
                main_image: true,
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
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
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
                                        id: true,
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

        return products.map((product) => this.convertProductResponse(product));
    }

    async getByCategory(slug: string) {
        const products = await this.prismaService.product.findMany({
            where: {
                category: { slug, is_deleted: false },
                brand: { is_deleted: false },
                product_options: {
                    none: {
                        stock: { lte: 0 },
                    },
                    some: {
                        is_deleted: false,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                name: true,
                price: true,
                main_image: true,
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
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
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
                                        id: true,
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
        return products.map((product) => this.convertProductResponse(product));
    }

    async findById(id: string): Promise<ProductDetailResponse> {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.prismaService.product.findFirst({
            where: {
                id,
                product_options: {
                    none: {
                        stock: { lte: 0 },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                price: true,
                main_image: true,
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
                    where: { is_deleted: false, stock: { gte: 1 } },
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
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
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
                                        id: true,
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

    async findBySlug(slug: string): Promise<ProductDetailResponse> {
        if (!slug) {
            throw new ForbiddenException('Missing slug');
        }

        const product = await this.prismaService.product.findFirst({
            where: {
                product_options: {
                    some: {
                        slug,
                    },
                    none: {
                        stock: {
                            equals: 0,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                price: true,
                main_image: true,
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
                    where: {
                        is_deleted: false,
                        stock: { gte: 1 },
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
                        technical_specs: {
                            select: {
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
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
                                video_url: true,
                                review_images: {
                                    select: {
                                        image_url: true,
                                    },
                                },
                                _count: true,
                                children: {
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
                stock: { equals: 1 },
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
        const products = await this.prismaService.product.findMany({
            where: {
                category: { is_deleted: false },
                brand: { is_deleted: false },
                product_options: {
                    some: {
                        technical_specs: {
                            product_option: {
                                stock: { gte: 1 },
                                product: {
                                    AND: [
                                        {
                                            ...(request.query['ca'] && {
                                                category: {
                                                    name: {
                                                        contains: <string>(
                                                            request.query['ca']
                                                        ),
                                                    },
                                                },
                                            }),
                                        },
                                        {
                                            ...(request.query['b'] && {
                                                brand: {
                                                    OR: (
                                                        request.query[
                                                            'b'
                                                        ] as string
                                                    )
                                                        .split(',')
                                                        .map((item) => ({
                                                            name: {
                                                                contains: item,
                                                            },
                                                        })),
                                                },
                                            }),
                                        },
                                        {
                                            price: {
                                                ...(request.query['pf'] && {
                                                    gte:
                                                        Number(
                                                            request.query['pf'],
                                                        ) * 1000000,
                                                }),
                                                ...(request.query['pt'] && {
                                                    lte:
                                                        Number(
                                                            request.query['pt'],
                                                        ) * 1000000,
                                                }),
                                            },
                                        },
                                    ],
                                },
                            },
                            AND: [
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['ro'] && {
                                                OR: (
                                                    request.query[
                                                        'ro'
                                                    ] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['co'] && {
                                                value: {
                                                    contains: <string>(
                                                        request.query['co']
                                                    ),
                                                },
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['ra'] && {
                                                OR: (
                                                    request.query[
                                                        'ra'
                                                    ] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['c'] && {
                                                OR: (
                                                    request.query['c'] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['p'] && {
                                                OR: (
                                                    request.query['p'] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            gte: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['o'] && {
                                                OR: (
                                                    request.query['o'] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    none: {
                        stock: {
                            equals: 0,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                price: true,
                main_image: true,
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
                    where: {
                        technical_specs: {
                            product_option: {
                                stock: { gte: 1 },
                                product: {
                                    AND: [
                                        {
                                            ...(request.query['ca'] && {
                                                category: {
                                                    name: {
                                                        contains: <string>(
                                                            request.query['ca']
                                                        ),
                                                    },
                                                },
                                            }),
                                        },
                                        {
                                            ...(request.query['b'] && {
                                                brand: {
                                                    OR: (
                                                        request.query[
                                                            'b'
                                                        ] as string
                                                    )
                                                        .split(',')
                                                        .map((item) => ({
                                                            name: {
                                                                contains: item,
                                                            },
                                                        })),
                                                },
                                            }),
                                        },
                                        {
                                            price: {
                                                ...(request.query['pf'] && {
                                                    gte:
                                                        Number(
                                                            request.query['pf'],
                                                        ) * 1000000,
                                                }),
                                                ...(request.query['pt'] && {
                                                    lte:
                                                        Number(
                                                            request.query['pt'],
                                                        ) * 1000000,
                                                }),
                                            },
                                        },
                                    ],
                                },
                            },
                            AND: [
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['ro'] && {
                                                OR: (
                                                    request.query[
                                                        'ro'
                                                    ] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['co'] && {
                                                value: {
                                                    contains: <string>(
                                                        request.query['co']
                                                    ),
                                                },
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['ra'] && {
                                                OR: (
                                                    request.query[
                                                        'ra'
                                                    ] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['c'] && {
                                                OR: (
                                                    request.query['c'] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['p'] && {
                                                OR: (
                                                    request.query['p'] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            gte: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                                {
                                    specs: {
                                        some: {
                                            ...(request.query['o'] && {
                                                OR: (
                                                    request.query['o'] as string
                                                )
                                                    .split(',')
                                                    .map((item) => ({
                                                        value: {
                                                            contains: item,
                                                        },
                                                    })),
                                            }),
                                        },
                                    },
                                },
                            ],
                        },
                        is_deleted: false,
                        stock: { gte: 1 },
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
                        technical_specs: {
                            select: {
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
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
                                        id: true,
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
        return products.map((product) => this.convertProductResponse(product));
    }

    async getByName(request: Request) {
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
            where: {
                OR: [
                    {
                        name: {
                            contains: <string>request.query['keyword'],
                        },
                    },
                    {
                        product_options: {
                            some: {
                                slug: {
                                    contains: <string>request.query['keyword'],
                                },
                            },
                        },
                    },
                ],
                product_options: {
                    none: {
                        stock: {
                            equals: 0,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                price: true,
                main_image: true,
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
                    where: {
                        is_deleted: false,
                        stock: { gte: 1 },
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
                        technical_specs: {
                            select: {
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
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
                                        id: true,
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

    async getByArrayIds(productOptionIds: string[]) {
        if (!productOptionIds?.length) {
            throw new ForbiddenException('Missing array product option id');
        }

        const products = await this.prismaService.product.findMany({
            where: {
                product_options: {
                    some: {
                        id: {
                            in: productOptionIds,
                        },
                    },
                    none: {
                        stock: {
                            equals: 0,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                main_image: true,
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
                                specs: {
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
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
                                        id: true,
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

        return products.map((product) => this.convertProductResponse(product));
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        const { product_options, descriptions, brandId, cateId, ...other } =
            updateProductDto;

        await this.prismaService.product.update({
            where: { id },
            data: {
                brand_id: brandId,
                category_id: cateId,
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

        if (product_options) {
            const productOptionsPromises = product_options.map(
                async (product_option) => {
                    return this.updateProductOption(
                        product_option.id,
                        product_option,
                    );
                },
            );
            await Promise.all(productOptionsPromises);
        }

        return await this.findById(id);
    }

    async getOptionValue() {
        return await this.prismaService.option.findMany();
    }

    async updateProductOption(
        productOptionId: string,
        updateProductOptionDto: UpdateProductOptionDto,
    ) {
        if (!productOptionId) {
            throw new BadRequestException('Missing product option id');
        }
        const { product_images, technical_specs, ...other } =
            updateProductOptionDto;
        const isExist = await this.prismaService.productOption.findUnique({
            where: {
                id: productOptionId,
            },
            select: {
                product: {
                    select: { category: true },
                },
                thumbnail: true,
                label_image: true,
                technical_specs: true,
                product_images: {
                    select: {
                        image_url: true,
                    },
                },
            },
        });
        if (!isExist) {
            throw new NotFoundException(
                `Not found: product_options with id: ${productOptionId} not found`,
            );
        }
        if (other?.thumbnail) {
            await this.mediaService.deleteV2(isExist.thumbnail);
        }
        if (other?.label_image) {
            await this.mediaService.deleteV2(isExist.label_image);
        }
        if (product_images && product_images?.length > 0) {
            const productImagesPromises = isExist.product_images.map(
                async (item) => {
                    this.mediaService.deleteV2(item.image_url);
                },
            );
            await Promise.all(productImagesPromises);
        }
        await this.prismaService.technicalSpecs.delete({
            where: { id: isExist.technical_specs.id },
        });
        const newTechnicalSpecs =
            await this.prismaService.technicalSpecs.create({
                data: {
                    specs: {
                        createMany: {
                            data: technical_specs.map((spec) => ({
                                ...spec,
                                spec_type: isExist.product.category.slug,
                            })),
                        },
                    },
                },
            });
        return await this.prismaService.productOption.update({
            where: { id: productOptionId },
            data: {
                ...(product_images && {
                    product_images: {
                        deleteMany: { product_option_id: productOptionId },
                        createMany: {
                            data: product_images,
                        },
                    },
                }),
                technical_specs_id: newTechnicalSpecs.id,
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
        let options: { name: string; values: string[] }[] = [];

        return {
            ...product,
            product_options: product?.product_options.map((productOption) => {
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
                    technical_specs: productOption.technical_specs.specs.map(
                        (item) => ({ name: item.key, value: item.value }),
                    ),
                    options: product_option_value.map((el) => {
                        const isExist = options.find((o) =>
                            o.name.includes(el.option.name),
                        );
                        if (!isExist) {
                            options = [
                                ...options,
                                {
                                    name: el.option.name,
                                    values: [el.value],
                                },
                            ];
                        } else {
                            !isExist.values.includes(el.value) &&
                                isExist.values.push(el.value);
                        }

                        return {
                            name: el.option.name,
                            value: el.value,
                            adjust_price: el.adjust_price,
                        };
                    }),
                    rating: {
                        total_reviews: productOption.reviews.length,
                        details: rating,
                        overall: overall ? overall : 0,
                    },
                    reviews: productOption.reviews,
                };
            }),
            options,
        };
    }
}
