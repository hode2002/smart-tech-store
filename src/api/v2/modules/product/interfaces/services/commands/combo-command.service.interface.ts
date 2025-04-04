import { ComboDetail } from '@/prisma/selectors';
import { CreateComboDto, UpdateComboDto } from '@v2/modules/product/dtos';

export interface IComboCommandService {
    create(createComboDto: CreateComboDto): Promise<ComboDetail>;
    update(id: string, updateComboDto: UpdateComboDto): Promise<ComboDetail>;
    softDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<boolean>;
}
