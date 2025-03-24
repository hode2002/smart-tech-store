import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserAddressDto {
    @IsOptional()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    province: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsNotEmpty()
    @IsString()
    ward: string;

    @IsOptional()
    @IsString()
    hamlet: string;
}
