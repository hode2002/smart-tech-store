import { Pagination } from '@/common/types';
import { NewsFullWithCategory } from '@/prisma/selectors/news';
import { NewsCreateInput, UpdateNewsData, NewsWhereInput } from '@v2/modules/news/types';

export interface INewsQueryRepository {
    findById(id: string): Promise<NewsFullWithCategory>;
    findBySlug(slug: string): Promise<NewsFullWithCategory>;
    findAll(
        page: number,
        limit: number,
        where?: NewsWhereInput,
    ): Promise<Pagination<NewsFullWithCategory>>;
}

export interface INewsCommandRepository {
    create(data: NewsCreateInput): Promise<NewsFullWithCategory>;
    update(id: string, data: UpdateNewsData): Promise<NewsFullWithCategory>;
    delete(id: string): Promise<boolean>;
    incrementViewCount(id: string): Promise<boolean>;
}

export interface INewsRepository extends INewsQueryRepository, INewsCommandRepository {}
