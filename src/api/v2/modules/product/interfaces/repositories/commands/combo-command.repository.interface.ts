import { ComboDetail } from '@/prisma/selectors';
import { ComboCreateInput, ComboUpdateInput } from '@v2/modules/product/types';

export interface IComboCommandRepository {
    create(comboCreateInput: ComboCreateInput): Promise<ComboDetail>;
    update(comboId: string, comboUpdateInput: ComboUpdateInput): Promise<ComboDetail>;
    softDelete(comboId: string): Promise<boolean>;
    restore(comboId: string): Promise<boolean>;
}
