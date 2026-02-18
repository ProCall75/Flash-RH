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
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';

const adminLinks = [
    { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/absences', label: 'Absences', icon: CalendarOff },
    { href: '/frais', label: 'Notes de frais', icon: Receipt },
    { href: '/messages', label: 'Messagerie', icon: MessageSquare },
    { href: '/export', label: 'Export', icon: Download },
    { href: '/utilisateurs', label: 'Utilisateurs', icon: Users },
    { href: '/parametres', label: 'Paramètres', icon: Settings },
];

const conducteurLinks = [
    { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/absences', label: 'Mes absences', icon: CalendarOff },
    { href: '/frais', label: 'Mes frais', icon: Receipt },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isAdmin, isBureau } = useUser();
    const links = isAdmin || isBureau ? adminLinks : conducteurLinks;

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-900/50 border-r border-white/5 fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">Flash RH</h1>
                    <p className="text-xs text-slate-500">Flash Transports</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Version */}
            <div className="px-6 py-4 border-t border-white/5">
                <p className="text-xs text-slate-600">v1.0 — PRAGMA Studio</p>
            </div>
        </aside>
    );
}
