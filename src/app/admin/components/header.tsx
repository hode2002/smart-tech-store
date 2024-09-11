'use client';

import AdminBreadcrumb from '@/app/admin/components/admin-breadcrumb';
import { UserNav } from '@/app/admin/components/user-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Home,
    ImagePlus,
    Package,
    Package2,
    PanelLeft,
    Settings,
    ShoppingCart,
    Users2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
    const currentPath = usePathname();
    const isActive = (path: string) => currentPath.includes(path);

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                            href="/admin/dashboard"
                            className={`flex items-center gap-4 px-2.5 ${isActive('/admin/dashboard') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Home className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/orders"
                            className={`flex items-center gap-4 px-2.5 ${isActive('/admin/orders') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Orders
                        </Link>
                        <Link
                            href="/admin/products"
                            className={`flex items-center gap-4 px-2.5 ${isActive('/admin/products') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Package className="h-5 w-5" />
                            Products
                        </Link>
                        <Link
                            href="/admin/customers"
                            className={`flex items-center gap-4 px-2.5 ${isActive('/admin/customers') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Users2 className="h-5 w-5" />
                            Customers
                        </Link>
                        <Link
                            href="/admin/banners"
                            className={`flex items-center gap-4 px-2.5 ${isActive('/admin/banners') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <ImagePlus className="h-5 w-5" />
                            Banners
                        </Link>
                        <Link
                            href="#"
                            className={`flex items-center gap-4 px-2.5 ${isActive('/admin/settings') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <AdminBreadcrumb />
            <div className="relative ml-auto flex-1 md:grow-0 flex gap-2">
                <ModeToggle />
            </div>
            <UserNav />
        </header>
    );
};

export default Header;
