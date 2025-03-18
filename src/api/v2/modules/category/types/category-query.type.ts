import { Prisma } from '@prisma/client';

export type CategoryWhereInput = Omit<Prisma.CategoryWhereInput, 'id' | 'slug'>;
export type CategoryWhereUniqueInput = Omit<Prisma.CategoryWhereInput, 'id'>;
