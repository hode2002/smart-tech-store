import { Prisma } from '@prisma/client';

export type DeliveryWhereInput = Omit<Prisma.DeliveryWhereInput, 'id' | 'slug'>;
export type DeliveryWhereUniqueInput = Omit<Prisma.DeliveryWhereInput, 'id'>;
