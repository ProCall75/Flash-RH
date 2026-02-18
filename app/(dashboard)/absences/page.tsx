'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, CalendarOff, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getAbsenceTypeLabel, getStatutColor, getStatutLabel, formatDateShort } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import { getAbsences } from '@/lib/actions/absences';
import type { Absence, AbsenceStatut } from '@/types/database';

export default function AbsencesPage() {
    const { isAdmin, isBureau } = useUser();
    const [filter, setFilter] = useState<AbsenceStatut | 'tous'>('tous');
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getAbsences();
                setAbsences(data);
            } catch {
                void 0; // error handled silently
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = filter === 'tous'
        ? absences
        : absences.filter((a) => a.statut === filter);

    const counts = {
        tous: absences.length,
        en_attente: absences.filter((a) => a.statut === 'en_attente').length,
        validee: absences.filter((a) => a.statut === 'validee').length,
        refusee: absences.filter((a) => a.statut === 'refusee').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {isAdmin || isBureau ? 'Gestion des absences' : 'Mes absences'}
                    </h1>
                    <p className="text-slate-400 mt-1">{counts.tous} demande{counts.tous > 1 ? 's' : ''}</p>
                </div>
                <Link
                    href="/absences/nouvelle"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nouvelle demande</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {([['tous', 'Tous'], ['en_attente', 'En attente'], ['validee', 'Validées'], ['refusee', 'Refusées']] as const).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === key
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
                            }`}
                    >
                        {label}
                        <span className={`text-xs ${filter === key ? 'text-blue-300' : 'text-slate-600'}`}>
                            {counts[key]}
                        </span>
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
                    {filtered.map((absence) => (
                        <Link
                            key={absence.id}
                            href={`/absences/${absence.id}`}
                            className="glass-card p-4 md:p-5 flex items-center gap-4 hover:border-blue-500/20 transition-all group"
                        >
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${absence.statut === 'en_attente' ? 'bg-amber-500/15 text-amber-400' :
                                absence.statut === 'validee' ? 'bg-emerald-500/15 text-emerald-400' :
                                    'bg-red-500/15 text-red-400'
                                }`}>
                                {absence.statut === 'en_attente' ? <Clock className="w-5 h-5" /> :
                                    absence.statut === 'validee' ? <CheckCircle className="w-5 h-5" /> :
                                        <XCircle className="w-5 h-5" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                                        {(isAdmin || isBureau) && absence.employe
                                            ? `${absence.employe.prenom} ${absence.employe.nom}`
                                            : getAbsenceTypeLabel(absence.type)}
                                    </p>
                                    {absence.derniere_minute && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                            URGENT
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {(isAdmin || isBureau) ? `${getAbsenceTypeLabel(absence.type)} — ` : ''}
                                    Du {formatDateShort(absence.date_dernier_jour_travaille)} au {formatDateShort(absence.date_reprise)}
                                </p>
                            </div>

                            {/* Status */}
                            <span className={`badge ${getStatutColor(absence.statut)}`}>
                                {getStatutLabel(absence.statut)}
                            </span>
                        </Link>
                    ))}

                    {filtered.length === 0 && (
                        <div className="glass-card p-12 text-center">
                            <CalendarOff className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">Aucune absence trouvée</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
