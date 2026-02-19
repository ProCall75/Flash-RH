'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/hooks/useUser';
import { Bell, LogOut, Loader2, Compass } from 'lucide-react';
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

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <header style={{
            height: '64px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
        }}>
            {/* Left: Date — hidden on mobile */}
            <div className="desktop-only">
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'capitalize' }}>
                    {today}
                </p>
            </div>
            {/* Left: Brand on mobile */}
            <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '28px', height: '28px', background: 'var(--gradient-aurora)',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '11px', color: 'white',
                }}>FT</div>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>Flash RH</span>
            </div>

            {/* Right: Notifications + User + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Onboarding Trigger */}
                <button
                    onClick={() => (window as any).__startOnboarding?.()}
                    className="desktop-only"
                    title="Visite guidée"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(157,30,0,0.08), rgba(196,54,10,0.12))',
                        border: '1px solid rgba(157,30,0,0.15)',
                        cursor: 'pointer',
                        color: 'var(--primary)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Compass style={{ width: '15px', height: '15px' }} />
                    Découvrir
                </button>

                {/* Notifications */}
                <button id="header-notifications" style={{
                    position: 'relative',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    transition: 'all var(--transition-fast)',
                }}>
                    <Bell style={{ width: '20px', height: '20px' }} />
                    <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '16px',
                        height: '16px',
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        3
                    </span>
                </button>

                {/* Profile */}
                {loading ? (
                    <Loader2 style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} className="animate-spin" />
                ) : profile ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="desktop-only" style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                                {profile.prenom} {profile.nom}
                            </p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {roleLabels[profile.role] || profile.role}
                            </p>
                        </div>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'var(--gradient-aurora)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 700,
                        }}>
                            {profile.prenom?.[0]}{profile.nom?.[0]}
                        </div>
                    </div>
                ) : null}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        transition: 'all var(--transition-fast)',
                    }}
                >
                    {loggingOut ? (
                        <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" />
                    ) : (
                        <LogOut style={{ width: '20px', height: '20px' }} />
                    )}
                </button>
            </div>
        </header>
    );
}
