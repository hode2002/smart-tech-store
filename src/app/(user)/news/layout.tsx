export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="p-2 md:container">{children}</div>;
}
