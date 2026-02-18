'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { AbsenceType } from '@/types/database';
import { createAbsence } from '@/lib/actions/absences';

const absenceTypes: { value: AbsenceType; label: string }[] = [
    { value: 'cp', label: 'Congés payés' },
    { value: 'cp_anticipation', label: 'CP par anticipation' },
    { value: 'sans_solde', label: 'Congé sans solde' },
    { value: 'maladie', label: 'Maladie' },
    { value: 'accident_travail', label: 'Accident de travail' },
    { value: 'exceptionnelle', label: 'Absence exceptionnelle' },
];

export default function NouvelleAbsencePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState<AbsenceType>('cp');
    const [dateDebut1, setDateDebut1] = useState('');
    const [dateReprise1, setDateReprise1] = useState('');
    const [dateDebut2, setDateDebut2] = useState('');
    const [dateReprise2, setDateReprise2] = useState('');
    const [dateDebut3, setDateDebut3] = useState('');
    const [dateReprise3, setDateReprise3] = useState('');
    const [commentaire, setCommentaire] = useState('');
    const [derniereMinute, setDerniereMinute] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createAbsence({
                type,
                date_dernier_jour_travaille: dateDebut1,
                date_reprise: dateReprise1,
                choix_dates_2: dateDebut2 && dateReprise2
                    ? { dernier_jour: dateDebut2, reprise: dateReprise2 }
                    : null,
                choix_dates_3: dateDebut3 && dateReprise3
                    ? { dernier_jour: dateDebut3, reprise: dateReprise3 }
                    : undefined,
                commentaire: commentaire || undefined,
                derniere_minute: derniereMinute,
            });
            router.push('/absences');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
            setLoading(false);
        }
    }

    const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';
    const labelClass = 'block text-sm font-medium text-slate-300 mb-1.5';

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/absences" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour aux absences
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-white">Nouvelle demande d&apos;absence</h1>
                <p className="text-slate-400 mt-1">Remplissez le formulaire ci-dessous. Vous pouvez proposer jusqu&apos;à 3 choix de dates.</p>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type */}
                <div className="glass-card p-5">
                    <label className={labelClass}>Type d&apos;absence</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as AbsenceType)}
                        className={inputClass}
                    >
                        {absenceTypes.map((t) => (
                            <option key={t.value} value={t.value} className="bg-slate-800">{t.label}</option>
                        ))}
                    </select>
                </div>

                {/* Choix 1 (obligatoire) */}
                <div className="glass-card p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <h2 className="text-sm font-semibold text-white">Choix de dates n°1</h2>
                        <span className="text-xs text-red-400">*obligatoire</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Dernier jour travaillé</label>
                            <input type="date" required value={dateDebut1} onChange={(e) => setDateDebut1(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Date de reprise</label>
                            <input type="date" required value={dateReprise1} onChange={(e) => setDateReprise1(e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Choix 2 (optionnel) */}
                <div className="glass-card p-5 space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <h2 className="text-sm font-semibold text-slate-300">Choix de dates n°2</h2>
                        <span className="text-xs text-slate-600">optionnel</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Dernier jour travaillé</label>
                            <input type="date" value={dateDebut2} onChange={(e) => setDateDebut2(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Date de reprise</label>
                            <input type="date" value={dateReprise2} onChange={(e) => setDateReprise2(e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Choix 3 (optionnel) */}
                <div className="glass-card p-5 space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <h2 className="text-sm font-semibold text-slate-300">Choix de dates n°3</h2>
                        <span className="text-xs text-slate-600">optionnel</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Dernier jour travaillé</label>
                            <input type="date" value={dateDebut3} onChange={(e) => setDateDebut3(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Date de reprise</label>
                            <input type="date" value={dateReprise3} onChange={(e) => setDateReprise3(e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Dernière minute + Commentaire */}
                <div className="glass-card p-5 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={derniereMinute}
                            onChange={(e) => setDerniereMinute(e.target.checked)}
                            className="w-5 h-5 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">Demande de dernière minute (délai &lt; 48h)</span>
                    </label>

                    <div>
                        <label className={labelClass}>Commentaire</label>
                        <textarea
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            rows={3}
                            placeholder="Précisions éventuelles..."
                            className={inputClass + ' resize-none'}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !dateDebut1 || !dateReprise1}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
                </button>
            </form>
        </div>
    );
}
