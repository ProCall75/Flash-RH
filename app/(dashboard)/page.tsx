'use client';

import { useState, useEffect } from 'react';
import { CalendarOff, Receipt, MessageSquare, AlertTriangle, Clock, TrendingUp, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useUser';
import { getAbsenceStats } from '@/lib/actions/absences';
import { getReleves } from '@/lib/actions/frais';
import { getUnreadCount } from '@/lib/actions/notifications';

interface KPI {
    label: string;
    value: string;
    icon: typeof CalendarOff;
    color: string;
    change: string;
}

export default function DashboardPage() {
    const { isAdmin, isBureau, profile } = useUser();
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [absStats, releves, unread] = await Promise.all([
                    getAbsenceStats().catch(() => ({ en_attente: 0, validee: 0, refusee: 0, total: 0 })),
                    getReleves({ statut: 'soumis' }).catch(() => []),
                    profile?.id ? getUnreadCount(profile.id).catch(() => 0) : Promise.resolve(0),
                ]);

                if (isAdmin || isBureau) {
                    setKpis([
                        { label: 'Absences en attente', value: String(absStats.en_attente), icon: CalendarOff, color: 'from-amber-500 to-orange-600', change: `${absStats.total} total` },
                        { label: 'Frais à valider', value: String(releves.length), icon: Receipt, color: 'from-blue-500 to-indigo-600', change: 'Période en cours' },
                        { label: 'Effectif', value: `${absStats.total}`, icon: UserCheck, color: 'from-emerald-500 to-teal-600', change: `${absStats.validee} validées` },
                        { label: 'Notifications', value: String(unread), icon: MessageSquare, color: 'from-violet-500 to-purple-600', change: 'Non lues' },
                    ]);
                } else {
                    setKpis([
                        { label: 'Mes absences', value: String(absStats.total), icon: CalendarOff, color: 'from-blue-500 to-indigo-600', change: `${absStats.en_attente} en attente` },
                        { label: 'Mes frais', value: releves.length > 0 ? `${releves[0].total_general} €` : '0 €', icon: Receipt, color: 'from-emerald-500 to-teal-600', change: 'Période en cours' },
                        { label: 'Messages', value: String(unread), icon: MessageSquare, color: 'from-violet-500 to-purple-600', change: 'Non lus' },
                        { label: 'Solde CP', value: '—', icon: Clock, color: 'from-amber-500 to-orange-600', change: 'Voir les absences' },
                    ]);
                }
            } catch {
                void 0; // error handled silently
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [isAdmin, isBureau, profile?.id]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Bonjour{profile ? `, ${profile.prenom}` : ''} 👋
                </h1>
                <p className="text-slate-400 mt-1">
                    {isAdmin || isBureau
                        ? 'Vue d\'ensemble de la gestion RH'
                        : 'Votre espace personnel'}
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass-card p-4 md:p-5 animate-pulse">
                            <div className="w-10 h-10 rounded-xl bg-white/10 mb-3" />
                            <div className="h-7 w-12 bg-white/10 rounded mb-2" />
                            <div className="h-4 w-24 bg-white/5 rounded" />
                        </div>
                    ))
                ) : kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="glass-card p-4 md:p-5 animate-in">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white">{kpi.value}</p>
                            <p className="text-sm text-slate-400 mt-0.5">{kpi.label}</p>
                            <p className="text-xs text-slate-500 mt-1">{kpi.change}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick actions for admin */}
                {(isAdmin || isBureau) && (
                    <div className="lg:col-span-2 glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Vue d&apos;ensemble</h2>
                            <TrendingUp className="w-5 h-5 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-400 mb-4">
                            Les données sont chargées depuis Supabase en temps réel. Utilisez le menu latéral pour accéder aux différentes sections.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/absences" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm">
                                <CalendarOff className="w-4 h-4" />
                                <span>Absences</span>
                            </Link>
                            <Link href="/frais" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm">
                                <Receipt className="w-4 h-4" />
                                <span>Notes de frais</span>
                            </Link>
                            <Link href="/messages" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm">
                                <MessageSquare className="w-4 h-4" />
                                <span>Messages</span>
                            </Link>
                            <Link href="/export" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span>Export</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Alerts */}
                {(isAdmin || isBureau) && (
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <h2 className="text-lg font-semibold text-white">Actions rapides</h2>
                        </div>
                        <div className="space-y-2">
                            <Link
                                href="/absences"
                                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm"
                            >
                                <CalendarOff className="w-4 h-4" />
                                Valider les absences
                            </Link>
                            <Link
                                href="/frais"
                                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm"
                            >
                                <Receipt className="w-4 h-4" />
                                Vérifier les relevés
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
