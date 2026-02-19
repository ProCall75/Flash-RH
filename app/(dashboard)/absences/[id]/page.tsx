'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { getAbsenceTypeLabel, getStatutColor, getStatutLabel, formatDate } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import { getAbsenceById, updateAbsenceStatut } from '@/lib/actions/absences';
import type { Absence } from '@/types/database';

export default function AbsenceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAdmin, isBureau } = useUser();
    const [absence, setAbsence] = useState<Absence | null>(null);
    const [motifRefus, setMotifRefus] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getAbsenceById(params.id as string);
                setAbsence(data);
            } catch {
                void 0;
            } finally {
                setPageLoading(false);
            }
        }
        load();
    }, [params.id]);

    const canValidate = (isAdmin || isBureau) && absence?.statut === 'en_attente';

    async function handleValidate() {
        if (!absence) return;
        setLoading(true);
        try {
            await updateAbsenceStatut(absence.id, 'validee');
            router.push('/absences');
        } catch {
            void 0;
            setLoading(false);
        }
    }

    async function handleRefuse() {
        if (!absence || !motifRefus.trim()) return;
        setLoading(true);
        try {
            await updateAbsenceStatut(absence.id, 'refusee', motifRefus);
            router.push('/absences');
        } catch {
            void 0;
            setLoading(false);
        }
    }

    if (pageLoading) {
        return (
            <div style={{ maxWidth: '640px', margin: '0 auto' }} className="glass-card" >
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
                </div>
            </div>
        );
    }

    if (!absence) {
        return (
            <div style={{ maxWidth: '640px', margin: '0 auto' }} className="glass-card">
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Absence introuvable</p>
                    <Link href="/absences" style={{ color: 'var(--primary)', fontSize: '14px', marginTop: '8px', display: 'inline-block', textDecoration: 'none' }}>Retour</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Link href="/absences" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour aux absences
            </Link>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>
                        {absence.employe?.prenom} {absence.employe?.nom}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>{getAbsenceTypeLabel(absence.type)}</p>
                </div>
                <span className={`badge ${getStatutColor(absence.statut)}`} style={{ fontSize: '13px' }}>
                    {getStatutLabel(absence.statut)}
                </span>
            </div>

            {/* Dates */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                    Dates demandées
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-bg)', border: '1px solid rgba(157,30,0,0.1)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', width: '48px' }}>Choix 1</span>
                        <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                            Du {formatDate(absence.date_dernier_jour_travaille)} au {formatDate(absence.date_reprise)}
                        </span>
                    </div>
                    {absence.choix_dates_2 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', width: '48px' }}>Choix 2</span>
                            <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                                Du {formatDate(absence.choix_dates_2.dernier_jour)} au {formatDate(absence.choix_dates_2.reprise)}
                            </span>
                        </div>
                    )}
                    {absence.choix_dates_3 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', width: '48px' }}>Choix 3</span>
                            <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                                Du {formatDate(absence.choix_dates_3.dernier_jour)} au {formatDate(absence.choix_dates_3.reprise)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {absence.derniere_minute && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <AlertTriangle style={{ width: '16px', height: '16px', color: 'var(--error)' }} />
                        <span style={{ fontSize: '13px', color: '#991b1b' }}>Demande de dernière minute</span>
                    </div>
                )}
                {absence.commentaire && (
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Commentaire</p>
                        <p style={{ fontSize: '14px', color: 'var(--text)' }}>{absence.commentaire}</p>
                    </div>
                )}
                <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Profil</p>
                        <p style={{ fontSize: '14px', color: 'var(--text)' }}>{absence.employe?.profil_vehicule || '—'}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Soumise le</p>
                        <p style={{ fontSize: '14px', color: 'var(--text)' }}>{formatDate(absence.created_at)}</p>
                    </div>
                </div>
            </div>

            {/* Actions admin */}
            {canValidate && (
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Actions</h2>

                    <button
                        onClick={handleValidate}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--success-bg)', border: '1px solid rgba(0,220,130,0.2)',
                            color: '#065f46', fontWeight: 600, fontSize: '14px', fontFamily: 'inherit',
                            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                    >
                        {loading ? <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> : <CheckCircle style={{ width: '20px', height: '20px' }} />}
                        Valider cette absence
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <textarea
                            value={motifRefus}
                            onChange={(e) => setMotifRefus(e.target.value)}
                            placeholder="Motif du refus (obligatoire)..."
                            rows={2}
                            style={{
                                width: '100%', padding: '10px 14px',
                                background: 'var(--white)', border: '1.5px solid var(--border)',
                                borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit',
                                color: 'var(--text)', resize: 'none', outline: 'none',
                            }}
                        />
                        <button
                            onClick={handleRefuse}
                            disabled={loading || !motifRefus.trim()}
                            style={{
                                width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)',
                                color: '#991b1b', fontWeight: 600, fontSize: '14px', fontFamily: 'inherit',
                                cursor: (loading || !motifRefus.trim()) ? 'not-allowed' : 'pointer',
                                opacity: (loading || !motifRefus.trim()) ? 0.5 : 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                        >
                            {loading ? <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> : <XCircle style={{ width: '20px', height: '20px' }} />}
                            Refuser
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
