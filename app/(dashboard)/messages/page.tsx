'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MessageSquare, Bell, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useUser } from '@/lib/hooks/useUser';
import { getMessages } from '@/lib/actions/messages';
import type { Message, MessageType } from '@/types/database';

const typeIcons: Record<MessageType, typeof Bell> = {
    note_service: FileText,
    info: MessageSquare,
    rappel: Bell,
    urgent: AlertTriangle,
};

const typeStyles: Record<MessageType, { bg: string; color: string }> = {
    note_service: { bg: 'var(--info-bg)', color: '#1e40af' },
    info: { bg: 'rgba(100,116,139,0.1)', color: '#64748b' },
    rappel: { bg: 'var(--warning-bg)', color: '#92400e' },
    urgent: { bg: 'var(--error-bg)', color: '#991b1b' },
};

export default function MessagesPage() {
    const { isAdmin, isBureau, profile } = useUser();
    const [filter, setFilter] = useState<MessageType | 'tous'>('tous');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await getMessages();
                setMessages(data);
            } catch {
                void 0;
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = filter === 'tous'
        ? messages
        : messages.filter((m) => m.type === filter);

    const filterButtons = [
        { key: 'tous' as const, label: 'Tous' },
        { key: 'urgent' as const, label: 'Urgents' },
        { key: 'note_service' as const, label: 'Notes' },
        { key: 'rappel' as const, label: 'Rappels' },
        { key: 'info' as const, label: 'Infos' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>Messagerie</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Communication interne</p>
                </div>
                {(isAdmin || isBureau) && (
                    <Link href="/messages/nouveau" className="btn btn-primary" style={{ fontSize: '13px' }}>
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Nouveau message
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg)', padding: '4px', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
                {filterButtons.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            background: filter === key ? 'var(--white)' : 'transparent',
                            fontFamily: 'inherit',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: filter === key ? 'var(--text)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                            boxShadow: filter === key ? 'var(--shadow-xs)' : 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
                </div>
            )}

            {/* Messages */}
            {!loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filtered.map((msg) => {
                        const Icon = typeIcons[msg.type] || MessageSquare;
                        const style = typeStyles[msg.type] || typeStyles.info;
                        const userId = profile?.id || '';
                        const isRead = (msg.lu_par || []).includes(userId);
                        return (
                            <Link
                                key={msg.id}
                                href={`/messages/${msg.id}`}
                                className="glass-card"
                                style={{
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '16px',
                                    textDecoration: 'none',
                                    borderLeft: !isRead ? '3px solid var(--primary)' : '3px solid transparent',
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    background: style.bg,
                                    color: style.color,
                                }}>
                                    <Icon style={{ width: '20px', height: '20px' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <p style={{
                                            fontSize: '14px',
                                            fontWeight: !isRead ? 700 : 500,
                                            color: 'var(--text)',
                                        }}>
                                            {msg.titre}
                                        </p>
                                        {!isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        {msg.auteur ? `${msg.auteur.prenom} ${msg.auteur.nom}` : 'Admin'} — {formatDate(msg.created_at)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                            <MessageSquare style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Aucun message</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
