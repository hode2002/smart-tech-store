import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Admin | Quản lý tin tức',
    description: 'Quản lý tin tức',
};

export default function NotificationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
