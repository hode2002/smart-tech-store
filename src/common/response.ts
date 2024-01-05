export class SuccessResponse {
    status: string;
    code: number;
    message?: string;
    data?: any;
}

export class ErrorResponse {
    status: string;
    code: number;
    message?: string;
    error?: number;
}
