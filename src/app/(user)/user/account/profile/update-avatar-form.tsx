'use client';

import { Avatar } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { UpdateAvatarResponseType } from '@/schemaValidations/account.schema';
import { ReloadIcon } from '@radix-ui/react-icons';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import accountApiRequest from '@/apiRequests/account';
import { setProfile } from '@/lib/store/slices';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function UpdateAvatarForm() {
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.user.profile);
    const token = useAppSelector((state) => state.auth.accessToken);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isCLient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    const handleSubmit = async ({ avatar }: { avatar: File }) => {
        if (loading) return;
        setLoading(true);
        const response: UpdateAvatarResponseType =
            await accountApiRequest.updateAvatar(token, {
                avatar,
            });
        setLoading(false);
        if (response.statusCode === 200) {
            const profile = response.data;
            dispatch(setProfile(profile));
        }
    };

    const validateFile = (event: ChangeEvent<HTMLInputElement>) => {
        const avatar = event.target.files?.[0];
        if (avatar) {
            setFile(null);
            if (inputRef.current) {
                inputRef.current.value = '';
            }

            setFile(avatar);
            handleSubmit({ avatar });
        }
    };

    return (
        <div className='className="w-full mb-4 md:mb-0 md:w-[40%] flex justify-center items-center"'>
            <div className="text-center">
                <div className="flex justify-center">
                    <Label htmlFor="avatar">
                        <Avatar>
                            {isCLient && (
                                <Image
                                    className="w-[150px] h-[150px] rounded-[50%]"
                                    width={150}
                                    height={150}
                                    src={
                                        file
                                            ? URL.createObjectURL(file)
                                            : profile.avatar
                                    }
                                    alt="Avatar"
                                />
                            )}
                        </Avatar>
                    </Label>
                </div>

                <Input
                    className="hidden"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    id="avatar"
                    placeholder="Họ tên..."
                    ref={inputRef}
                    onChange={(e) => validateFile(e)}
                    autoComplete="off"
                />

                {loading ? (
                    <Button
                        disabled
                        variant={'default'}
                        className="mt-4 border w-[98px] h-[36px]"
                    >
                        <ReloadIcon className="h-4 w-4 animate-spin text-center" />
                    </Button>
                ) : (
                    <Label
                        htmlFor="avatar"
                        className="mt-4 inline-flex items-center justify-center text-popover hover:text-popover-foreground bg-popover-foreground hover:cursor-pointer hover:bg-popover whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input  shadow-sm h-9 px-4 py-2"
                    >
                        Chọn ảnh
                    </Label>
                )}

                <div className="mt-4">
                    <div className="opacity-80 text-sm">
                        Dụng lượng file tối đa 1 MB
                    </div>
                    <div className="opacity-80 text-sm">
                        Định dạng:.JPEG, .PNG
                    </div>
                </div>
            </div>
        </div>
    );
}
