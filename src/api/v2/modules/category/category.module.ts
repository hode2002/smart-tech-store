import { Module } from '@nestjs/common';

import {
    CATEGORY_COMMAND_REPOSITORY,
    CATEGORY_QUERY_REPOSITORY,
} from '@v2/modules/category/constants';
import { ICategoryCommandRepository } from '@v2/modules/category/interfaces';
import {
    CategoryCommandRepository,
    CategoryQueryRepository,
} from '@v2/modules/category/repositories';
import { CategoryCommandService, CategoryQueryService } from '@v2/modules/category/services';
import { CommonModule } from '@v2/modules/common/common.module';
import { CommonService } from '@v2/modules/common/common.service';

import { CategoryController } from './category.controller';
import { CategoryService } from './services/category.service';

@Module({
    imports: [CommonModule],
    controllers: [CategoryController],
    providers: [
        CommonService,
        {
            provide: CATEGORY_QUERY_REPOSITORY,
            useClass: CategoryQueryRepository,
        },
        {
            provide: CATEGORY_COMMAND_REPOSITORY,
            useClass: CategoryCommandRepository,
        },
        CategoryService,
        CategoryQueryService,
        {
            provide: CategoryCommandService,
            useFactory: (
                categoryRepo: ICategoryCommandRepository,
                categoryQueryService: CategoryQueryService,
            ) => {
                return new CategoryCommandService(categoryRepo, categoryQueryService);
            },
            inject: [CATEGORY_COMMAND_REPOSITORY, CategoryQueryService],
        },
    ],
    exports: [CategoryService],
})
export class CategoryModule {}
