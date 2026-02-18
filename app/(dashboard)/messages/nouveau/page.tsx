'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import type { MessageType, Destinataires } from '@/types/database';
import { createMessage } from '@/lib/actions/messages';

export default function NouveauMessagePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [titre, setTitre] = useState('');
    const [contenu, setContenu] = useState('');
    const [type, setType] = useState<MessageType>('info');
    const [destinataires, setDestinataires] = useState<Destinataires>('tous');

    const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createMessage({ titre, contenu, type, destinataires });
            router.push('/messages');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/messages" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour aux messages
            </Link>

            <h1 className="text-2xl font-bold text-white">Nouveau message</h1>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="glass-card p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value as MessageType)} className={inputClass}>
                                <option value="info" className="bg-slate-800">Information</option>
                                <option value="note_service" className="bg-slate-800">Note de service</option>
                                <option value="rappel" className="bg-slate-800">Rappel</option>
                                <option value="urgent" className="bg-slate-800">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Destinataires</label>
                            <select value={destinataires} onChange={(e) => setDestinataires(e.target.value as Destinataires)} className={inputClass}>
                                <option value="tous" className="bg-slate-800">Tous les employés</option>
                                <option value="conducteurs_pl" className="bg-slate-800">Conducteurs PL</option>
                                <option value="conducteurs_vl" className="bg-slate-800">Conducteurs VL</option>
                                <option value="bureau" className="bg-slate-800">Bureau uniquement</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Titre</label>
                        <input type="text" required value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Objet du message" className={inputClass} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Contenu</label>
                        <textarea required value={contenu} onChange={(e) => setContenu(e.target.value)} rows={6} placeholder="Rédigez votre message..." className={inputClass + ' resize-none'} />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !titre || !contenu}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {loading ? 'Envoi...' : 'Envoyer'}
                </button>
            </form>
        </div>
    );
}
