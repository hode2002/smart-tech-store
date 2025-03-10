import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { GetUserId, ResponseMessage } from '@/common/decorators';
import { AtJwtGuard } from '@v1/modules/auth/guards';
import {
    ChangeProductOptionDto,
    CreateCartDto,
    DeleteCartDto,
    UpdateCartDto,
} from '@v1/modules/cart/dto';

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    @ResponseMessage('Add to cart success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async addProductToCart(@GetUserId() userId: string, @Body() createCartDto: CreateCartDto) {
        return await this.cartService.addProductToCart(userId, createCartDto);
    }

    @Post('change-product-option')
    @ResponseMessage('Add to cart success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async changeProductOption(
        @GetUserId() userId: string,
        @Body() changeProductOptionDto: ChangeProductOptionDto,
    ) {
        return await this.cartService.changeProductOption(userId, changeProductOptionDto);
    }

    @Get()
    @ResponseMessage('Get products from cart success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async findProductsByUserId(@GetUserId() userId: string) {
        return await this.cartService.findProductsByUserId(userId);
    }

    @Patch()
    @ResponseMessage('Update quantity success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateProductQuantity(@GetUserId() userId: string, @Body() updateCartDto: UpdateCartDto) {
        return await this.cartService.updateProductQuantity(userId, updateCartDto);
    }

    @Delete()
    @ResponseMessage('Remove success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async deleteProduct(@GetUserId() userId: string, @Body() deleteCartDto: DeleteCartDto) {
        return await this.cartService.deleteProduct(userId, deleteCartDto);
    }
}
