export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="min-h-screen container">{children}</div>;
}
