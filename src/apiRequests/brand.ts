import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';
import { BrandResponseType } from '@/schemaValidations/brand.schema';

class BrandApiRequest {
    async getBrands() {
        try {
            const response: BrandResponseType = await http.get('/brands');
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

    async getByCategoryName(slug: string) {
        try {
            const response: BrandResponseType = await http.get(
                '/brands/category/' + slug,
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

const brandApiRequest = new BrandApiRequest();
export default brandApiRequest;
