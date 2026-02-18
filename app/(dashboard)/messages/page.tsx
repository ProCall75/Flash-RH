'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MessageSquare, Bell, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useUser } from '@/lib/hooks/useUser';
import { getMessages } from '@/lib/actions/messages';
import type { Message, MessageType } from '@/types/database';

const typeIcons: Record<MessageType, typeof Bell> = {
    note_service: FileText,
    info: MessageSquare,
    rappel: Bell,
    urgent: AlertTriangle,
};

const typeColors: Record<MessageType, string> = {
    note_service: 'bg-blue-500/15 text-blue-400',
    info: 'bg-slate-500/15 text-slate-400',
    rappel: 'bg-amber-500/15 text-amber-400',
    urgent: 'bg-red-500/15 text-red-400',
};

export default function MessagesPage() {
    const { isAdmin, isBureau, profile } = useUser();
    const [filter, setFilter] = useState<MessageType | 'tous'>('tous');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getMessages();
                setMessages(data);
            } catch (err) {
                console.error('Messages load error:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = filter === 'tous'
        ? messages
        : messages.filter((m) => m.type === filter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Messagerie</h1>
                    <p className="text-slate-400 mt-1">Communication interne</p>
                </div>
                {(isAdmin || isBureau) && (
                    <Link
                        href="/messages/nouveau"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Nouveau message</span>
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {([['tous', 'Tous'], ['urgent', 'Urgents'], ['note_service', 'Notes'], ['rappel', 'Rappels'], ['info', 'Infos']] as const).map(([key, label]) => (
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

            {/* Messages */}
            {!loading && (
                <div className="space-y-2">
                    {filtered.map((msg) => {
                        const Icon = typeIcons[msg.type] || MessageSquare;
                        const userId = profile?.id || '';
                        const isRead = (msg.lu_par || []).includes(userId);
                        return (
                            <Link
                                key={msg.id}
                                href={`/messages/${msg.id}`}
                                className={`glass-card p-4 flex items-start gap-4 hover:border-blue-500/20 transition-all group ${!isRead ? 'border-l-2 border-l-blue-500' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[msg.type] || 'bg-slate-500/15 text-slate-400'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-semibold group-hover:text-blue-300 transition-colors ${!isRead ? 'text-white' : 'text-slate-300'}`}>
                                            {msg.titre}
                                        </p>
                                        {!isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {msg.auteur ? `${msg.auteur.prenom} ${msg.auteur.nom}` : 'Admin'} — {formatDate(msg.created_at)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="glass-card p-12 text-center">
                            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">Aucun message</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
