import Toast from 'react-native-toast-message';
import http from '@/lib/http';
import { BrandResponseType } from '@/schemaValidations/brand.schema';

class BrandApiRequest {
    async getBrands() {
        try {
            const response: BrandResponseType = await http.get('/brands');
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
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
            Toast.show({
                type: 'error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }
}

const brandApiRequest = new BrandApiRequest();
export default brandApiRequest;
