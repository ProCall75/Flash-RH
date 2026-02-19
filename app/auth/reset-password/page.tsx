'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback`,
        });

        if (authError) {
            setError('Erreur lors de l\'envoi. Vérifiez votre email.');
            setLoading(false);
            return;
        }

        setSent(true);
        setLoading(false);
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'var(--bg)', padding: '16px',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '64px', height: '64px', borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-aurora)', marginBottom: '16px',
                        boxShadow: '0 8px 24px rgba(157, 30, 0, 0.25)',
                        color: 'white', fontWeight: 800, fontSize: '22px',
                    }}>FT</div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                        Réinitialiser le mot de passe
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>
                        Un lien de réinitialisation sera envoyé à votre email
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '32px' }}>
                    {sent ? (
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <CheckCircle style={{ width: '48px', height: '48px', color: 'var(--success)' }} />
                            <div>
                                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                                    Email envoyé !
                                </p>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    Consultez votre boîte mail <strong>{email}</strong> et suivez le lien de réinitialisation.
                                </p>
                            </div>
                            <Link href="/login" className="btn btn-primary" style={{ marginTop: '8px', padding: '10px 24px', fontSize: '14px' }}>
                                Retour à la connexion
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label htmlFor="email" style={{
                                    display: 'block', fontSize: '12px', fontWeight: 600,
                                    color: 'var(--text-muted)', marginBottom: '6px',
                                }}>Email</label>
                                <input
                                    id="email" type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required placeholder="prenom.nom@flash-transports.fr"
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        background: 'var(--white)', border: '1.5px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit',
                                        color: 'var(--text)', outline: 'none',
                                        transition: 'border-color var(--transition-fast)',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                />
                            </div>

                            {error && (
                                <div style={{
                                    background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)',
                                    borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                                    color: '#991b1b', fontSize: '13px', fontWeight: 500,
                                }}>{error}</div>
                            )}

                            <button type="submit" disabled={loading || !email} className="btn btn-primary" style={{
                                width: '100%', padding: '12px', justifyContent: 'center', fontSize: '14px',
                                opacity: (loading || !email) ? 0.6 : 1,
                                cursor: (loading || !email) ? 'not-allowed' : 'pointer',
                            }}>
                                {loading ? (
                                    <><Loader2 style={{ width: '18px', height: '18px' }} className="animate-spin" /> Envoi...</>
                                ) : (
                                    <><Send style={{ width: '18px', height: '18px' }} /> Envoyer le lien</>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Link href="/login" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                        ← Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
