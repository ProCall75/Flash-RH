'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import {
    getPeriodeActive,
    getCategories,
    getOrCreateReleve,
    upsertLigneFrais,
    upsertLignePrime,
    submitReleve,
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

export default function SaisieFraisPage() {
    const router = useRouter();
    const { profile } = useUser();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    const [periode, setPeriode] = useState<PeriodeFrais | null>(null);
    const [cats, setCats] = useState<CategorieFrais[]>([]);
    const [primesCats, setPrimesCats] = useState<CategorieFrais[]>([]);
    const [releveId, setReleveId] = useState<string | null>(null);

    const [fraisGrid, setFraisGrid] = useState<GridData>({});
    const [primesGrid, setPrimesGrid] = useState<GridData>({});

    // Load period, categories, and get/create releve
    useEffect(() => {
        async function load() {
            try {
                const p = await getPeriodeActive();
                setPeriode(p);

                const vehicule = profile?.profil_vehicule as 'VL' | 'PL' | undefined;
                const allCats = await getCategories(vehicule || undefined);
                setCats(allCats.filter(c => c.type === 'frais'));
                setPrimesCats(allCats.filter(c => c.type === 'prime'));

                const releve = await getOrCreateReleve(p.id);
                setReleveId(releve.id);

                // Initialize grids
                const days = generateDays(p.date_debut, p.date_fin);
                const fg: GridData = {};
                const pg: GridData = {};
                days.forEach(d => {
                    fg[d] = {};
                    pg[d] = {};
                    allCats.filter(c => c.type === 'frais').forEach(c => { fg[d][c.id] = false; });
                    allCats.filter(c => c.type === 'prime').forEach(c => { pg[d][c.id] = false; });
                });
                setFraisGrid(fg);
                setPrimesGrid(pg);
            } catch (err) {
                console.error('Load error:', err);
                setError('Impossible de charger la période active.');
            } finally {
                setPageLoading(false);
            }
        }
        load();
    }, [profile?.profil_vehicule]);

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

    async function handleSubmit() {
        if (!releveId) return;
        setLoading(true);
        setError('');
        try {
            // Save all frais lines
            for (const day of days) {
                for (const cat of cats) {
                    const coche = fraisGrid[day]?.[cat.id] ?? false;
                    if (coche) {
                        await upsertLigneFrais({
                            releve_id: releveId,
                            date_jour: day,
                            categorie_id: cat.id,
                            montant: cat.montant_defaut,
                            coche: true,
                        });
                    }
                }
                for (const p of primesCats) {
                    const coche = primesGrid[day]?.[p.id] ?? false;
                    if (coche) {
                        await upsertLignePrime({
                            releve_id: releveId,
                            date_jour: day,
                            categorie_id: p.id,
                            montant: p.montant_defaut,
                            quantite: 1,
                        });
                    }
                }
            }
            // Submit the releve
            await submitReleve(releveId);
            router.push('/frais');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
            setLoading(false);
        }
    }

    if (pageLoading) {
        return (
            <div className="glass-card p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                <p className="text-slate-400 mt-2">Chargement de la période...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Link href="/frais" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour aux frais
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Saisie des frais</h1>
                    <p className="text-slate-400 mt-1">
                        {periode
                            ? `Période : ${new Date(periode.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → ${new Date(periode.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : 'Aucune période active'}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalFrais + totalPrimes)}</p>
                    <p className="text-xs text-slate-500">Frais {formatCurrency(totalFrais)} + Primes {formatCurrency(totalPrimes)}</p>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Frais Grid */}
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-sm font-semibold text-white">Frais de déplacement</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Cochez les jours où le frais s&apos;applique</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-slate-400 font-medium p-3 sticky left-0 bg-slate-950/95 backdrop-blur z-10 min-w-[80px]">Jour</th>
                                {cats.map((c) => (
                                    <th key={c.id} className="text-center text-slate-400 font-medium p-2 min-w-[70px]">
                                        <div>{c.nom}</div>
                                        <div className="text-slate-600">{formatCurrency(c.montant_defaut)}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day) => (
                                <tr key={day} className={`border-b border-white/5 ${isWeekend(day) ? 'bg-white/[0.02]' : ''}`}>
                                    <td className="p-3 sticky left-0 bg-slate-950/95 backdrop-blur z-10">
                                        <span className={`font-medium ${isWeekend(day) ? 'text-slate-600' : 'text-white'}`}>
                                            {dayOfWeek(day)} {dayNum(day)}
                                        </span>
                                    </td>
                                    {cats.map((cat) => (
                                        <td key={cat.id} className="text-center p-2">
                                            <button
                                                onClick={() => toggleFrais(day, cat.id)}
                                                className={`w-8 h-8 rounded-lg border transition-all ${fraisGrid[day]?.[cat.id]
                                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                                    : 'bg-white/5 border-white/10 text-transparent hover:border-white/20'
                                                    }`}
                                            >
                                                <Check className="w-4 h-4 mx-auto" />
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Primes Grid */}
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-sm font-semibold text-white">Primes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-slate-400 font-medium p-3 sticky left-0 bg-slate-950/95 backdrop-blur z-10 min-w-[80px]">Jour</th>
                                {primesCats.map((p) => (
                                    <th key={p.id} className="text-center text-slate-400 font-medium p-2 min-w-[70px]">
                                        <div>{p.nom}</div>
                                        <div className="text-slate-600">{formatCurrency(p.montant_defaut)}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day) => (
                                <tr key={day} className={`border-b border-white/5 ${isWeekend(day) ? 'bg-white/[0.02]' : ''}`}>
                                    <td className="p-3 sticky left-0 bg-slate-950/95 backdrop-blur z-10">
                                        <span className={`font-medium ${isWeekend(day) ? 'text-slate-600' : 'text-white'}`}>
                                            {dayOfWeek(day)} {dayNum(day)}
                                        </span>
                                    </td>
                                    {primesCats.map((p) => (
                                        <td key={p.id} className="text-center p-2">
                                            <button
                                                onClick={() => togglePrime(day, p.id)}
                                                className={`w-8 h-8 rounded-lg border transition-all ${primesGrid[day]?.[p.id]
                                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                                    : 'bg-white/5 border-white/10 text-transparent hover:border-white/20'
                                                    }`}
                                            >
                                                <Check className="w-4 h-4 mx-auto" />
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading || !releveId}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Envoi...' : 'Soumettre le relevé'}
            </button>
        </div>
    );
}
