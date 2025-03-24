import * as otpGenerator from 'otp-generator';

export const generateOtp = () => {
    const code = otpGenerator.generate(6, {
        specialChars: false,
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
    });

    return code;
};
