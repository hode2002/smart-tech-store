import AccountNav from '@/app/user/account/account-nav';
export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[250px_1fr]">
                    <AccountNav />
                    {children}
                </div>
            </div>
        </div>
    );
}
