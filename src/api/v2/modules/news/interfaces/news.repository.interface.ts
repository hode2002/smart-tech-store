import { News } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CreateNewsData, UpdateNewsData } from '@v2/modules/news/types';

export interface INewsQueryRepository {
    findById(id: string): Promise<News>;
    findBySlug(slug: string): Promise<News>;
    findAll(page: number, limit: number): Promise<Pagination<News>>;
}

export interface INewsCommandRepository {
    create(data: CreateNewsData): Promise<News>;
    update(id: string, data: UpdateNewsData): Promise<News>;
    delete(id: string): Promise<boolean>;
}

export interface INewsRepository extends INewsQueryRepository, INewsCommandRepository {}
