import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateProductDto, CreateVariantDto } from '@v2/modules/product/dtos';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['variants'])) {}

export class UpdateVariantDto extends PartialType(CreateVariantDto) {}
