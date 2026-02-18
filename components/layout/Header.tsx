'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import { Bell, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const { profile, loading } = useUser();
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleLogout() {
        setLoggingOut(true);
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    }

    const roleLabels: Record<string, string> = {
        admin: 'Administrateur',
        bureau: 'Bureau',
        conducteur: 'Conducteur',
    };

    return (
        <header className="h-16 border-b border-white/5 bg-slate-900/30 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left: Page title area */}
            <div />

            {/* Right: User info + actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Profile */}
                {loading ? (
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                ) : profile ? (
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">
                                {profile.prenom} {profile.nom}
                            </p>
                            <p className="text-xs text-slate-500">
                                {roleLabels[profile.role] || profile.role}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                            {profile.prenom?.[0]}{profile.nom?.[0]}
                        </div>
                    </div>
                ) : null}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    {loggingOut ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5" />
                    )}
                </button>
            </div>
        </header>
    );
}
