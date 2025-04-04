import { Module } from '@nestjs/common';

import { BrandModule } from '@v2/modules/brand/brand.module';
import { BRAND_TOKENS } from '@v2/modules/brand/constants';
import { BrandQueryService } from '@v2/modules/brand/services/brand-query.service';
import { CacheModule } from '@v2/modules/cache/cache.module';
import { CategoryModule } from '@v2/modules/category/category.module';
import { CATEGORY_TOKENS } from '@v2/modules/category/constants';
import { CategoryQueryService } from '@v2/modules/category/services/category-query.service';
import { CommonModule } from '@v2/modules/common/common.module';
import { MediaModule } from '@v2/modules/media/media.module';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import {
    ProductController,
    ProductComboController,
    ProductVariantController,
} from '@v2/modules/product/controllers';
import { ProductMediaHandler } from '@v2/modules/product/handlers';
import {
    VariantCommandRepository,
    ComboCommandRepository,
    ProductQueryRepository,
    VariantQueryRepository,
    ComboQueryRepository,
    ProductCommandRepository,
} from '@v2/modules/product/repositories';
import {
    ProductCommandService,
    ProductQueryService,
    VariantCommandService,
    ComboCommandService,
    VariantQueryService,
    ComboQueryService,
} from '@v2/modules/product/services';

@Module({
    imports: [CommonModule, MediaModule, BrandModule, CategoryModule, CacheModule.register({})],
    controllers: [ProductController, ProductVariantController, ProductComboController],
    providers: [
        {
            provide: BRAND_TOKENS.SERVICES.QUERY,
            useClass: BrandQueryService,
        },
        {
            provide: CATEGORY_TOKENS.SERVICES.QUERY,
            useClass: CategoryQueryService,
        },
        {
            provide: PRODUCT_TOKENS.REPOSITORIES.PRODUCT_QUERY,
            useClass: ProductQueryRepository,
        },
        {
            provide: PRODUCT_TOKENS.REPOSITORIES.VARIANT_QUERY,
            useClass: VariantQueryRepository,
        },
        {
            provide: PRODUCT_TOKENS.REPOSITORIES.COMBO_QUERY,
            useClass: ComboQueryRepository,
        },
        {
            provide: PRODUCT_TOKENS.REPOSITORIES.PRODUCT_COMMAND,
            useClass: ProductCommandRepository,
        },
        {
            provide: PRODUCT_TOKENS.REPOSITORIES.VARIANT_COMMAND,
            useClass: VariantCommandRepository,
        },
        {
            provide: PRODUCT_TOKENS.REPOSITORIES.COMBO_COMMAND,
            useClass: ComboCommandRepository,
        },
        {
            provide: PRODUCT_TOKENS.SERVICES.PRODUCT_COMMAND,
            useClass: ProductCommandService,
        },
        {
            provide: PRODUCT_TOKENS.SERVICES.PRODUCT_QUERY,
            useClass: ProductQueryService,
        },
        {
            provide: PRODUCT_TOKENS.SERVICES.VARIANT_COMMAND,
            useClass: VariantCommandService,
        },
        {
            provide: PRODUCT_TOKENS.SERVICES.VARIANT_QUERY,
            useClass: VariantQueryService,
        },
        {
            provide: PRODUCT_TOKENS.SERVICES.COMBO_COMMAND,
            useClass: ComboCommandService,
        },
        {
            provide: PRODUCT_TOKENS.SERVICES.COMBO_QUERY,
            useClass: ComboQueryService,
        },
        {
            provide: PRODUCT_TOKENS.HANDLERS.MEDIA,
            useClass: ProductMediaHandler,
        },
    ],
    exports: [
        PRODUCT_TOKENS.SERVICES.PRODUCT_QUERY,
        PRODUCT_TOKENS.SERVICES.PRODUCT_COMMAND,
        PRODUCT_TOKENS.SERVICES.VARIANT_QUERY,
        PRODUCT_TOKENS.SERVICES.VARIANT_COMMAND,
        PRODUCT_TOKENS.SERVICES.COMBO_QUERY,
        PRODUCT_TOKENS.SERVICES.COMBO_COMMAND,
    ],
})
export class ProductModule {}
