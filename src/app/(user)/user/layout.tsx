export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="md:container">{children}</div>;
}
