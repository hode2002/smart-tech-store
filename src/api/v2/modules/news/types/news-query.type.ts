import { Prisma } from '@prisma/client';

export type NewsWhereInput = Omit<Prisma.NewsWhereInput, 'id' | 'slug'>;
export type NewsWhereUniqueInput = Omit<Prisma.NewsWhereUniqueInput, 'id'>;
