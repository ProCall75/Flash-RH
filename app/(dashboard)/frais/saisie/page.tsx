'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, Check, Save } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import {
    getPeriodeActive,
    getCategories,
    getOrCreateReleve,
    upsertLigneFrais,
    upsertLignePrime,
    submitReleve,
    saveDraftReleve,
    getReleveLignes,
    getReleveById,
} from '@/lib/actions/frais';
import type { CategorieFrais, PeriodeFrais } from '@/types/database';

type GridData = Record<string, Record<string, boolean>>;

function generateDays(start: string, end: string): string[] {
    const days: string[] = [];
    const cur = new Date(start);
    const endDate = new Date(end);
    while (cur <= endDate) {
        days.push(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
    }
    return days;
}

function SaisieFraisPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const existingReleveId = searchParams.get('releve');
    const { profile } = useUser();
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    const [periode, setPeriode] = useState<PeriodeFrais | null>(null);
    const [cats, setCats] = useState<CategorieFrais[]>([]);
    const [primesCats, setPrimesCats] = useState<CategorieFrais[]>([]);
    const [releveId, setReleveId] = useState<string | null>(null);

    const [fraisGrid, setFraisGrid] = useState<GridData>({});
    const [primesGrid, setPrimesGrid] = useState<GridData>({});



    useEffect(() => {
        async function load() {
            try {
                // Step 1: Get active period
                let p: PeriodeFrais | null = null;
                try {
                    p = await getPeriodeActive();
                } catch (err) {
                    console.error('getPeriodeActive error:', err);
                    setError('Erreur de connexion au serveur. Vérifiez votre connexion.');
                    setPageLoading(false);
                    return;
                }
                if (!p) {
                    setError('Aucune période active. Contactez l\'administrateur pour ouvrir une période.');
                    setPageLoading(false);
                    return;
                }
                setPeriode(p);

                // Step 2: Get categories
                const vehicule = profile?.profil_vehicule as 'VL' | 'PL' | undefined;
                const allCats = await getCategories(vehicule || undefined);
                const fraisCats = allCats.filter(c => c.type === 'frais');
                const prCats = allCats.filter(c => c.type === 'prime');
                setCats(fraisCats);
                setPrimesCats(prCats);

                // Step 3: Initialize grid
                const days = generateDays(p.date_debut, p.date_fin);
                const fg: GridData = {};
                const pg: GridData = {};
                days.forEach(d => {
                    fg[d] = {};
                    pg[d] = {};
                    fraisCats.forEach(c => { fg[d][c.id] = false; });
                    prCats.forEach(c => { pg[d][c.id] = false; });
                });

                // Step 4: Get or load relevé
                let relId: string | null = null;
                try {
                    if (existingReleveId) {
                        // Resuming a draft — load existing relevé
                        const releve = await getReleveById(existingReleveId);
                        relId = releve.id;

                        // Load existing lines and pre-check the grid
                        const lignes = await getReleveLignes(existingReleveId);
                        for (const l of lignes.frais) {
                            if (fg[l.date_jour] && l.coche) {
                                fg[l.date_jour][l.categorie_id] = true;
                            }
                        }
                        for (const l of lignes.primes) {
                            if (pg[l.date_jour]) {
                                pg[l.date_jour][l.categorie_id] = true;
                            }
                        }
                    } else {
                        const releve = await getOrCreateReleve(p.id);
                        relId = releve.id;
                    }
                    setReleveId(relId);
                } catch (err) {
                    console.error('getOrCreateReleve error:', err);
                    setError('Impossible de créer votre relevé. Les données sont en lecture seule.');
                }

                setFraisGrid(fg);
                setPrimesGrid(pg);
            } catch (err) {
                console.error('Load frais error:', err);
                setError('Erreur lors du chargement des données de frais.');
            } finally {
                setPageLoading(false);
            }
        }
        load();
    }, [profile?.profil_vehicule, existingReleveId]);

    const days = useMemo(() => {
        if (!periode) return [];
        return generateDays(periode.date_debut, periode.date_fin);
    }, [periode]);

    const totalFrais = useMemo(() => {
        let total = 0;
        Object.values(fraisGrid).forEach(dayCats => {
            cats.forEach(cat => {
                if (dayCats[cat.id]) total += cat.montant_defaut;
            });
        });
        return total;
    }, [fraisGrid, cats]);

    const totalPrimes = useMemo(() => {
        let total = 0;
        Object.values(primesGrid).forEach(dayCats => {
            primesCats.forEach(p => {
                if (dayCats[p.id]) total += p.montant_defaut;
            });
        });
        return total;
    }, [primesGrid, primesCats]);

    const toggleFrais = useCallback((day: string, catId: string) => {
        setFraisGrid(prev => ({
            ...prev,
            [day]: { ...prev[day], [catId]: !prev[day]?.[catId] },
        }));
    }, []);

    const togglePrime = useCallback((day: string, catId: string) => {
        setPrimesGrid(prev => ({
            ...prev,
            [day]: { ...prev[day], [catId]: !prev[day]?.[catId] },
        }));
    }, []);

    const dayOfWeek = (d: string) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'short' });
    const dayNum = (d: string) => new Date(d).getDate();
    const isWeekend = (d: string) => {
        const day = new Date(d).getDay();
        return day === 0 || day === 6;
    };

    async function saveLines() {
        if (!releveId) return;
        for (const day of days) {
            for (const cat of cats) {
                const coche = fraisGrid[day]?.[cat.id] ?? false;
                await upsertLigneFrais({
                    releve_id: releveId,
                    date_jour: day,
                    categorie_id: cat.id,
                    montant: cat.montant_defaut,
                    coche,
                });
            }
            for (const p of primesCats) {
                const coche = primesGrid[day]?.[p.id] ?? false;
                await upsertLignePrime({
                    releve_id: releveId,
                    date_jour: day,
                    categorie_id: p.id,
                    montant: p.montant_defaut,
                    quantite: coche ? 1 : 0,
                });
            }
        }
    }

    async function handleSaveDraft() {
        if (!releveId) return;
        setSavingDraft(true);
        setError('');
        try {
            await saveLines();
            await saveDraftReleve(releveId);
            router.push('/frais');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
            setSavingDraft(false);
        }
    }

    async function handleSubmit() {
        if (!releveId) return;
        setLoading(true);
        setError('');
        try {
            await saveLines();
            await submitReleve(releveId);
            router.push('/frais');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
            setLoading(false);
        }
    }



    if (pageLoading) {
        return (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement de la période...</p>
            </div>
        );
    }

    const thStyle: React.CSSProperties = {
        textAlign: 'left', padding: '6px 4px', fontSize: '10px', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.3px', color: 'var(--text-muted)',
        lineHeight: '1.2',
    };

    const stickyTd: React.CSSProperties = {
        padding: '6px 8px', position: 'sticky', left: 0,
        background: 'var(--white)', zIndex: 10, minWidth: '65px',
        borderRight: '2px solid var(--border)',
    };

    const isBusy = loading || savingDraft;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Link href="/frais" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour aux frais
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>Saisie des frais</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                        {periode
                            ? `Période : ${new Date(periode.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → ${new Date(periode.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : 'Aucune période active'}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(totalFrais + totalPrimes)}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Frais {formatCurrency(totalFrais)} + Primes {formatCurrency(totalPrimes)}</p>
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)', color: '#991b1b', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            {/* ═══ Frais Grid Table ═══ */}
            <div>
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Frais de déplacement</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Cochez les jours où le frais s&apos;applique</p>
                    </div>
                    <div className="expense-grid-wrapper" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ ...thStyle, position: 'sticky', left: 0, background: 'var(--white)', zIndex: 10, minWidth: '80px' }}>Jour</th>
                                    {cats.map((c) => (
                                        <th key={c.id} style={{ ...thStyle, textAlign: 'center', minWidth: '52px', maxWidth: '70px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                            <div style={{ fontSize: '9px', lineHeight: '1.2' }}>{c.nom}</div>
                                            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '10px', marginTop: '2px' }}>{formatCurrency(c.montant_defaut)}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {days.map((day) => (
                                    <tr key={day} style={{ borderBottom: '1px solid var(--border)', background: isWeekend(day) ? 'var(--bg)' : 'transparent' }}>
                                        <td style={stickyTd}>
                                            <span style={{ fontWeight: 600, color: isWeekend(day) ? 'var(--text-muted)' : 'var(--text)' }}>
                                                {dayOfWeek(day)} {dayNum(day)}
                                            </span>
                                        </td>
                                        {cats.map((cat) => (
                                            <td key={cat.id} style={{ textAlign: 'center', padding: '3px' }}>
                                                <button
                                                    onClick={() => toggleFrais(day, cat.id)}
                                                    style={{
                                                        width: '26px', height: '26px', borderRadius: '6px',
                                                        border: `1.5px solid ${fraisGrid[day]?.[cat.id] ? 'var(--primary)' : 'var(--border)'}`,
                                                        background: fraisGrid[day]?.[cat.id] ? 'var(--primary-bg)' : 'var(--white)',
                                                        color: fraisGrid[day]?.[cat.id] ? 'var(--primary)' : 'transparent',
                                                        cursor: 'pointer', transition: 'all var(--transition-fast)',
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    <Check style={{ width: '14px', height: '14px' }} />
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



            {/* Primes Grid */}
            <div>
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Primes</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ ...thStyle, position: 'sticky', left: 0, background: 'var(--white)', zIndex: 10, minWidth: '80px' }}>Jour</th>
                                    {primesCats.map((p) => (
                                        <th key={p.id} style={{ ...thStyle, textAlign: 'center', minWidth: '52px', maxWidth: '70px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                            <div style={{ fontSize: '9px', lineHeight: '1.2' }}>{p.nom}</div>
                                            <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '10px', marginTop: '2px' }}>{formatCurrency(p.montant_defaut)}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {days.map((day) => (
                                    <tr key={day} style={{ borderBottom: '1px solid var(--border)', background: isWeekend(day) ? 'var(--bg)' : 'transparent' }}>
                                        <td style={stickyTd}>
                                            <span style={{ fontWeight: 600, color: isWeekend(day) ? 'var(--text-muted)' : 'var(--text)' }}>
                                                {dayOfWeek(day)} {dayNum(day)}
                                            </span>
                                        </td>
                                        {primesCats.map((p) => (
                                            <td key={p.id} style={{ textAlign: 'center', padding: '3px' }}>
                                                <button
                                                    onClick={() => togglePrime(day, p.id)}
                                                    style={{
                                                        width: '26px', height: '26px', borderRadius: '6px',
                                                        border: `1.5px solid ${primesGrid[day]?.[p.id] ? 'var(--success)' : 'var(--border)'}`,
                                                        background: primesGrid[day]?.[p.id] ? 'var(--success-bg)' : 'var(--white)',
                                                        color: primesGrid[day]?.[p.id] ? 'var(--success)' : 'transparent',
                                                        cursor: 'pointer', transition: 'all var(--transition-fast)',
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    <Check style={{ width: '14px', height: '14px' }} />
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    onClick={handleSaveDraft}
                    disabled={isBusy || !releveId}
                    className="btn"
                    style={{
                        flex: 1, padding: '14px', justifyContent: 'center', fontSize: '14px',
                        background: 'var(--bg)', color: 'var(--text)', border: '1.5px solid var(--border)',
                        opacity: (isBusy || !releveId) ? 0.5 : 1,
                        cursor: (isBusy || !releveId) ? 'not-allowed' : 'pointer',
                    }}
                >
                    {savingDraft ? <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> : <Save style={{ width: '20px', height: '20px' }} />}
                    {savingDraft ? 'Sauvegarde...' : 'Enregistrer en brouillon'}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isBusy || !releveId}
                    className="btn btn-primary"
                    style={{
                        flex: 1, padding: '14px', justifyContent: 'center', fontSize: '14px',
                        opacity: (isBusy || !releveId) ? 0.5 : 1,
                        cursor: (isBusy || !releveId) ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> : <Send style={{ width: '20px', height: '20px' }} />}
                    {loading ? 'Envoi...' : 'Soumettre le relevé'}
                </button>
            </div>
        </div>
    );
}

export default function SaisieFraisPage() {
    return (
        <Suspense fallback={
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
            </div>
        }>
            <SaisieFraisPageInner />
        </Suspense>
    );
}
