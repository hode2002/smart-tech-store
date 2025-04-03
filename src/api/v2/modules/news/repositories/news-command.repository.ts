import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { NEWS_FULL_SELECT_WITH_CATEGORY } from '@/prisma/selectors/news';
import { NEWS_MEDIA_DELETE_HANDLER } from '@v2/modules/news/constants';
import { INewsCommandRepository, INewsMediaDeleteHandler } from '@v2/modules/news/interfaces';
import { NewsCreateInput, UpdateNewsData } from '@v2/modules/news/types';

@Injectable()
export class NewsCommandRepository implements INewsCommandRepository {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(NEWS_MEDIA_DELETE_HANDLER)
        private readonly mediaHandler: INewsMediaDeleteHandler,
    ) {}

    async create(data: NewsCreateInput) {
        return this.prisma.$transaction(async tx => {
            try {
                const brand = await tx.news.create({
                    data,
                    select: NEWS_FULL_SELECT_WITH_CATEGORY,
                });
                return brand;
            } catch (error) {
                await this.mediaHandler.deleteImage(data.thumbnail);
                throw new BadRequestException(error);
            }
        });
    }

    async update(id: string, data: UpdateNewsData) {
        return this.prisma.$transaction(async tx => {
            try {
                const news = await tx.news.update({
                    where: { id },
                    data,
                    select: NEWS_FULL_SELECT_WITH_CATEGORY,
                });

                return news;
            } catch (error) {
                await this.mediaHandler.deleteImage(data.thumbnail as string);
                throw new BadRequestException(error);
            }
        });
    }

    async delete(id: string) {
        return this.prisma.$transaction(async tx => {
            try {
                const news = await tx.news.delete({
                    where: { id },
                    select: { thumbnail: true },
                });
                await this.mediaHandler.deleteImage(news.thumbnail);

                return true;
            } catch (error) {
                throw new BadRequestException(error);
            }
        });
    }

    async incrementViewCount(id: string) {
        const result = await this.prisma.news.update({
            where: { id },
            data: { view_count: { increment: 1 } },
        });
        return !!result;
    }
}
