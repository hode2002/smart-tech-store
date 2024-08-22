import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | Quản lý banner',
    description: 'Quản lý banner',
};

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
