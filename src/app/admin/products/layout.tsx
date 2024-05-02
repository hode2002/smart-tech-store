import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | Quản lý sản phẩm',
    description: 'Quản lý sản phẩm',
};

export default function ProductLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
