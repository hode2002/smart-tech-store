'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    BellPlus,
    Home,
    ImagePlus,
    Newspaper,
    Package,
    Package2,
    Settings,
    ShoppingCart,
    Users2,
    TicketCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Aside = () => {
    const currentPath = usePathname();
    const isActive = (path: string) => currentPath.includes(path);

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 py-4">
                <Link
                    href="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/dashboard"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/dashboard') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <Home className="h-5 w-5" />
                            <span className="sr-only">Dashboard</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/orders"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/orders') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Orders</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Orders</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/products"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/products') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <Package className="h-5 w-5" />
                            <span className="sr-only">Products</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Products</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/customers"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/customers') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <Users2 className="h-5 w-5" />
                            <span className="sr-only">Customers</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Customers</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/banners"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/banners') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <ImagePlus className="h-5 w-5" />
                            <span className="sr-only">Banners</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Banners</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/news"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/news') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <Newspaper className="h-5 w-5" />
                            <span className="sr-only">News</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">News</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/vouchers"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/vouchers') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <TicketCheck className="h-5 w-5" />
                            <span className="sr-only">Vouchers</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right"> Vouchers</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/admin/notifications"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/notifications') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <BellPlus className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Notifications</TooltipContent>
                </Tooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="#"
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive('/admin/settings') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    );
};

export default Aside;
