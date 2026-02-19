'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Receipt, CheckCircle, Edit3, Loader2, X, MessageCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate, getStatutColor, getStatutLabel } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import { getReleveById, validateReleve, getCorrections, correctReleve } from '@/lib/actions/frais';
import { getContestations, createContestation, resolveContestation } from '@/lib/actions/contestations';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { ReleveFrais, CorrectionFrais, Contestation } from '@/types/database';

export default function FraisDetailPage() {
    const params = useParams();
    const { isAdmin, isBureau, profile } = useUser();
    const [releve, setReleve] = useState<ReleveFrais | null>(null);
    const [corrections, setCorrections] = useState<CorrectionFrais[]>([]);
    const [contestations, setContestations] = useState<Contestation[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    // Correction modal
    const [showCorrectionModal, setShowCorrectionModal] = useState(false);
    const [correctionForm, setCorrectionForm] = useState({ champ: '', ancienne: '', nouvelle: '', notes: '' });
    const [correctionSaving, setCorrectionSaving] = useState(false);

    // Contestation
    const [showContestationForm, setShowContestationForm] = useState(false);
    const [contestationMsg, setContestationMsg] = useState('');
    const [contestationSaving, setContestationSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const [r, c, ct] = await Promise.all([
                    getReleveById(params.id as string),
                    getCorrections(params.id as string).catch(() => []),
                    getContestations(params.id as string).catch(() => []),
                ]);
                setReleve(r);
                setCorrections(c);
                setContestations(ct);
            } catch {
                setError('Erreur lors du chargement du relevé.');
            } finally {
                setPageLoading(false);
            }
        }
        load();
    }, [params.id]);

    async function handleValidate() {
        if (!releve) return;
        setActionLoading(true);
        try {
            const updated = await validateReleve(releve.id);
            setReleve(updated);
        } catch {
            setError('Erreur lors de la validation.');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleCorrection() {
        if (!releve || !correctionForm.champ) return;
        setCorrectionSaving(true);
        try {
            await correctReleve(releve.id, [{
                champ_modifie: correctionForm.champ,
                ancienne_valeur: correctionForm.ancienne,
                nouvelle_valeur: correctionForm.nouvelle,
                notes: correctionForm.notes || undefined,
            }]);
            const [updatedReleve, updatedCorrections] = await Promise.all([
                getReleveById(releve.id),
                getCorrections(releve.id),
            ]);
            setReleve(updatedReleve);
            setCorrections(updatedCorrections);
            setShowCorrectionModal(false);
            setCorrectionForm({ champ: '', ancienne: '', nouvelle: '', notes: '' });
        } catch {
            setError('Erreur lors de la correction.');
        } finally {
            setCorrectionSaving(false);
        }
    }

    async function handleContestation() {
        if (!releve || !contestationMsg.trim()) return;
        setContestationSaving(true);
        try {
            const created = await createContestation(releve.id, contestationMsg);
            setContestations((prev) => [created, ...prev]);
            setShowContestationForm(false);
            setContestationMsg('');
        } catch {
            setError('Erreur lors de la contestation.');
        } finally {
            setContestationSaving(false);
        }
    }

    async function handleResolve(id: string) {
        try {
            await resolveContestation(id);
            setContestations((prev) => prev.map((c) => c.id === id ? { ...c, statut: 'resolue' as const, resolue_at: new Date().toISOString() } : c));
        } catch {
            setError('Erreur lors de la résolution.');
        }
    }

    if (pageLoading) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto' }} className="glass-card">
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
                </div>
            </div>
        );
    }

    if (!releve) {
        return (
            <div style={{ maxWidth: '720px', margin: '0 auto' }} className="glass-card">
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Relevé introuvable</p>
                    <Link href="/frais" style={{ color: 'var(--primary)', fontSize: '14px', marginTop: '8px', display: 'inline-block', textDecoration: 'none' }}>Retour</Link>
                </div>
            </div>
        );
    }

    const releveAny = releve as unknown as Record<string, unknown>;
    const lignesFrais = (releveAny.lignes_frais ?? []) as Array<{
        id: string; categorie?: { nom: string }; montant: number; coche: boolean; date_jour: string;
    }>;
    const lignesPrimes = (releveAny.lignes_primes ?? []) as Array<{
        id: string; categorie?: { nom: string }; montant: number; quantite: number; date_jour: string;
    }>;

    const isConducteur = !isAdmin && !isBureau;
    const canContest = isConducteur && releve.statut === 'corrige';
    const canCorrect = (isAdmin || isBureau) && ['soumis', 'valide'].includes(releve.statut);

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <ErrorBanner message={error} />}

            <Link href="/frais" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} /> Retour aux frais
            </Link>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>
                        {releve.employe?.prenom} {releve.employe?.nom}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                        {releve.periode
                            ? `${formatDate(releve.periode.date_debut)} → ${formatDate(releve.periode.date_fin)}`
                            : 'Période inconnue'}
                    </p>
                </div>
                <span className={`badge ${getStatutColor(releve.statut)}`} style={{ fontSize: '13px' }}>
                    {getStatutLabel(releve.statut)}
                </span>
            </div>

            {/* Totals */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="max-md:!grid-cols-1">
                {[
                    { label: 'Frais', value: releve.total_frais, color: '#1e40af' },
                    { label: 'Primes', value: releve.total_primes, color: '#065f46' },
                    { label: 'Total', value: releve.total_general, color: 'var(--primary)' },
                ].map((t) => (
                    <div key={t.label} className="glass-card" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{t.label}</p>
                        <p style={{ fontSize: '24px', fontWeight: 800, color: t.color }}>{formatCurrency(t.value)}</p>
                    </div>
                ))}
            </div>

            {/* Frais breakdown */}
            <div className="glass-card">
                <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Receipt style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                    Détail des frais ({lignesFrais.length} lignes)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {lignesFrais.map((l) => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--text)' }}>{l.categorie?.nom || 'Catégorie'}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.date_jour}</p>
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{formatCurrency(l.montant)}</p>
                        </div>
                    ))}
                    {lignesFrais.length === 0 && (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>Aucune ligne de frais</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', marginTop: '8px', borderTop: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Sous-total frais</p>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(releve.total_frais)}</p>
                    </div>
                </div>
            </div>

            {/* Primes breakdown */}
            <div className="glass-card">
                <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle style={{ width: '16px', height: '16px', color: 'var(--success)' }} />
                    Détail des primes ({lignesPrimes.length} lignes)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {lignesPrimes.map((l) => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--text)' }}>{l.categorie?.nom || 'Prime'}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.date_jour} × {l.quantite}</p>
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{formatCurrency(l.montant * l.quantite)}</p>
                        </div>
                    ))}
                    {lignesPrimes.length === 0 && (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>Aucune ligne de prime</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', marginTop: '8px', borderTop: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Sous-total primes</p>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(releve.total_primes)}</p>
                    </div>
                </div>
            </div>

            {/* Corrections history */}
            {corrections.length > 0 && (
                <div className="glass-card">
                    <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit3 style={{ width: '16px', height: '16px', color: 'var(--warning)' }} />
                        Corrections ({corrections.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {corrections.map((c) => (
                            <div key={c.id} style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.15)' }}>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#92400e' }}>{c.champ_modifie}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    {c.ancienne_valeur} → {c.nouvelle_valeur}
                                    {c.notes && ` — ${c.notes}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contestations */}
            {contestations.length > 0 && (
                <div className="glass-card">
                    <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle style={{ width: '16px', height: '16px', color: 'var(--warning)' }} />
                        Contestations ({contestations.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {contestations.map((ct) => (
                            <div key={ct.id} style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: ct.statut === 'ouverte' ? 'var(--error-bg)' : 'var(--success-bg)', border: `1px solid ${ct.statut === 'ouverte' ? 'rgba(239,68,68,0.15)' : 'rgba(0,220,130,0.15)'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: ct.statut === 'ouverte' ? '#991b1b' : '#065f46' }}>
                                        {ct.statut === 'ouverte' ? '⚠️ Ouverte' : '✓ Résolue'}
                                    </span>
                                    {(isAdmin || isBureau) && ct.statut === 'ouverte' && (
                                        <button onClick={() => handleResolve(ct.id)} style={{
                                            padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                                            background: 'var(--success-bg)', border: '1px solid rgba(0,220,130,0.2)',
                                            borderRadius: 'var(--radius-sm)', color: '#065f46',
                                            cursor: 'pointer', fontFamily: 'inherit',
                                        }}>
                                            Résoudre
                                        </button>
                                    )}
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text)', marginTop: '6px' }}>{ct.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Conducteur: contester button */}
            {canContest && (
                <div className="glass-card">
                    {!showContestationForm ? (
                        <button onClick={() => setShowContestationForm(true)} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                            <MessageCircle style={{ width: '16px', height: '16px' }} /> Contester ce relevé
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Contestation</h3>
                            <textarea
                                value={contestationMsg}
                                onChange={(e) => setContestationMsg(e.target.value)}
                                placeholder="Expliquez la raison de votre contestation..."
                                rows={3}
                                style={{
                                    width: '100%', padding: '12px', fontSize: '14px', fontFamily: 'inherit',
                                    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                    background: 'var(--white)', color: 'var(--text)', outline: 'none', resize: 'vertical',
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setShowContestationForm(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
                                <button onClick={handleContestation} disabled={contestationSaving || !contestationMsg.trim()} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: contestationSaving ? 0.6 : 1 }}>
                                    {contestationSaving ? <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> : 'Envoyer'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Admin actions */}
            {(isAdmin || isBureau) && releve.statut === 'soumis' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleValidate}
                        disabled={actionLoading}
                        style={{
                            flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--success-bg)', border: '1px solid rgba(0,220,130,0.2)',
                            color: '#065f46', fontWeight: 600, fontSize: '14px', fontFamily: 'inherit',
                            cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.5 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                    >
                        {actionLoading ? <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> : <CheckCircle style={{ width: '20px', height: '20px' }} />}
                        Valider
                    </button>
                    <button
                        onClick={() => setShowCorrectionModal(true)}
                        style={{
                            flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.2)',
                            color: '#92400e', fontWeight: 600, fontSize: '14px', fontFamily: 'inherit',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                    >
                        <Edit3 style={{ width: '20px', height: '20px' }} /> Corriger
                    </button>
                </div>
            )}

            {/* Also allow corrections on validated relevés */}
            {canCorrect && releve.statut === 'valide' && (
                <button
                    onClick={() => setShowCorrectionModal(true)}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Edit3 style={{ width: '16px', height: '16px' }} /> Corriger ce relevé
                </button>
            )}

            {/* Correction Modal */}
            {showCorrectionModal && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
                    onClick={(e) => e.target === e.currentTarget && setShowCorrectionModal(false)}
                >
                    <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '28px', margin: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>Corriger le relevé</h2>
                            <button onClick={() => setShowCorrectionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                                <X style={{ width: '18px', height: '18px' }} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Champ modifié *</label>
                                <input value={correctionForm.champ} onChange={(e) => setCorrectionForm({ ...correctionForm, champ: e.target.value })} placeholder="ex: Montant repas 15/01" style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Ancienne valeur</label>
                                <input value={correctionForm.ancienne} onChange={(e) => setCorrectionForm({ ...correctionForm, ancienne: e.target.value })} placeholder="ex: 15.50" style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Nouvelle valeur *</label>
                                <input value={correctionForm.nouvelle} onChange={(e) => setCorrectionForm({ ...correctionForm, nouvelle: e.target.value })} placeholder="ex: 12.00" style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Notes</label>
                                <textarea value={correctionForm.notes} onChange={(e) => setCorrectionForm({ ...correctionForm, notes: e.target.value })} placeholder="Raison de la correction..." rows={2} style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setShowCorrectionModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Annuler</button>
                            <button onClick={handleCorrection} disabled={correctionSaving || !correctionForm.champ || !correctionForm.nouvelle} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', opacity: correctionSaving ? 0.6 : 1 }}>
                                {correctionSaving ? <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> : 'Appliquer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
