'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Receipt, CheckCircle, Edit3, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate, getStatutColor, getStatutLabel } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import { getReleveById, validateReleve, getCorrections } from '@/lib/actions/frais';
import type { ReleveFrais, CorrectionFrais } from '@/types/database';

export default function FraisDetailPage() {
    const params = useParams();
    const { isAdmin, isBureau } = useUser();
    const [releve, setReleve] = useState<ReleveFrais | null>(null);
    const [corrections, setCorrections] = useState<CorrectionFrais[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const [r, c] = await Promise.all([
                    getReleveById(params.id as string),
                    getCorrections(params.id as string).catch(() => []),
                ]);
                setReleve(r);
                setCorrections(c);
            } catch {
                void 0; // error handled silently
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
            void 0; // error handled silently
        } finally {
            setActionLoading(false);
        }
    }

    if (pageLoading) {
        return (
            <div className="max-w-3xl mx-auto glass-card p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                <p className="text-slate-400 mt-2">Chargement...</p>
            </div>
        );
    }

    if (!releve) {
        return (
            <div className="max-w-3xl mx-auto glass-card p-12 text-center">
                <p className="text-slate-400">Relevé introuvable</p>
                <Link href="/frais" className="text-blue-400 text-sm mt-2 inline-block">Retour</Link>
            </div>
        );
    }

    const releveAny = releve as unknown as Record<string, unknown>;
    const lignesFrais = (releveAny.lignes_frais ?? []) as Array<{
        id: string;
        categorie?: { nom: string };
        montant: number;
        coche: boolean;
        date_jour: string;
    }>;

    const lignesPrimes = (releveAny.lignes_primes ?? []) as Array<{
        id: string;
        categorie?: { nom: string };
        montant: number;
        quantite: number;
        date_jour: string;
    }>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/frais" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour aux frais
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {releve.employe?.prenom} {releve.employe?.nom}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {releve.periode
                            ? `${formatDate(releve.periode.date_debut)} → ${formatDate(releve.periode.date_fin)}`
                            : 'Période inconnue'}
                    </p>
                </div>
                <span className={`badge text-sm ${getStatutColor(releve.statut)}`}>
                    {getStatutLabel(releve.statut)}
                </span>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Frais', value: releve.total_frais, color: 'from-blue-500 to-indigo-600' },
                    { label: 'Primes', value: releve.total_primes, color: 'from-emerald-500 to-teal-600' },
                    { label: 'Total', value: releve.total_general, color: 'from-violet-500 to-purple-600' },
                ].map((t) => (
                    <div key={t.label} className="glass-card p-4 text-center">
                        <p className="text-xs text-slate-500 mb-1">{t.label}</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(t.value)}</p>
                    </div>
                ))}
            </div>

            {/* Frais breakdown */}
            <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-400" />
                    Détail des frais ({lignesFrais.length} lignes)
                </h2>
                <div className="space-y-2">
                    {lignesFrais.map((l) => (
                        <div key={l.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5">
                            <div>
                                <p className="text-sm text-white">{l.categorie?.nom || 'Catégorie'}</p>
                                <p className="text-xs text-slate-500">{l.date_jour}</p>
                            </div>
                            <p className="text-sm font-semibold text-white">{formatCurrency(l.montant)}</p>
                        </div>
                    ))}
                    {lignesFrais.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-3">Aucune ligne de frais</p>
                    )}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                        <p className="text-sm font-semibold text-slate-300">Sous-total frais</p>
                        <p className="text-sm font-bold text-white">{formatCurrency(releve.total_frais)}</p>
                    </div>
                </div>
            </div>

            {/* Primes breakdown */}
            <div className="glass-card p-5">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Détail des primes ({lignesPrimes.length} lignes)
                </h2>
                <div className="space-y-2">
                    {lignesPrimes.map((l) => (
                        <div key={l.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5">
                            <div>
                                <p className="text-sm text-white">{l.categorie?.nom || 'Prime'}</p>
                                <p className="text-xs text-slate-500">{l.date_jour} × {l.quantite}</p>
                            </div>
                            <p className="text-sm font-semibold text-white">{formatCurrency(l.montant * l.quantite)}</p>
                        </div>
                    ))}
                    {lignesPrimes.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-3">Aucune ligne de prime</p>
                    )}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                        <p className="text-sm font-semibold text-slate-300">Sous-total primes</p>
                        <p className="text-sm font-bold text-white">{formatCurrency(releve.total_primes)}</p>
                    </div>
                </div>
            </div>

            {/* Corrections */}
            {corrections.length > 0 && (
                <div className="glass-card p-5">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-amber-400" />
                        Corrections effectuées
                    </h2>
                    <div className="space-y-2">
                        {corrections.map((c) => (
                            <div key={c.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
                                <p className="text-amber-300 font-medium">{c.champ_modifie}</p>
                                <p className="text-slate-400 text-xs mt-1">
                                    {c.ancienne_valeur} → {c.nouvelle_valeur}
                                    {c.notes && ` (${c.notes})`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Admin actions */}
            {(isAdmin || isBureau) && releve.statut === 'soumis' && (
                <div className="flex gap-3">
                    <button
                        onClick={handleValidate}
                        disabled={actionLoading}
                        className="flex-1 py-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        Valider
                    </button>
                    <button className="flex-1 py-3 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold rounded-xl hover:bg-amber-500/25 transition-all">
                        Corriger
                    </button>
                </div>
            )}
        </div>
    );
}
