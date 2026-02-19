import { UserProvider } from '@/lib/hooks/useUser';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { OnboardingWrapper } from '@/components/onboarding/OnboardingWrapper';
import '@/app/onboarding.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
                <Sidebar />
                <div style={{ marginLeft: 'var(--sidebar-width)', flex: 1 }} className="max-lg:!ml-0">
                    <Header />
                    <main style={{ padding: '32px 40px', maxWidth: '1280px' }} className="max-md:!p-4 max-md:!pb-24 animate-in">
                        {children}
                    </main>
                </div>
                <MobileNav />
            </div>
            <OnboardingWrapper />
        </UserProvider>
    );
}
