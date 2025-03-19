import { Delivery } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CreateDeliveryDto, UpdateDeliveryDto } from '@v2/modules/delivery/dto';
import { DeliveryWhereInput } from '@v2/modules/delivery/types';

export interface IDeliveryQueryRepository {
    findById(id: string, where?: DeliveryWhereInput): Promise<Delivery>;
    findBySlug(slug: string, where?: DeliveryWhereInput): Promise<Delivery>;
    findAll(page: number, limit: number, where?: DeliveryWhereInput): Promise<Pagination<Delivery>>;
}

export interface IDeliveryCommandRepository {
    create(data: CreateDeliveryDto): Promise<Delivery>;
    update(id: string, data: UpdateDeliveryDto): Promise<Delivery>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
}

export interface IDeliveryRepository extends IDeliveryQueryRepository, IDeliveryCommandRepository {}
