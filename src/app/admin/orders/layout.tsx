import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | Quản lý đặt hàng',
    description: 'Quản lý đặt hàng',
};

export default function OrderLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
