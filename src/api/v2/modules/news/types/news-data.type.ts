import { CreateNewsDto } from '@v2/modules/news/dto';

export type CreateNewsData = CreateNewsDto & {
    image: string;
    slug: string;
};

export type UpdateNewsData = Partial<Omit<CreateNewsData, 'slug'>> & {
    status?: string;
};
