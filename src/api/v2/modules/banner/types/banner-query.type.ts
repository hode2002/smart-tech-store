import { Prisma } from '@prisma/client';

export type BannerWhereInput = Omit<Prisma.BannerWhereInput, 'id' | 'slug'>;
export type BannerWhereUniqueInput = Omit<Prisma.BannerWhereUniqueInput, 'id'>;
