import {
    Controller,
    Post,
    Body,
    Patch,
    Delete,
    UseGuards,
    HttpStatus,
    HttpCode,
    Get,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { SuccessResponse } from 'src/common/response';
import { GetUserId } from 'src/common/decorators';
import { DeleteCartDto } from './dto/delete-cart.dto';

@Controller('api/v1/cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async addProductToCart(
        @GetUserId() userId: string,
        @Body() createCartDto: CreateCartDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Add to cart success',
            data: await this.cartService.addProductToCart(
                userId,
                createCartDto,
            ),
        };
    }

    @Get()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async findProductsByUserId(
        @GetUserId() userId: string,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get products from cart success',
            data: await this.cartService.findProductsByUserId(userId),
        };
    }

    @Patch()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateProductQuantity(
        @GetUserId() userId: string,
        @Body() updateCartDto: UpdateCartDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Update quantity success',
            data: await this.cartService.updateProductQuantity(
                userId,
                updateCartDto,
            ),
        };
    }

    @Delete()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async deleteProduct(
        @GetUserId() userId: string,
        @Body() deleteCartDto: DeleteCartDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Remove success',
            data: await this.cartService.deleteProduct(userId, deleteCartDto),
        };
    }
}
