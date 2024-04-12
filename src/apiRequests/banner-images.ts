import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';

import { BannerImageResponseType } from '@/schemaValidations/banner.schema';

class BannerImageApiRequest {
    async getImages() {
        try {
            const response: BannerImageResponseType =
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
