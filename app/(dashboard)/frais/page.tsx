'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Receipt, Loader2 } from 'lucide-react';
import { formatCurrency, getStatutColor, getStatutLabel, formatDateShort } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import { getReleves, getPeriodeActive } from '@/lib/actions/frais';
import type { ReleveFrais, ReleveStatut, PeriodeFrais } from '@/types/database';

export default function FraisPage() {
    const { isAdmin, isBureau } = useUser();
    const [filter, setFilter] = useState<ReleveStatut | 'tous'>('tous');
    const [releves, setReleves] = useState<ReleveFrais[]>([]);
    const [periode, setPeriode] = useState<PeriodeFrais | null>(null);
    const [loading, setLoading] = useState(true);

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
                void 0; // error handled silently
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = filter === 'tous'
        ? releves
        : releves.filter((r) => r.statut === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {isAdmin || isBureau ? 'Notes de frais' : 'Mes frais'}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {periode
                            ? `Période du ${formatDateShort(periode.date_debut)} au ${formatDateShort(periode.date_fin)}`
                            : 'Aucune période active'}
                    </p>
                </div>
                {(!isAdmin && !isBureau) && (
                    <Link
                        href="/frais/saisie"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Saisir mes frais</span>
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {([['tous', 'Tous'], ['brouillon', 'Brouillons'], ['soumis', 'Soumis'], ['valide', 'Validés'], ['corrige', 'Corrigés'], ['conteste', 'Contestés']] as const).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === key
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="glass-card p-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                    <p className="text-slate-400 mt-2">Chargement...</p>
                </div>
            )}

            {/* List */}
            {!loading && (
                <div className="space-y-3">
                    {filtered.map((releve) => (
                        <Link
                            key={releve.id}
                            href={`/frais/${releve.id}`}
                            className="glass-card p-4 md:p-5 flex items-center gap-4 hover:border-blue-500/20 transition-all group"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${releve.statut === 'brouillon' ? 'bg-slate-500/15 text-slate-400' :
                                releve.statut === 'soumis' ? 'bg-blue-500/15 text-blue-400' :
                                    releve.statut === 'valide' ? 'bg-emerald-500/15 text-emerald-400' :
                                        'bg-amber-500/15 text-amber-400'
                                }`}>
                                <Receipt className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                                    {(isAdmin || isBureau) && releve.employe
                                        ? `${releve.employe.prenom} ${releve.employe.nom}`
                                        : 'Mon relevé'}
                                    {releve.employe?.profil_vehicule && (
                                        <span className="text-xs text-slate-600 ml-2">{releve.employe.profil_vehicule}</span>
                                    )}
                                </p>
                                <div className="flex items-center gap-3 mt-0.5">
                                    {releve.periode && (
                                        <span className="text-xs text-slate-500">
                                            {formatDateShort(releve.periode.date_debut)} → {formatDateShort(releve.periode.date_fin)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <p className="text-lg font-bold text-white">{formatCurrency(releve.total_general)}</p>
                                <span className={`badge text-xs ${getStatutColor(releve.statut)}`}>
                                    {getStatutLabel(releve.statut)}
                                </span>
                            </div>
                        </Link>
                    ))}

                    {filtered.length === 0 && (
                        <div className="glass-card p-12 text-center">
                            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">Aucun relevé trouvé</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
