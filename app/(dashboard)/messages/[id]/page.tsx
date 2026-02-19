'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2, Send, Reply } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import { getMessageById, markAsRead, replyToMessage } from '@/lib/actions/messages';
import type { Message } from '@/types/database';

export default function MessageDetailPage() {
    const params = useParams();
    const { profile } = useUser();
    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [replyError, setReplyError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await getMessageById(params.id as string);
                setMessage(data);
                await markAsRead(params.id as string).catch(() => { });
            } catch {
                void 0;
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params.id]);

    async function handleReply() {
        if (!replyText.trim() || !message) return;
        setSending(true);
        setReplyError('');
        try {
            await replyToMessage(message.id, replyText.trim());
            setSent(true);
            setReplyText('');
        } catch (err) {
            setReplyError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <div style={{ maxWidth: '640px', margin: '0 auto' }} className="glass-card">
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
                </div>
            </div>
        );
    }

    if (!message) {
        return (
            <div style={{ maxWidth: '640px', margin: '0 auto' }} className="glass-card">
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Message introuvable</p>
                    <Link href="/messages" style={{ color: 'var(--primary)', fontSize: '14px', marginTop: '8px', display: 'inline-block', textDecoration: 'none' }}>Retour</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Link href="/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour aux messages
            </Link>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--gradient-aurora)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0,
                        fontSize: '14px',
                    }}>
                        {message.auteur?.prenom?.[0] || 'A'}{message.auteur?.nom?.[0] || 'D'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>{message.titre}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                {message.auteur ? `${message.auteur.prenom} ${message.auteur.nom}` : 'Admin'}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock style={{ width: '12px', height: '12px' }} />
                                {formatDate(message.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                        {message.contenu}
                    </div>
                </div>
            </div>

            {/* Reply section */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                    <Reply style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                    Répondre
                </h2>

                {sent ? (
                    <div style={{
                        padding: '14px 18px',
                        background: 'var(--success-bg)',
                        border: '1px solid rgba(0,220,130,0.2)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#065f46',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}>
                        ✓ Réponse envoyée avec succès
                    </div>
                ) : (
                    <>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Votre réponse..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                background: 'var(--white)',
                                border: '1.5px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                color: 'var(--text)',
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'border-color var(--transition-fast)',
                                minHeight: '80px',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />

                        {replyError && (
                            <p style={{ fontSize: '12px', color: 'var(--error)', fontWeight: 500 }}>{replyError}</p>
                        )}

                        <button
                            onClick={handleReply}
                            disabled={sending || !replyText.trim()}
                            style={{
                                alignSelf: 'flex-end',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: 'var(--radius-sm)',
                                background: (!replyText.trim() || sending) ? 'var(--bg)' : 'var(--primary)',
                                border: 'none',
                                color: (!replyText.trim() || sending) ? 'var(--text-muted)' : 'white',
                                fontSize: '13px',
                                fontWeight: 600,
                                fontFamily: 'inherit',
                                cursor: (!replyText.trim() || sending) ? 'not-allowed' : 'pointer',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            {sending
                                ? <Loader2 style={{ width: '14px', height: '14px' }} className="animate-spin" />
                                : <Send style={{ width: '14px', height: '14px' }} />
                            }
                            {sending ? 'Envoi...' : 'Envoyer'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
