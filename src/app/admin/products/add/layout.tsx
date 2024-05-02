import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | Thêm sản phẩm',
    description: 'Thêm sản phẩm',
};

export default function EditProductLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
