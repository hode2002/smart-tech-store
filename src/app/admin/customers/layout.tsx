import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | Quản lý người dùng',
    description: 'Quản lý người dùng',
};

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
