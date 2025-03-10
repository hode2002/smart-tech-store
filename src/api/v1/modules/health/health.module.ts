import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';

import { HealthController } from './health.controller';

@Module({
    imports: [TerminusModule, HttpModule, PrismaModule],
    controllers: [HealthController],
    providers: [PrismaService],
})
export class HealthModule {}
