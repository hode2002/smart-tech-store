import { Module } from '@nestjs/common';

import { CacheModule } from '@v2/modules/cache/cache.module';
import { CommonModule } from '@v2/modules/common/common.module';
import { MAIL_SERVICE } from '@v2/modules/mail/constants';
import { MailModule } from '@v2/modules/mail/mail.module';
import { MailService } from '@v2/modules/mail/services/mail.service';
import { MediaModule } from '@v2/modules/media/media.module';
import { USER_TOKENS } from '@v2/modules/user/constants';
import { UserMediaHandler, PasswordHandler } from '@v2/modules/user/handlers';
import { UserCommandRepository, UserQueryRepository } from '@v2/modules/user/repositories';
import { UserCacheService } from '@v2/modules/user/services/user-cache.service';
import { UserCommandService } from '@v2/modules/user/services/user-command.service';
import { UserMediaService } from '@v2/modules/user/services/user-media.service';
import { UserQueryService } from '@v2/modules/user/services/user-query.service';
import { UserController } from '@v2/modules/user/user.controller';

@Module({
    imports: [CommonModule, MediaModule, MailModule, CacheModule.register({})],
    controllers: [UserController],
    providers: [
        UserCacheService,
        {
            provide: MAIL_SERVICE,
            useClass: MailService,
        },
        {
            provide: USER_TOKENS.REPOSITORIES.USER_QUERY_REPOSITORY,
            useClass: UserQueryRepository,
        },
        {
            provide: USER_TOKENS.REPOSITORIES.USER_COMMAND_REPOSITORY,
            useClass: UserCommandRepository,
        },
        {
            provide: USER_TOKENS.HANDLERS.USER_MEDIA_HANDLER,
            useClass: UserMediaHandler,
        },
        {
            provide: USER_TOKENS.HANDLERS.USER_PASSWORD_HANDLER,
            useClass: PasswordHandler,
        },
        {
            provide: USER_TOKENS.SERVICES.USER_QUERY_SERVICE,
            useClass: UserQueryService,
        },
        {
            provide: USER_TOKENS.SERVICES.USER_COMMAND_SERVICE,
            useClass: UserCommandService,
        },
        {
            provide: USER_TOKENS.SERVICES.USER_MEDIA_SERVICE,
            useClass: UserMediaService,
        },
    ],
    exports: [
        USER_TOKENS.SERVICES.USER_QUERY_SERVICE,
        USER_TOKENS.SERVICES.USER_COMMAND_SERVICE,
        USER_TOKENS.SERVICES.USER_MEDIA_SERVICE,
        USER_TOKENS.HANDLERS.USER_PASSWORD_HANDLER,
    ],
})
export class UserModule {}
