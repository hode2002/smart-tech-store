import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { icons } from '@/constants';
import InputField from '@/components/InputField';
import ReactNativeModal from 'react-native-modal';
import { Button } from '@/components/Button';
import { timeConvert } from '@/lib/utils';
import authApiRequest, {
    ActiveUserEmailResponseType,
} from '@/lib/apiRequest/auth';
import { RegisterResType } from '@/schemaValidations/auth.schema';
import Toast from 'react-native-toast-message';

const RegisterOTPModal = ({
    email,
    loading,
    verification,
    setVerification,
    setShowCreatePasswordModal,
}: {
    email: string;
    loading: boolean;
    verification: {
        state: string;
        error: string;
        code: string;
    };
    setVerification: React.Dispatch<
        React.SetStateAction<{
            state: string;
            error: string;
            code: string;
        }>
    >;
    setShowCreatePasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [timeCounter, setTimeCounter] = useState<number>(300);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timeCounter > 0) {
            interval = setInterval(() => {
                setTimeCounter(timeCounter - 1);
            }, 1000);
        } else {
            setVerification({
                state: 'default',
                error: '',
                code: '',
            });
        }
        return () => clearInterval(interval);
    }, [timeCounter, setVerification]);

    const resendOtp = async () => {
        const response: RegisterResType = await authApiRequest.resendOtp({
            email,
        });
        if (response.statusCode === 200) {
            setTimeCounter(300);
            Toast.show({
                text1: response.message,
            });
        }
    };

    const onPressVerify = async () => {
        if (loading) return;
        if (verification.code.length !== 6) {
            return setVerification({
                ...verification,
                error: 'Mã OTP không hợp lệ!',
                state: 'pending',
            });
        }
        const response: ActiveUserEmailResponseType =
            await authApiRequest.activeUserEmail({
                email,
                otpCode: verification.code,
            });
        if (response.statusCode !== 200) {
            return setVerification({
                ...verification,
                error: response.message,
                state: 'pending',
            });
        }
        setVerification({
            ...verification,
            state: 'success',
        });
    };

    return (
        <ReactNativeModal
            isVisible={verification.state === 'pending'}
            onModalHide={() => {
                if (verification.state === 'success') {
                    setShowCreatePasswordModal(true);
                }
            }}
        >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="font-JakartaExtraBold text-2xl mb-2">
                    Nhập mã xác thực OTP
                </Text>
                <Text className="font-Jakarta mb-5">
                    Chúng tôi đã gửi mã xác thực tới {email}.
                </Text>
                <InputField
                    label={'OTP Code'}
                    icon={icons.lock}
                    placeholder={'123456'}
                    value={verification.code}
                    keyboardType="numeric"
                    onChangeText={(code) =>
                        setVerification({ ...verification, code })
                    }
                />
                {verification.error && (
                    <Text className="text-red-500 text-sm mt-1">
                        {verification.error}
                    </Text>
                )}
                <View className="flex flex-col justify-center items-center mt-2 mb-8">
                    <Text>{timeConvert(timeCounter)}</Text>
                    <Text
                        onPress={resendOtp}
                        className="text-blue-500 underline font-JakartaMedium"
                    >
                        Gửi lại
                    </Text>
                </View>
                <View>
                    {loading ? (
                        <View className="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md">
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    ) : (
                        <Button
                            onPress={onPressVerify}
                            label="Xác nhận"
                            labelClasses="mt-4 font-JakartaBold bg-black text-white px-5 py-3 min-w-[120px] rounded-md"
                        />
                    )}
                </View>
            </View>
        </ReactNativeModal>
    );
};

export default RegisterOTPModal;
