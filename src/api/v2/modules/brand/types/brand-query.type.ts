import { Prisma } from '@prisma/client';

export type BrandWhereInput = Omit<Prisma.BrandWhereInput, 'id' | 'slug'>;
export type BrandWhereUniqueInput = Omit<Prisma.BrandWhereInput, 'id'>;
