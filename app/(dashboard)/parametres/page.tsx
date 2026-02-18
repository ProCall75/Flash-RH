'use client';

import { useState, useEffect } from 'react';
import { Settings, Receipt, Save, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getCategories } from '@/lib/actions/frais';
import type { CategorieFrais } from '@/types/database';

export default function ParametresPage() {
    const [categories, setCategories] = useState<CategorieFrais[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (err) {
                console.error('Categories load error:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="glass-card p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                <p className="text-slate-400 mt-2">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Paramètres</h1>
                <p className="text-slate-400 mt-1">Configuration des catégories et montants</p>
            </div>

            {/* Categories */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-blue-400" />
                        Catégories de frais et primes ({categories.length})
                    </h2>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/15 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/25 transition-all">
                        <Save className="w-3 h-3" />
                        Sauvegarder
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-xs font-medium text-slate-500 uppercase p-3">Catégorie</th>
                                <th className="text-left text-xs font-medium text-slate-500 uppercase p-3">Montant</th>
                                <th className="text-left text-xs font-medium text-slate-500 uppercase p-3">Véhicule</th>
                                <th className="text-left text-xs font-medium text-slate-500 uppercase p-3">Type</th>
                                <th className="text-left text-xs font-medium text-slate-500 uppercase p-3">Actif</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="p-3 text-white font-medium">{cat.nom}</td>
                                    <td className="p-3">
                                        <span className="text-white font-semibold">{formatCurrency(cat.montant_defaut)}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`badge text-xs ${cat.profil_vehicule === 'PL' ? 'bg-blue-500/15 text-blue-400' :
                                            cat.profil_vehicule === 'VL' ? 'bg-emerald-500/15 text-emerald-400' :
                                                'bg-slate-500/15 text-slate-400'
                                            }`}>
                                            {cat.profil_vehicule === 'tous' ? 'Tous' : cat.profil_vehicule}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`badge text-xs ${cat.type === 'frais' ? 'bg-amber-500/15 text-amber-400' : 'bg-violet-500/15 text-violet-400'}`}>
                                            {cat.type === 'frais' ? 'Frais' : 'Prime'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`w-2 h-2 rounded-full inline-block ${cat.actif ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500">Aucune catégorie trouvée</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-4 h-4 text-slate-500" />
                    <h2 className="text-sm font-semibold text-white">Informations</h2>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                    <p>Les montants sont définis selon la convention collective du transport routier.</p>
                    <p>Toute modification prendra effet à la prochaine période de frais.</p>
                    <p className="text-xs text-slate-600">Version 1.0 — PRAGMA Studio © 2026</p>
                </div>
            </div>
        </div>
    );
}
