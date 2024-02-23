export class EmailVerificationDto {
    username: string;
    domain: string;
    emailAddress: string;
    formatCheck: string;
    smtpCheck: string;
    dnsCheck: string;
    freeCheck: string;
    disposableCheck: string;
    catchAllCheck: string;
    mxRecords: Array<string>;
    audit: {
        auditCreatedDate: Date;
        auditUpdatedDate: Date;
    };
}
