import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UpdateAddressForm from '@/app/user/account/address/update-address-form';

export default function AddressPage() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl px-5">
                        Địa chỉ của tôi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UpdateAddressForm />
                </CardContent>
            </Card>
        </div>
    );
}
