import { Module } from '@nestjs/common';

import { CategoryController } from '@v2/modules/category/category.controller';
import { CATEGORY_TOKENS } from '@v2/modules/category/constants';
import {
    CategoryCommandRepository,
    CategoryQueryRepository,
} from '@v2/modules/category/repositories';
import { CategoryCommandService, CategoryQueryService } from '@v2/modules/category/services';
import { CategoryService } from '@v2/modules/category/services/category.service';
import { CommonModule } from '@v2/modules/common/common.module';

@Module({
    imports: [CommonModule],
    controllers: [CategoryController],
    providers: [
        {
            provide: CATEGORY_TOKENS.REPOSITORIES.QUERY,
            useClass: CategoryQueryRepository,
        },
        {
            provide: CATEGORY_TOKENS.REPOSITORIES.COMMAND,
            useClass: CategoryCommandRepository,
        },
        {
            provide: CATEGORY_TOKENS.SERVICES.QUERY,
            useClass: CategoryQueryService,
        },
        {
            provide: CATEGORY_TOKENS.SERVICES.COMMAND,
            useClass: CategoryCommandService,
        },
        {
            provide: CATEGORY_TOKENS.SERVICES.CATEGORY,
            useClass: CategoryService,
        },
    ],
    exports: [
        CATEGORY_TOKENS.SERVICES.CATEGORY,
        CATEGORY_TOKENS.SERVICES.COMMAND,
        CATEGORY_TOKENS.SERVICES.QUERY,
        CATEGORY_TOKENS.REPOSITORIES.QUERY,
        CATEGORY_TOKENS.REPOSITORIES.COMMAND,
    ],
})
export class CategoryModule {}
