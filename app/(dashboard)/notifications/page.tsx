'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, CheckCheck, Loader2, ExternalLink } from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import { getNotifications, markNotificationRead, markAllRead } from '@/lib/actions/notifications';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { Notification } from '@/types/database';

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
}

export default function NotificationsPage() {
    const { profile, loading: userLoading } = useUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [markingAll, setMarkingAll] = useState(false);

    const load = useCallback(async () => {
        if (!profile?.id) return;
        setLoading(true);
        setError('');
        try {
            const data = await getNotifications(profile.id);
            setNotifications(data);
        } catch {
            setError('Erreur lors du chargement des notifications.');
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        if (userLoading) return;
        if (!profile?.id) {
            setLoading(false);
            return;
        }
        load();
    }, [load, userLoading, profile?.id]);

    async function handleMarkRead(id: string) {
        try {
            await markNotificationRead(id);
            setNotifications((prev) =>
                prev.map((n) => n.id === id ? { ...n, lue: true, lue_at: new Date().toISOString() } : n)
            );
        } catch {
            void 0;
        }
    }

    async function handleMarkAllRead() {
        if (!profile?.id) return;
        setMarkingAll(true);
        try {
            await markAllRead(profile.id);
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, lue: true, lue_at: new Date().toISOString() }))
            );
        } catch {
            void 0;
        } finally {
            setMarkingAll(false);
        }
    }

    const unreadCount = notifications.filter((n) => !n.lue).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <ErrorBanner message={error} onRetry={load} />}

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>
                        Notifications
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                        {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes lues'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        disabled={markingAll}
                        className="btn btn-outline"
                        style={{ fontSize: '12px', padding: '8px 16px' }}
                    >
                        {markingAll ? <Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" /> : <CheckCheck style={{ width: '14px', height: '14px' }} />}
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {loading && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
                </div>
            )}

            {!loading && notifications.length === 0 && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Bell style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Aucune notification</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Vous serez notifié des actions importantes ici.</p>
                </div>
            )}

            {!loading && notifications.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => !notif.lue && handleMarkRead(notif.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '14px',
                                padding: '16px 20px',
                                background: notif.lue ? 'var(--white)' : 'var(--primary-bg)',
                                border: `1px solid ${notif.lue ? 'var(--border)' : 'rgba(157, 30, 0, 0.12)'}`,
                                borderRadius: 'var(--radius-sm)',
                                cursor: notif.lue ? 'default' : 'pointer',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-sm)',
                                background: notif.lue ? 'var(--bg)' : 'var(--primary-bg)',
                                color: notif.lue ? 'var(--text-muted)' : 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                {notif.lue ? <Check style={{ width: '16px', height: '16px' }} /> : <Bell style={{ width: '16px', height: '16px' }} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                    <h3 style={{
                                        fontSize: '14px',
                                        fontWeight: notif.lue ? 500 : 700,
                                        color: 'var(--text)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {notif.titre}
                                    </h3>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                        {timeAgo(notif.created_at)}
                                    </span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                                    {notif.contenu}
                                </p>
                                {notif.lien && (
                                    <a
                                        href={notif.lien}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '12px',
                                            color: 'var(--primary)',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            marginTop: '6px',
                                        }}
                                    >
                                        Voir <ExternalLink style={{ width: '12px', height: '12px' }} />
                                    </a>
                                )}
                            </div>
                            {!notif.lue && (
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    flexShrink: 0,
                                    marginTop: '6px',
                                }} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
