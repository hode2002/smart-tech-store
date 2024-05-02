'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminBreadcrumb = () => {
    const currentPath = usePathname();
    const paths = currentPath.split('/admin/')?.[1];

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        {paths !== 'dashboard' && (
                            <Link href="/admin/dashboard">Dashboard</Link>
                        )}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {paths !== 'dashboard' &&
                    paths?.split('/').map((path, index) => {
                        return (
                            <span
                                className="flex justify-center gap-2 items-center"
                                key={index}
                            >
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    {index === paths?.split('/').length - 1 ? (
                                        <BreadcrumbPage>{path}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={'/admin/' + path}>
                                                {path}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </span>
                        );
                    })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default AdminBreadcrumb;
