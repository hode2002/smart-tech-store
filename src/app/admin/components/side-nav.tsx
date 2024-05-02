import Aside from '@/app/admin/components/aside';
import Header from '@/app/admin/components/header';

const SideNav = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Aside />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />
                {children}
            </div>
        </div>
    );
};

export default SideNav;
