import { Module } from '@nestjs/common';

import { CommonModule } from '@v2/modules/common/common.module';
import { MediaModule } from '@v2/modules/media/media.module';
import { REVIEW_TOKENS } from '@v2/modules/review/constants';
import { ReviewCommandRepository, ReviewQueryRepository } from '@v2/modules/review/repositories';
import { ReviewController } from '@v2/modules/review/review.controller';
import { ReviewCommandService } from '@v2/modules/review/services/review-command.service';
import { ReviewMediaService } from '@v2/modules/review/services/review-media.service';
import { ReviewQueryService } from '@v2/modules/review/services/review-query.service';
import { UserModule } from '@v2/modules/user/user.module';

@Module({
    imports: [CommonModule, MediaModule, UserModule],
    controllers: [ReviewController],
    providers: [
        {
            provide: REVIEW_TOKENS.SERVICES.COMMAND,
            useClass: ReviewCommandService,
        },
        {
            provide: REVIEW_TOKENS.SERVICES.QUERY,
            useClass: ReviewQueryService,
        },
        {
            provide: REVIEW_TOKENS.SERVICES.MEDIA,
            useClass: ReviewMediaService,
        },
        {
            provide: REVIEW_TOKENS.REPOSITORIES.COMMAND,
            useClass: ReviewCommandRepository,
        },
        {
            provide: REVIEW_TOKENS.REPOSITORIES.QUERY,
            useClass: ReviewQueryRepository,
        },
    ],
    exports: [
        REVIEW_TOKENS.SERVICES.COMMAND,
        REVIEW_TOKENS.SERVICES.QUERY,
        REVIEW_TOKENS.SERVICES.MEDIA,
    ],
})
export class ReviewModule {}
