import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateCategoryDto } from '@v2/modules/category/dto';

export class UpdateCategoryDto extends PartialType(OmitType(CreateCategoryDto, ['name'])) {}
