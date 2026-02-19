'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError('Email ou mot de passe incorrect');
            setLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            padding: '16px',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-aurora)',
                        marginBottom: '16px',
                        boxShadow: '0 8px 24px rgba(157, 30, 0, 0.25)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '22px',
                    }}>
                        FT
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                        Flash Transports
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>
                        Portail Ressources Humaines
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                marginBottom: '6px',
                            }}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="prenom.nom@flash-transports.fr"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    background: 'var(--white)',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    color: 'var(--text)',
                                    outline: 'none',
                                    transition: 'border-color var(--transition-fast)',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                marginBottom: '6px',
                            }}>
                                Mot de passe
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        paddingRight: '44px',
                                        background: 'var(--white)',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        color: 'var(--text)',
                                        outline: 'none',
                                        transition: 'border-color var(--transition-fast)',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        padding: '2px',
                                    }}
                                >
                                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: 'var(--error-bg)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '12px 16px',
                                color: '#991b1b',
                                fontSize: '13px',
                                fontWeight: 500,
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '12px',
                                justifyContent: 'center',
                                fontSize: '14px',
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 style={{ width: '18px', height: '18px' }} className="animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <a href="/auth/reset-password" style={{
                            fontSize: '13px', color: 'var(--primary)',
                            textDecoration: 'none', fontWeight: 500,
                        }}>
                            Mot de passe oublié ?
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    marginTop: '24px',
                }}>
                    Flash Transports © 2026 — Propulsé par PRAGMA
                </p>
            </div>
        </div>
    );
}
