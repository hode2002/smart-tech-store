import { PartialType } from '@nestjs/mapped-types';
import { RemoveProductDto } from './remove-product.dto';

export class RestoreProductDto extends PartialType(RemoveProductDto) {}
