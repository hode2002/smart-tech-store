import { PartialType } from '@nestjs/swagger';

import { CreateBannerDto } from '@/api/v2/modules/banner/dto';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
