'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarOff, Receipt, MessageSquare, Bell } from 'lucide-react';

const tabs = [
    { href: '/', label: 'Accueil', icon: LayoutDashboard },
    { href: '/absences', label: 'Absences', icon: CalendarOff },
    { href: '/frais', label: 'Frais', icon: Receipt },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/notifications', label: 'Notifs', icon: Bell },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
            style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderTop: '1px solid var(--border)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                height: '60px',
                padding: '0 4px',
            }}>
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={isActive ? 'mobile-nav-active' : ''}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '3px',
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'all var(--transition-fast)',
                                minWidth: '56px',
                                minHeight: '48px',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                textDecoration: 'none',
                                background: isActive ? 'var(--primary-bg)' : 'transparent',
                            }}
                        >
                            <Icon style={{
                                width: '22px',
                                height: '22px',
                                strokeWidth: isActive ? 2.5 : 2,
                                filter: isActive ? 'drop-shadow(0 0 6px rgba(157,30,0,0.4))' : 'none',
                            }} />
                            <span style={{
                                fontSize: '10px',
                                fontWeight: isActive ? 700 : 500,
                                letterSpacing: isActive ? '0.2px' : '0',
                            }}>{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
