import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';
import { CategoryResponseType } from '@/schemaValidations/category.schema';

class CategoryApiRequest {
    async getCategories() {
        try {
            const response: CategoryResponseType =
                await http.get('/categories');
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

const categoryApiRequest = new CategoryApiRequest();
export default categoryApiRequest;
