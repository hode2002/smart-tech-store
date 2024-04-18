import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import UpdateProfileForm from './update-profile-form';
import UpdateAvatarForm from './update-avatar-form';

export default function ProfilePage() {
    return (
        <div className="grid gap-6">
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-xl">Hồ Sơ Của Tôi</CardTitle>
                    <CardDescription>
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col-reverse md:flex-row">
                        <UpdateProfileForm />
                        <UpdateAvatarForm />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
