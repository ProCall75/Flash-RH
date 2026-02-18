'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarOff, Receipt, MessageSquare } from 'lucide-react';

const tabs = [
    { href: '/', label: 'Accueil', icon: LayoutDashboard },
    { href: '/absences', label: 'Absences', icon: CalendarOff },
    { href: '/frais', label: 'Frais', icon: Receipt },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all min-w-[64px] ${isActive
                                    ? 'text-blue-400'
                                    : 'text-slate-500 active:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]' : ''}`} />
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
