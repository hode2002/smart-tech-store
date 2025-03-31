import { ProductCartResponse } from '@/prisma/selectors/cart/cart.selector';
import {
    CreateCartDto,
    UpdateCartDto,
    ChangeProductOptionDto,
    DeleteCartDto,
} from '@v2/modules/cart/dto';

export interface ICartQueryService {
    findUserCart(userId: string, productOptionId: string): Promise<any>;
    findProductsByUserId(userId: string): Promise<ProductCartResponse[]>;
    convertResponse(productCartDB: any): ProductCartResponse;
}

export interface ICartCommandService {
    addProductToCart(userId: string, createCartDto: CreateCartDto): Promise<ProductCartResponse>;
    changeProductOption(
        userId: string,
        changeProductOptionDto: ChangeProductOptionDto,
    ): Promise<ProductCartResponse>;
    updateProductQuantity(
        userId: string,
        updateCartDto: UpdateCartDto,
    ): Promise<ProductCartResponse>;
    deleteProduct(userId: string, deleteCartDto: DeleteCartDto): Promise<{ is_success: boolean }>;
}
