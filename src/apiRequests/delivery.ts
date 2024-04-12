import { toast } from '@/components/ui/use-toast';
import http from '@/lib/http';

import { DeliveryResponseType } from '@/schemaValidations/delivery.schema';

class DeliveryApiRequest {
    async getDelivery() {
        try {
            const response = await http.get<DeliveryResponseType>('/delivery');
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

const deliveryApiRequest = new DeliveryApiRequest();
export default deliveryApiRequest;
