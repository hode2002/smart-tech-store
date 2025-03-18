import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CommonService } from '@v2/modules/common/common.service';

@Module({
    providers: [PrismaService, CommonService],
    exports: [PrismaService, CommonService],
})
export class CommonModule {}
