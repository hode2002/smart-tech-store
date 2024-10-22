import Toast from 'react-native-toast-message';
import http from '@/lib/http';

export type NotificationResponseType = {
    statusCode: number;
    message: string;
    data: NotificationType;
};

export type GetAllNotificationResponseType = {
    statusCode: number;
    message: string;
    data: NotificationType[];
};

export type GetUserNotificationResponseType = {
    statusCode: number;
    message: string;
    data: {
        status: number;
        notification: NotificationType;
    }[];
};

export type NotificationType = {
    id: string;
    title: string;
    content: string;
    images: string;
    status: number;
    slug: string;
    link: string;
    type: 'ORDER' | 'COMMON' | 'VOUCHER' | 'COMMENT';
    created_at: Date;
    updated_at: Date;
};

export type CreateNotificationBodyType = {
    title: string;
    content: string;
    images: string;
    type?: string;
    link: string;
};

export type CreateUserNotificationBodyType = {
    user_id: string;
    title: string;
    content: string;
    images: string;
    link: string;
    type?: string;
};

export type UpdateNotificationBodyType = {
    title?: string;
    content?: string;
    images?: string;
    status?: number;
    link?: string;
    type?: string;
};

export type CreateNotificationResponseType = {
    statusCode: number;
    message: string;
    data: NotificationType;
};

export type CreateUserNotificationResponseType = {
    statusCode: number;
    message: string;
    data: {
        notification: NotificationType;
    };
};

export type UpdateNotificationResponseType = {
    statusCode: number;
    message: string;
    data: NotificationType;
};

class NotificationApiRequest {
    async getUserNotification(token: string) {
        try {
            const response: GetUserNotificationResponseType = await http.get(
                '/notifications/users',
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async createNotify(token: string, body: CreateNotificationBodyType) {
        try {
            const response: CreateNotificationResponseType = await http.post(
                '/notifications',
                body,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async createUserNotify(
        token: string,
        body: CreateUserNotificationBodyType,
    ) {
        try {
            const response: CreateUserNotificationResponseType =
                await http.post('/notifications/users', body, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                });
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async updateNotification(
        token: string,
        notificationId: string,
        body: UpdateNotificationBodyType,
    ) {
        try {
            const response: UpdateNotificationResponseType = await http.patch(
                `/notifications/` + notificationId,
                body,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async userReadAllNotifications(token: string) {
        try {
            const response: UpdateNotificationResponseType = await http.post(
                `/notifications/users/read-all`,
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error;
        }
    }

    async create(token: string, body: CreateNotificationBodyType) {
        try {
            const response: NotificationResponseType = await http.post(
                '/notifications',
                body,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error?.payload;
        }
    }

    async getAll(token: string) {
        try {
            const response: GetAllNotificationResponseType = await http.get(
                '/notifications',
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error?.payload;
        }
    }

    async update(
        token: string,
        notificationId: string,
        body: UpdateNotificationBodyType,
    ) {
        try {
            const response: NotificationResponseType = await http.patch(
                '/notifications/' + notificationId,
                body,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error?.payload;
        }
    }

    async delete(token: string, notificationId: string) {
        try {
            const response: NotificationResponseType = await http.delete(
                '/notifications/' + notificationId,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            return response;
        } catch (error: any) {
            Toast.show({
                type: 'Error',
                text1: error?.payload?.message ?? 'Lỗi không xác định',
            });
            return error?.payload;
        }
    }
}

const notificationApiRequest = new NotificationApiRequest();
export default notificationApiRequest;
