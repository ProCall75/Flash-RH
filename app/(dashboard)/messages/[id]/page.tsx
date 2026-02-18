'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getMessageById, markAsRead } from '@/lib/actions/messages';
import type { Message } from '@/types/database';

export default function MessageDetailPage() {
    const params = useParams();
    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getMessageById(params.id as string);
                setMessage(data);
                // Mark as read
                await markAsRead(params.id as string).catch(() => { });
            } catch (err) {
                console.error('Message load error:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params.id]);

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto glass-card p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                <p className="text-slate-400 mt-2">Chargement...</p>
            </div>
        );
    }

    if (!message) {
        return (
            <div className="max-w-2xl mx-auto glass-card p-12 text-center">
                <p className="text-slate-400">Message introuvable</p>
                <Link href="/messages" className="text-blue-400 text-sm mt-2 inline-block">Retour</Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/messages" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour aux messages
            </Link>

            <div className="glass-card p-6 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {message.auteur?.prenom?.[0] || 'A'}{message.auteur?.nom?.[0] || 'D'}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white">{message.titre}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-400">
                                {message.auteur ? `${message.auteur.prenom} ${message.auteur.nom}` : 'Admin'}
                            </span>
                            <span className="text-xs text-slate-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(message.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                    <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {message.contenu}
                    </div>
                </div>
            </div>
        </div>
    );
}
