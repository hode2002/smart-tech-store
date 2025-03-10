import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request } from 'express';

import { generateSlug, pagination } from '@/common/utils';
import { PrismaService } from '@/prisma/prisma.service';
import {
    COMBO_DETAIL_SELECT,
    PRODUCT_DETAIL_SELECT,
    PRODUCT_OPTION_DETAIL_SELECT,
    PRODUCT_OPTION_UPDATE_SELECT,
} from '@/prisma/selectors';
import { MediaService } from '@v1/modules/media/media.service';
import {
    CreateComboDto,
    CreateProductComboDto,
    CreateProductDto,
    CreateProductOptionDto,
    UpdateProductComboDto,
    UpdateProductDto,
    UpdateProductOptionDto,
} from '@v1/modules/product/dto';

import { ProductDetailDB, ProductDetailResponse } from './types';

@Injectable()
export class ProductService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
        private readonly configService: ConfigService,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const { descriptions, product_options, ...productDto } = createProductDto;

        if (product_options && product_options?.length > 0) {
            const isExist = await this.prismaService.product.findFirst({
                where: {
                    name: productDto.name,
                    product_options: {
                        none: {
                            slug:
                                generateSlug(productDto.name) +
                                product_options[0].sku.trim().replaceAll(' ', '-').toLowerCase(),
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
            productOptionPromises = product_options.map(async product_option => {
                const {
                    technical_specs,
                    product_option_value,
                    product_images,
                    price_modifier,
                    ...other
                } = product_option;
                const technicalSpecs = await this.prismaService.technicalSpecs.create({
                    data: {
                        specs: {
                            create: technical_specs.map(spec => ({
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
                        slug: generateSlug(newProduct.name) + '-' + generateSlug(other.sku),
                    },
                });
            });
        }

        return {
            ...newProduct,
            ...(productOptionPromises &&
                productOptionPromises?.length > 0 && {
                    product_options: await Promise.all(productOptionPromises),
                }),
        };
    }

    async getAllProductCombo() {
        return await this.prismaService.combo.findMany({
            orderBy: {
                created_at: 'asc',
            },
            select: COMBO_DETAIL_SELECT,
        });
    }

    async createCombo(createComboDto: CreateComboDto) {
        const { mainProductId, productCombos } = createComboDto;
        if (!mainProductId) {
            throw new BadRequestException('Missing product option id!');
        }

        const isExist = await this.prismaService.combo.findFirst({
            where: { product_option_id: mainProductId, status: 0 },
        });

        if (isExist) {
            throw new ConflictException('Combo already exists');
        }

        const result = await this.prismaService.$transaction(async prisma => {
            const combo = await prisma.combo.create({
                data: {
                    product_option_id: mainProductId,
                },
                include: {
                    product_option: true,
                },
            });

            const createProductComboPromises = productCombos.map(item =>
                prisma.productCombo.create({
                    data: {
                        combo_id: combo.id,
                        product_option_id: item.productComboId,
                        discount: item.discount,
                    },
                }),
            );

            await Promise.all(createProductComboPromises);

            return {
                comboId: combo.id,
            };
        });

        return await this.prismaService.combo.findUnique({
            where: { id: result.comboId, status: 0 },
            select: COMBO_DETAIL_SELECT,
        });
    }

    async createProductCombo(createProductComboDto: CreateProductComboDto) {
        const { comboId, discount, productOptionId } = createProductComboDto;

        const combo = await this.prismaService.combo.findUnique({
            where: { id: comboId },
            include: {
                product_option: true,
                product_combos: true,
            },
        });

        if (!combo) {
            throw new NotFoundException('Combo not found!');
        }

        if (combo.product_option_id === productOptionId) {
            throw new BadRequestException('Invalid product option id!');
        }

        if (combo.product_combos.find(p => p.product_option_id === productOptionId)) {
            throw new BadRequestException('Product already exist in combo!');
        }

        const productCombo = await this.prismaService.productCombo.create({
            data: {
                combo_id: comboId,
                product_option_id: productOptionId,
                discount,
            },
            include: {
                combo: true,
                product_option: true,
            },
        });

        if (!productCombo) {
            throw new UnprocessableEntityException('Create failed. Please try again!');
        }

        return productCombo;
    }

    async updateStatusCombo(id: string, status: number) {
        if (!id) {
            throw new BadRequestException('Missing combo id!');
        }

        if (status === 0) {
            const combo = await this.prismaService.combo.findUnique({
                where: { id },
            });

            if (!combo) {
                throw new NotFoundException('Combo not found');
            }

            const isExist = await this.prismaService.combo.findFirst({
                where: { product_option_id: combo.product_option_id, status },
            });

            if (isExist) {
                throw new ForbiddenException('1 product cannot have 2 combos at the same time');
            }
        }

        const updated = await this.prismaService.combo.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                status: true,
            },
        });

        return updated;
    }

    async updateProductCombo(comboId: string, updateProductComboDto: UpdateProductComboDto) {
        if (!comboId) {
            throw new BadRequestException('Missing combo id!');
        }

        const combo = await this.prismaService.combo.findUnique({
            where: { id: comboId },
        });

        if (!combo) {
            throw new NotFoundException('Combo not found!');
        }

        const updateProductComboPromises = updateProductComboDto.productCombos.map(item => {
            return this.prismaService.productCombo.updateMany({
                where: {
                    combo_id: comboId,
                    product_option_id: item.product_option_id,
                },
                data: {
                    discount: item.discount,
                },
            });
        });

        await Promise.all(updateProductComboPromises);

        return await this.prismaService.combo.findUnique({
            where: { id: comboId },
        });
    }

    async createProductOption(createProductOptionDto: CreateProductOptionDto) {
        const { product_id, product_options } = createProductOptionDto;

        const product = await this.findById(product_id);
        if (!product) {
            throw new NotFoundException('Product Does Not Exist');
        }

        const productOptionPromises = product_options.map(async product_option => {
            const { technical_specs, product_option_value, product_images, ...other } =
                product_option;
            const technicalSpecs = await this.prismaService.technicalSpecs.create({
                data: {
                    specs: {
                        create: technical_specs.map(spec => ({
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
                    slug: generateSlug(product.name) + '-' + generateSlug(other.sku),
                },
                include: {
                    product_images: true,
                },
            });
        });

        const productOptions = await Promise.all(productOptionPromises);

        const PYTHON_API_URL = this.configService.get('PYTHON_API_URL');
        productOptions.map(async productOption => {
            for (const item of [
                ...productOption.product_images,
                { image_url: productOption.thumbnail, image_alt_text: '' },
            ]) {
                return await axios.post(PYTHON_API_URL + '/products/create-vector', {
                    image_url: item.image_url,
                    product_option_id: productOption.id,
                });
            }
        });

        return await this.findById(product_id);
    }

    async findAll(request: Request) {
        const countRecords = await this.prismaService.product.count();
        const { limit, page, skip, totalPages } = pagination(request, countRecords);

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
            select: PRODUCT_DETAIL_SELECT,
        });

        return {
            totalPages,
            ...(page < totalPages && { nextPage: page + 1 }),
            ...(page > 1 && page <= totalPages && { previousPage: page - 1 }),
            products: products.map(product =>
                this.convertProductResponse(product as unknown as ProductDetailDB),
            ),
        };
    }

    async findDetailManagement(id: string) {
        const product = await this.prismaService.product.findUnique({
            where: { id },
            select: PRODUCT_DETAIL_SELECT,
        });

        return this.convertProductResponse(product as unknown as ProductDetailDB);
    }

    async findAllManagement(request: Request) {
        const countRecords = await this.prismaService.product.count();
        const { limit, page, skip, totalPages } = pagination(request, countRecords);

        if (page > totalPages) {
            return [];
        }

        const products = await this.prismaService.product.findMany({
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
            select: PRODUCT_DETAIL_SELECT,
        });

        return {
            totalPages,
            ...(page < totalPages && { nextPage: page + 1 }),
            ...(page > 1 && page <= totalPages && { previousPage: page - 1 }),
            products: products.map(product =>
                this.convertProductResponse(product as unknown as ProductDetailDB),
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

        const productThumbs = productOptions.map(productOption => {
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
                    some: {
                        is_sale: true,
                        stock: { gt: 0 },
                        is_deleted: false,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: PRODUCT_DETAIL_SELECT,
        });

        if (!products.length) {
            return [];
        }

        return products.map(product =>
            this.convertProductResponse(product as unknown as ProductDetailDB),
        );
    }

    async getByBrand(slug: string) {
        if (!slug) {
            throw new BadRequestException('Missing brand slug');
        }

        const products = await this.prismaService.product.findMany({
            where: {
                brand: {
                    slug,
                    is_deleted: false,
                },
                product_options: {
                    some: {
                        stock: { gt: 0 },
                        is_deleted: false,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: PRODUCT_DETAIL_SELECT,
        });

        if (!products.length) {
            return [];
        }

        return products.map(product =>
            this.convertProductResponse(product as unknown as ProductDetailDB),
        );
    }

    async getByCategory(slug: string) {
        if (!slug) {
            throw new BadRequestException('Missing category slug');
        }

        const products = await this.prismaService.product.findMany({
            where: {
                category: {
                    slug,
                    is_deleted: false,
                },
                brand: {
                    is_deleted: false,
                },
                product_options: {
                    some: {
                        stock: { gt: 0 },
                        is_deleted: false,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: PRODUCT_DETAIL_SELECT,
        });

        if (!products.length) {
            return [];
        }

        return products.map(product =>
            this.convertProductResponse(product as unknown as ProductDetailDB),
        );
    }

    async findById(id: string): Promise<ProductDetailResponse> {
        if (!id) {
            throw new ForbiddenException('Missing product id');
        }

        const product = await this.prismaService.product.findFirst({
            where: {
                id,
                product_options: {
                    some: {
                        stock: { gt: 0 },
                        is_deleted: false,
                    },
                },
            },
            select: PRODUCT_DETAIL_SELECT,
        });

        if (!product) {
            throw new NotFoundException('Product not found or out of stock');
        }

        return this.convertProductResponse(product as unknown as ProductDetailDB);
    }

    async findBySlug(slug: string): Promise<ProductDetailResponse> {
        if (!slug) {
            throw new ForbiddenException('Missing product slug');
        }

        const product = await this.prismaService.product.findFirst({
            where: {
                product_options: {
                    some: {
                        slug,
                        stock: { gt: 0 },
                        is_deleted: false,
                    },
                },
            },
            select: PRODUCT_DETAIL_SELECT,
        });

        if (!product) {
            throw new NotFoundException('Product not found or out of stock');
        }

        return this.convertProductResponse(product as unknown as ProductDetailDB);
    }

    async findByProductOptionId(id: string) {
        if (!id) {
            throw new ForbiddenException('Missing product option id');
        }

        const product = await this.prismaService.productOption.findFirst({
            where: {
                id,
                is_deleted: false,
                stock: { gt: 0 },
            },
            select: PRODUCT_OPTION_DETAIL_SELECT,
        });

        if (!product) {
            throw new NotFoundException('Product option not found or out of stock');
        }

        return product;
    }

    async getByParameters(request: Request) {
        const categoryName = request.query['ca'] as string;
        const brandNames = request.query['b'] as string;
        const priceFrom = request.query['pf'] ? Number(request.query['pf']) * 1000000 : undefined;
        const priceTo = request.query['pt'] ? Number(request.query['pt']) * 1000000 : undefined;

        const romOptions = request.query['ro'] as string;
        const colorOption = request.query['co'] as string;
        const ramOptions = request.query['ra'] as string;
        const cpuOptions = request.query['c'] as string;
        const performanceOptions = request.query['p'] as string;
        const otherOptions = request.query['o'] as string;

        const filters = {
            category: { is_deleted: false },
            brand: { is_deleted: false },
            product_options: {
                some: {
                    technical_specs: {
                        product_option: {
                            stock: { gt: 0 },
                            product: {
                                AND: [
                                    categoryName && {
                                        category: {
                                            name: { contains: categoryName },
                                        },
                                    },
                                    brandNames && {
                                        brand: {
                                            OR: brandNames.split(',').map(item => ({
                                                name: { contains: item.trim() },
                                            })),
                                        },
                                    },
                                    {
                                        price: {
                                            ...(priceFrom && { gte: priceFrom }),
                                            ...(priceTo && { lte: priceTo }),
                                        },
                                    },
                                ].filter(Boolean),
                            },
                        },
                        AND: [
                            romOptions && {
                                specs: {
                                    some: {
                                        OR: romOptions.split(',').map(item => ({
                                            value: { contains: item.trim() },
                                        })),
                                    },
                                },
                            },
                            colorOption && {
                                specs: {
                                    some: {
                                        value: { contains: colorOption },
                                    },
                                },
                            },
                            ramOptions && {
                                specs: {
                                    some: {
                                        OR: ramOptions.split(',').map(item => ({
                                            value: { contains: item.trim() },
                                        })),
                                    },
                                },
                            },
                            cpuOptions && {
                                specs: {
                                    some: {
                                        OR: cpuOptions.split(',').map(item => ({
                                            value: { contains: item.trim() },
                                        })),
                                    },
                                },
                            },
                            performanceOptions && {
                                specs: {
                                    some: {
                                        OR: performanceOptions.split(',').map(item => ({
                                            value: { gte: item.trim() },
                                        })),
                                    },
                                },
                            },
                            otherOptions && {
                                specs: {
                                    some: {
                                        OR: otherOptions.split(',').map(item => ({
                                            value: { contains: item.trim() },
                                        })),
                                    },
                                },
                            },
                        ].filter(Boolean),
                    },
                },
                none: { stock: { lte: 0 } },
            },
        };

        const products = await this.prismaService.product.findMany({
            where: filters,
            select: PRODUCT_DETAIL_SELECT,
        });

        return products.map(product =>
            this.convertProductResponse(product as unknown as ProductDetailDB),
        );
    }

    async getByName(request: Request) {
        const keyword = request.query['keyword'] as string;

        if (!keyword) {
            return {
                totalPages: 0,
                products: [],
            };
        }

        const countRecords = await this.prismaService.product.count({
            where: {
                OR: [
                    { name: { contains: keyword } },
                    { product_options: { some: { slug: { contains: keyword } } } },
                ],
                product_options: {
                    some: { stock: { gt: 0 }, is_deleted: false },
                },
            },
        });

        const { limit, page, skip, totalPages } = pagination(request, countRecords);

        if (page > totalPages) {
            return {
                totalPages,
                products: [],
            };
        }

        const products = await this.prismaService.product.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword } },
                    { product_options: { some: { slug: { contains: keyword } } } },
                ],
                product_options: {
                    some: { stock: { gt: 0 }, is_deleted: false },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: PRODUCT_DETAIL_SELECT,
        });

        return {
            totalPages,
            ...(page < totalPages && { nextPage: page + 1 }),
            ...(page > 1 && page <= totalPages && { previousPage: page - 1 }),
            products: products.map(product =>
                this.convertProductResponse(product as unknown as ProductDetailDB),
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
                        id: { in: productOptionIds },
                        stock: { gt: 0 },
                        is_deleted: false,
                    },
                },
            },
            select: PRODUCT_DETAIL_SELECT,
            orderBy: {
                created_at: 'desc',
            },
        });

        if (!products.length) {
            return [];
        }

        return products.map(product =>
            this.convertProductResponse(product as unknown as ProductDetailDB),
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
        const { product_options, descriptions, brandId, cateId, ...other } = updateProductDto;

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
            const productOptionsPromises = product_options.map(async product_option => {
                return this.updateProductOption(product_option.id, product_option);
            });
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
        const { product_images, technical_specs, ...other } = updateProductOptionDto;
        const isExist = await this.prismaService.productOption.findUnique({
            where: {
                id: productOptionId,
            },
            select: PRODUCT_OPTION_UPDATE_SELECT,
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
            const productImagesPromises = isExist.product_images.map(async item => {
                this.mediaService.deleteV2(item.image_url);
            });
            await Promise.all(productImagesPromises);
        }
        await this.prismaService.technicalSpecs.delete({
            where: { id: isExist.technical_specs.id },
        });
        const newTechnicalSpecs = await this.prismaService.technicalSpecs.create({
            data: {
                specs: {
                    createMany: {
                        data: technical_specs.map(spec => ({
                            ...spec,
                            spec_type: isExist.product.category.slug,
                        })),
                    },
                },
            },
        });

        if (product_images) {
            const PYTHON_API_URL = this.configService.get('PYTHON_API_URL');
            for (const item of product_images) {
                await axios.post(PYTHON_API_URL + '/products/create-vector', {
                    image_url: item.image_url,
                    product_option_id: productOptionId,
                });
            }
        }

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
            select: PRODUCT_OPTION_DETAIL_SELECT,
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

    private convertProductResponse(product: ProductDetailDB): ProductDetailResponse {
        if (!product) {
            return null;
        }

        const productGlobalOptions: { name: string; values: string[] }[] = [];
        const optionsMap = new Map<string, string[]>();

        const processedProductOptions = product?.product_options.map(productOption => {
            const rating = Array(6).fill(0);
            let overall = 0;
            const reviewCount = productOption.reviews.length;

            productOption.reviews.forEach(review => {
                rating[review.star]++;
            });

            if (reviewCount > 0) {
                let totalStars = 0;
                rating.forEach((count, star) => {
                    totalStars += count * star;
                });
                overall = totalStars / reviewCount;
            }

            const { product_option_value } = productOption;

            const productOptionValues = product_option_value.map(el => {
                const optionName = el.option.name;

                if (!optionsMap.has(optionName)) {
                    optionsMap.set(optionName, [el.value]);
                } else {
                    const values = optionsMap.get(optionName);
                    if (!values.includes(el.value)) {
                        values.push(el.value);
                    }
                }

                return {
                    name: optionName,
                    value: el.value,
                    adjust_price: el.adjust_price,
                };
            });

            return {
                ...productOption,
                technical_specs: productOption.technical_specs.specs.map(item => ({
                    name: item.key,
                    value: item.value,
                })),
                options: productOptionValues,
                rating: {
                    total_reviews: reviewCount,
                    details: rating,
                    overall: overall || 0,
                },
                reviews: productOption.reviews,
            };
        });

        optionsMap.forEach((values, name) => {
            productGlobalOptions.push({ name, values });
        });

        return {
            ...product,
            product_options: processedProductOptions,
            options: productGlobalOptions,
        };
    }
}
