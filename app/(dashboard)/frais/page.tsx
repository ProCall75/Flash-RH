'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Receipt, Loader2 } from 'lucide-react';
import { formatCurrency, getStatutColor, getStatutLabel, formatDateShort } from '@/lib/utils';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useUser } from '@/lib/hooks/useUser';
import { getReleves, getPeriodeActive } from '@/lib/actions/frais';
import type { ReleveFrais, ReleveStatut, PeriodeFrais } from '@/types/database';

export default function FraisPage() {
    const { isAdmin, isBureau } = useUser();
    const [filter, setFilter] = useState<ReleveStatut | 'tous'>('tous');
    const [releves, setReleves] = useState<ReleveFrais[]>([]);
    const [periode, setPeriode] = useState<PeriodeFrais | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [r, p] = await Promise.all([
                    getReleves(),
                    getPeriodeActive().catch(() => null),
                ]);
                setReleves(r);
                setPeriode(p);
            } catch {
                setError('Erreur lors du chargement des frais.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = filter === 'tous'
        ? releves
        : releves.filter((r) => r.statut === filter);

    const filterButtons = [
        { key: 'tous' as const, label: 'Tous' },
        { key: 'brouillon' as const, label: 'Brouillons' },
        { key: 'soumis' as const, label: 'Soumis' },
        { key: 'valide' as const, label: 'Validés' },
        { key: 'corrige' as const, label: 'Corrigés' },
        { key: 'conteste' as const, label: 'Contestés' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>
                        {isAdmin || isBureau ? 'Relevé de frais' : 'Mes frais'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                        {periode
                            ? `Période du ${formatDateShort(periode.date_debut)} au ${formatDateShort(periode.date_fin)}`
                            : 'Aucune période active'}
                    </p>
                </div>
                {(!isAdmin && !isBureau) && (
                    <Link href="/frais/saisie" className="btn btn-primary" style={{ fontSize: '13px' }}>
                        <Plus style={{ width: '16px', height: '16px' }} />
                        <span className="hidden sm:inline">Saisir mes frais</span>
                    </Link>
                )}
                {(isAdmin || isBureau) && (
                    <Link href="/export" className="btn btn-primary" style={{ fontSize: '13px' }}>
                        📥 Export PDF
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg)', padding: '4px', borderRadius: 'var(--radius-sm)', width: 'fit-content', overflowX: 'auto' }}>
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

            {/* List */}
            {!loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map((releve) => {
                        const iconStyle = releve.statut === 'brouillon'
                            ? { bg: 'rgba(100,116,139,0.1)', color: '#64748b' }
                            : releve.statut === 'soumis'
                                ? { bg: 'var(--info-bg)', color: '#1e40af' }
                                : releve.statut === 'valide'
                                    ? { bg: 'var(--success-bg)', color: '#065f46' }
                                    : { bg: 'var(--warning-bg)', color: '#92400e' };

                        return (
                            <Link
                                key={releve.id}
                                href={releve.statut === 'brouillon' ? `/frais/saisie?releve=${releve.id}` : `/frais/${releve.id}`}
                                className="glass-card"
                                style={{
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    textDecoration: 'none',
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
                                    background: iconStyle.bg,
                                    color: iconStyle.color,
                                }}>
                                    <Receipt style={{ width: '20px', height: '20px' }} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                                        {(isAdmin || isBureau) && releve.employe
                                            ? `${releve.employe.prenom} ${releve.employe.nom}`
                                            : 'Mon relevé'}
                                        {releve.employe?.profil_vehicule && (
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                                                {releve.employe.profil_vehicule}
                                            </span>
                                        )}
                                    </p>
                                    {releve.periode && (
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {formatDateShort(releve.periode.date_debut)} → {formatDateShort(releve.periode.date_fin)}
                                        </p>
                                    )}
                                </div>

                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                                        {formatCurrency(releve.total_general)}
                                    </p>
                                    <span className={`badge ${getStatutColor(releve.statut)}`} style={{ fontSize: '11px' }}>
                                        {getStatutLabel(releve.statut)}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                            <Receipt style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Aucun relevé trouvé</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
