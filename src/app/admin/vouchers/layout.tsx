import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Admin | Quản lý mã giảm giá',
    description: 'Quản lý mã giảm giá',
};

export default function VoucherLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
