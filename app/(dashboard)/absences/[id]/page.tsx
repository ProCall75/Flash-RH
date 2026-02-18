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
                void 0; // error handled silently
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
            void 0; // error handled silently
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
            void 0; // error handled silently
            setLoading(false);
        }
    }

    if (pageLoading) {
        return (
            <div className="max-w-2xl mx-auto glass-card p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                <p className="text-slate-400 mt-2">Chargement...</p>
            </div>
        );
    }

    if (!absence) {
        return (
            <div className="max-w-2xl mx-auto glass-card p-12 text-center">
                <p className="text-slate-400">Absence introuvable</p>
                <Link href="/absences" className="text-blue-400 text-sm mt-2 inline-block">Retour</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/absences" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour aux absences
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {absence.employe?.prenom} {absence.employe?.nom}
                    </h1>
                    <p className="text-slate-400 mt-1">{getAbsenceTypeLabel(absence.type)}</p>
                </div>
                <span className={`badge text-sm ${getStatutColor(absence.statut)}`}>
                    {getStatutLabel(absence.statut)}
                </span>
            </div>

            {/* Dates */}
            <div className="glass-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Dates demandées
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <span className="text-xs font-bold text-blue-400 w-16">Choix 1</span>
                        <span className="text-sm text-white">
                            Du {formatDate(absence.date_dernier_jour_travaille)} au {formatDate(absence.date_reprise)}
                        </span>
                    </div>
                    {absence.choix_dates_2 && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <span className="text-xs font-bold text-slate-500 w-16">Choix 2</span>
                            <span className="text-sm text-slate-300">
                                Du {formatDate(absence.choix_dates_2.dernier_jour)} au {formatDate(absence.choix_dates_2.reprise)}
                            </span>
                        </div>
                    )}
                    {absence.choix_dates_3 && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <span className="text-xs font-bold text-slate-500 w-16">Choix 3</span>
                            <span className="text-sm text-slate-300">
                                Du {formatDate(absence.choix_dates_3.dernier_jour)} au {formatDate(absence.choix_dates_3.reprise)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="glass-card p-5 space-y-3">
                {absence.derniere_minute && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-300">Demande de dernière minute</span>
                    </div>
                )}
                {absence.commentaire && (
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Commentaire</p>
                        <p className="text-sm text-slate-300">{absence.commentaire}</p>
                    </div>
                )}
                <div className="flex gap-6 text-sm">
                    <div>
                        <p className="text-xs text-slate-500">Profil</p>
                        <p className="text-slate-300">{absence.employe?.profil_vehicule || '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Soumise le</p>
                        <p className="text-slate-300">{formatDate(absence.created_at)}</p>
                    </div>
                </div>
            </div>

            {/* Actions admin */}
            {canValidate && (
                <div className="glass-card p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-white">Actions</h2>

                    <button
                        onClick={handleValidate}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        Valider cette absence
                    </button>

                    <div className="space-y-2">
                        <textarea
                            value={motifRefus}
                            onChange={(e) => setMotifRefus(e.target.value)}
                            placeholder="Motif du refus (obligatoire)..."
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none text-sm"
                        />
                        <button
                            onClick={handleRefuse}
                            disabled={loading || !motifRefus.trim()}
                            className="w-full py-3 bg-red-500/15 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                            Refuser
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
