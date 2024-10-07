import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Admin | Quản lý thông báo',
    description: 'Quản lý thông báo',
};

export default function NotificationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
