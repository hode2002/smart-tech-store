import http from '@/lib/http';

import { DeliveryResponseType } from '@/schemaValidations/delivery.schema';
import Toast from 'react-native-toast-message';

class DeliveryApiRequest {
    async getDelivery() {
        try {
            const response = await http.get<DeliveryResponseType>('/delivery');
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

const deliveryApiRequest = new DeliveryApiRequest();
export default deliveryApiRequest;
