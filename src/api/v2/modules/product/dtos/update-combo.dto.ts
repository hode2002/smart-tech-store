import { OmitType } from '@nestjs/swagger';

import { CreateComboDto } from '@v2/modules/product/dtos';

export class UpdateComboDto extends OmitType(CreateComboDto, ['items']) {}
