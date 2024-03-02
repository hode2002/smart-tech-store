export interface GHTKShippingFeeResponse {
    success: boolean;
    message: string;
    fee: {
        name: string;
        fee: number;
        insurance_fee: number;
        include_vat: string;
        cost_id: string;
        delivery_type: string;
        a: string;
        dt: string;
        extFees: [
            {
                display: string;
                title: string;
                amount: number;
                type: string;
            },
        ];
        ship_fee_only: number;
        promotion_key: string;
        delivery: boolean;
    };
}
