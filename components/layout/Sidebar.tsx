'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarOff,
    Receipt,
    MessageSquare,
    Users,
    Settings,
    Download,
    Truck,
    Bell,
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';

const adminLinks = [
    { href: '/', label: 'Tableau de bord', icon: LayoutDashboard, section: 'Principal', id: 'nav-dashboard' },
    { href: '/absences', label: 'Absences', icon: CalendarOff, section: 'Principal', id: 'nav-absences' },
    { href: '/frais', label: 'Relevé de frais', icon: Receipt, section: 'Principal', id: 'nav-frais' },
    { href: '/messages', label: 'Messagerie', icon: MessageSquare, section: 'Principal', id: 'nav-messages' },
    { href: '/notifications', label: 'Notifications', icon: Bell, section: 'Principal', id: 'nav-notifications' },
    { href: '/utilisateurs', label: 'Équipe', icon: Users, section: 'Admin', id: 'nav-equipe' },
    { href: '/export', label: 'Export PDF', icon: Download, section: 'Admin', id: 'nav-export' },
    { href: '/parametres', label: 'Paramètres', icon: Settings, section: 'Admin', id: 'nav-parametres' },
];

const conducteurLinks = [
    { href: '/', label: 'Tableau de bord', icon: LayoutDashboard, section: 'Principal', id: 'nav-dashboard' },
    { href: '/absences', label: 'Mes absences', icon: CalendarOff, section: 'Principal', id: 'nav-absences' },
    { href: '/frais', label: 'Mes frais', icon: Receipt, section: 'Principal', id: 'nav-frais' },
    { href: '/messages', label: 'Messages', icon: MessageSquare, section: 'Principal', id: 'nav-messages' },
    { href: '/notifications', label: 'Notifications', icon: Bell, section: 'Principal', id: 'nav-notifications' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isAdmin, isBureau, profile } = useUser();
    const links = isAdmin || isBureau ? adminLinks : conducteurLinks;

    // Group links by section
    const sections = links.reduce((acc, link) => {
        if (!acc[link.section]) acc[link.section] = [];
        acc[link.section].push(link);
        return acc;
    }, {} as Record<string, typeof links>);

    return (
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40"
            style={{
                width: 'var(--sidebar-width)',
                background: 'var(--text)',
                color: 'var(--white)',
                padding: '28px 16px',
            }}>
            {/* Brand */}
            <div id="sidebar-brand" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 8px 28px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '24px',
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'var(--gradient-aurora)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px',
                    color: 'white',
                    flexShrink: 0,
                }}>
                    FT
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px' }}>Flash Transports</span>
                    <span style={{ fontSize: '11px', opacity: 0.45, fontWeight: 500 }}>Portail RH</span>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {Object.entries(sections).map(([section, sectionLinks]) => (
                    <div key={section}>
                        <div style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '1.2px',
                            opacity: 0.35,
                            padding: '16px 12px 8px',
                            fontWeight: 600,
                        }}>
                            {section}
                        </div>
                        {sectionLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    id={link.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '11px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                                        background: isActive ? 'rgba(157,30,0,0.2)' : 'transparent',
                                        transition: 'all var(--transition-fast)',
                                        textDecoration: 'none',
                                        position: 'relative',
                                    }}
                                >
                                    {isActive && (
                                        <span style={{
                                            position: 'absolute',
                                            left: '-16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '3px',
                                            height: '20px',
                                            background: 'var(--primary-light)',
                                            borderRadius: '0 4px 4px 0',
                                        }} />
                                    )}
                                    <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            {profile && (
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'var(--gradient-aurora)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                    }}>
                        {profile.prenom?.[0]}{profile.nom?.[0]}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{profile.prenom} {profile.nom}</span>
                        <span style={{ fontSize: '11px', opacity: 0.4 }}>
                            {profile.role === 'admin' ? 'Administrateur' : profile.role === 'bureau' ? 'Bureau' : 'Conducteur'}
                        </span>
                    </div>
                </div>
            )}
        </aside>
    );
}
