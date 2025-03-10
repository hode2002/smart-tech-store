export interface GHTKCreateResponse {
    success: boolean;
    message: string;
    order: {
        partner_id: string;
        label: string;
        area: number;
        fee: number;
        insurance_fee: number;
        estimated_pick_time: string;
        estimated_deliver_time: string;
        products: {
            name: string;
            weight: number;
            quantity: number;
        }[];
        status_id: number;
        tracking_id: number;
        sorting_code: string;
        date_to_delay_pick: string;
        pick_work_shift: number;
        date_to_delay_deliver: string;
        deliver_work_shift: number;
        is_xfast: number;
    };
    warning_message: string;
}
