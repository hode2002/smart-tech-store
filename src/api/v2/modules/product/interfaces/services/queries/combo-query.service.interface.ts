import { Pagination } from '@/common/types';
import { ComboDetail } from '@/prisma/selectors';

export interface IComboQueryService {
    findById(id: string): Promise<ComboDetail>;
    findAll(page: number, limit: number): Promise<Pagination<ComboDetail>>;
    findAllManagement(page: number, limit: number): Promise<Pagination<ComboDetail>>;
}
