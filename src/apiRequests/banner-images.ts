import { FetchAllBannersResponseType } from '@/apiRequests/admin';
import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';

class BannerImageApiRequest {
    async getImages() {
        try {
            const response: FetchAllBannersResponseType =
                await http.get('/banners');
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

const bannerImageApiRequest = new BannerImageApiRequest();
export default bannerImageApiRequest;
