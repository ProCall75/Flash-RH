import { UserProvider } from '@/lib/hooks/useUser';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <div className="min-h-screen bg-slate-950">
                <Sidebar />
                <div className="lg:ml-64">
                    <Header />
                    <main className="p-4 md:p-6 pb-24 lg:pb-6 animate-in">
                        {children}
                    </main>
                </div>
                <MobileNav />
            </div>
        </UserProvider>
    );
}
