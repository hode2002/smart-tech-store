import { FetchAllBannersResponseType } from '@/types/type';
import http from '@/lib/http';
import Toast from 'react-native-toast-message';

class BannerImageApiRequest {
    async getImages() {
        try {
            const response: FetchAllBannersResponseType =
                await http.get('/banners');
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

const bannerImageApiRequest = new BannerImageApiRequest();
export default bannerImageApiRequest;
