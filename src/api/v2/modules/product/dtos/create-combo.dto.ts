import { ApiProperty } from '@nestjs/swagger';
import { ComboStatus, DiscountType } from '@prisma/client';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class ComboItem {
    @ApiProperty({ description: 'Variant ID to include in combo' })
    @IsString()
    @IsNotEmpty()
    variantId: string;

    @ApiProperty({ description: 'Discount percentage for this combo item' })
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @ApiProperty({ description: 'Discount type for this combo item' })
    @IsString()
    @IsNotEmpty()
    discountType: DiscountType;

    @ApiProperty({ description: 'Quantity for this combo item' })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateComboDto {
    @ApiProperty({ description: 'Combo name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Combo description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Main variant ID' })
    @IsString()
    @IsNotEmpty()
    mainVariantId: string;

    @ApiProperty({ description: 'Combo price' })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ description: 'Combo original price' })
    @IsNumber()
    @IsNotEmpty()
    originalPrice: number;

    @ApiProperty({ description: 'Combo discount' })
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @ApiProperty({ description: 'Combo status' })
    @IsString()
    @IsNotEmpty()
    status: ComboStatus;

    @ApiProperty({ description: 'List of combo items', type: [ComboItem] })
    @IsArray()
    @IsNotEmpty()
    items: ComboItem[];

    @ApiProperty({ description: 'Combo start date' })
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({ description: 'Combo end date' })
    @IsDate()
    @IsNotEmpty()
    endDate: Date;
}
