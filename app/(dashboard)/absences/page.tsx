'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, CalendarOff, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getAbsenceTypeLabel, getStatutColor, getStatutLabel, formatDateShort } from '@/lib/utils';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useUser } from '@/lib/hooks/useUser';
import { getAbsences } from '@/lib/actions/absences';
import type { Absence, AbsenceStatut } from '@/types/database';

export default function AbsencesPage() {
    const { isAdmin, isBureau, profile, loading: userLoading } = useUser();
    const [filter, setFilter] = useState<AbsenceStatut | 'tous'>('tous');
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadAbsences = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const isMgr = isAdmin || isBureau;
            const data = await getAbsences(isMgr ? undefined : { userId: profile?.id });
            setAbsences(data);
        } catch {
            setError('Erreur lors du chargement des absences.');
        } finally {
            setLoading(false);
        }
    }, [isAdmin, isBureau, profile?.id]);

    useEffect(() => {
        if (userLoading) return;
        loadAbsences();
    }, [loadAbsences, userLoading]);

    // Re-fetch when user navigates back to this page (focus event)
    useEffect(() => {
        const handleFocus = () => {
            loadAbsences();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [loadAbsences]);

    const filtered = filter === 'tous'
        ? absences
        : absences.filter((a) => a.statut === filter);

    const counts = {
        tous: absences.length,
        en_attente: absences.filter((a) => a.statut === 'en_attente').length,
        validee: absences.filter((a) => a.statut === 'validee').length,
        refusee: absences.filter((a) => a.statut === 'refusee').length,
    };

    const filterButtons = [
        { key: 'tous' as const, label: 'Tous' },
        { key: 'en_attente' as const, label: 'En attente' },
        { key: 'validee' as const, label: 'Validées' },
        { key: 'refusee' as const, label: 'Refusées' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <ErrorBanner message={error} onRetry={loadAbsences} />}
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>
                        {isAdmin || isBureau ? 'Gestion des absences' : 'Mes absences'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                        {counts.tous} demande{counts.tous > 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/absences/nouvelle" className="btn btn-primary" style={{ fontSize: '13px' }}>
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Nouvelle demande
                </Link>
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
                        }}
                    >
                        {label} ({counts[key]})
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
                    {filtered.map((absence) => {
                        const iconStyle = absence.statut === 'en_attente'
                            ? { bg: 'var(--warning-bg)', color: '#92400e' }
                            : absence.statut === 'validee'
                                ? { bg: 'var(--success-bg)', color: '#065f46' }
                                : { bg: 'var(--error-bg)', color: '#991b1b' };

                        return (
                            <Link
                                key={absence.id}
                                href={`/absences/${absence.id}`}
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
                                    {absence.statut === 'en_attente' ? <Clock style={{ width: '20px', height: '20px' }} /> :
                                        absence.statut === 'validee' ? <CheckCircle style={{ width: '20px', height: '20px' }} /> :
                                            <XCircle style={{ width: '20px', height: '20px' }} />}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                                            {(isAdmin || isBureau) && absence.employe
                                                ? `${absence.employe.prenom} ${absence.employe.nom}`
                                                : getAbsenceTypeLabel(absence.type)}
                                        </p>
                                        {absence.derniere_minute && (
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: 'var(--error-bg)',
                                                color: 'var(--error)',
                                            }}>
                                                URGENT
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        {(isAdmin || isBureau) ? `${getAbsenceTypeLabel(absence.type)} — ` : ''}
                                        Du {formatDateShort(absence.date_dernier_jour_travaille)} au {formatDateShort(absence.date_reprise)}
                                    </p>
                                </div>

                                <span className={`badge ${getStatutColor(absence.statut)}`}>
                                    {getStatutLabel(absence.statut)}
                                </span>
                            </Link>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                            <CalendarOff style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Aucune absence trouvée</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
