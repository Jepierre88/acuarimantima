export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="mx-auto flex-grow auth-bg w-full h-full">
            {children}
        </main>
    );
}
