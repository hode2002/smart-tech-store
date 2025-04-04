import { Pagination } from '@/common/types';
import { ComboDetail } from '@/prisma/selectors';
import { ComboWhereInput } from '@v2/modules/product/types';

export interface IComboQueryRepository {
    findAll(page: number, limit: number, where?: ComboWhereInput): Promise<Pagination<ComboDetail>>;
    findById(id: string): Promise<ComboDetail>;
    findMany(where?: ComboWhereInput): Promise<ComboDetail[]>;
}
