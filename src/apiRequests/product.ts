import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';
import {
    ProductPaginationResponseType,
    ProductResponseType,
} from '@/schemaValidations/product.schema';

class ProductApiRequest {
    async getProducts() {
        try {
            const response: ProductPaginationResponseType =
                await http.get('/products?page=1');
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }

    async getProductsSale() {
        try {
            const response: ProductResponseType =
                await http.get('/products/sale');
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }

    async getProductsByBrand(slug: string) {
        try {
            const response: ProductResponseType = await http.get(
                '/products/brand/' + slug,
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }

    async getProductsByCategory(slug: string) {
        try {
            const response: ProductResponseType = await http.get(
                '/products/category/' + slug,
            );
            return response;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.payload?.message ?? 'Lỗi không xác định',
                variant: 'destructive',
            });
            return error;
        }
    }
}

const productApiRequest = new ProductApiRequest();
export default productApiRequest;
