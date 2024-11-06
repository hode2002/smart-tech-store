import Toast from 'react-native-toast-message';
import http from '@/lib/http';
import { CategoryResponseType } from '@/schemaValidations/category.schema';

class CategoryApiRequest {
    async getCategories() {
        try {
            const response: CategoryResponseType =
                await http.get('/categories');
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }
}

const categoryApiRequest = new CategoryApiRequest();
export default categoryApiRequest;
