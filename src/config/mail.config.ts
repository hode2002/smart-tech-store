export default () => ({
    mailVerificationApiKey: process.env.MAIL_VERIFICATION_API_KEY || '',
    mailVerificationUrl: process.env.MAIL_VERIFICATION_URL || '',
    mailHost: process.env.MAIL_HOST || '',
    mailUser: process.env.MAIL_USER || '',
    mailPassword: process.env.MAIL_PASSWORD || '',
    mailFrom: process.env.MAIL_FROM || '',
    mailTransport: process.env.MAIL_TRANSPORT || '',
});
