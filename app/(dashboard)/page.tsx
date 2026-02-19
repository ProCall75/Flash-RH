'use client';

import { useState, useEffect } from 'react';
import { CalendarOff, Receipt, MessageSquare, AlertTriangle, Clock, TrendingUp, UserCheck, Calendar, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useUser';
import { getAbsenceStats, getAbsences } from '@/lib/actions/absences';
import { getReleves } from '@/lib/actions/frais';
import { getUnreadCount } from '@/lib/actions/notifications';
import { getAllContestations } from '@/lib/actions/contestations';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { formatDateShort, getStatutLabel, getAbsenceTypeLabel } from '@/lib/utils';
import type { Absence } from '@/types/database';

interface KPI {
    label: string;
    value: string;
    icon: typeof CalendarOff;
    colorClass: string;
    change: string;
}

const kpiStyles: Record<string, { bg: string; color: string }> = {
    orange: { bg: 'var(--warning-bg)', color: '#92400e' },
    green: { bg: 'var(--success-bg)', color: '#065f46' },
    purple: { bg: 'var(--primary-bg)', color: 'var(--primary)' },
    blue: { bg: 'var(--info-bg)', color: '#1e40af' },
};

// Generate days for a month grid
function getDaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Pad start to Monday
    const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon
    for (let i = startDow - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        days.push(d);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    // Pad end to fill week
    while (days.length % 7 !== 0) {
        days.push(new Date(year, month + 1, days.length - lastDay.getDate() - startDow + 1));
    }
    return days;
}

export default function DashboardPage() {
    const { isAdmin, isBureau, profile, loading: userLoading } = useUser();
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recentItems, setRecentItems] = useState<{ type: string; label: string; name: string; statut: string; date: string; href: string }[]>([]);
    const [absencesForCal, setAbsencesForCal] = useState<Absence[]>([]);
    const [alertes, setAlertes] = useState<{ label: string; count: number; href: string; color: string }[]>([]);
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [calYear, setCalYear] = useState(new Date().getFullYear());

    useEffect(() => {
        async function load() {
            try {
                setError('');
                const isMgr = isAdmin || isBureau;
                const [absStats, releves, unread] = await Promise.all([
                    getAbsenceStats(isMgr ? undefined : profile?.id).catch(() => ({ en_attente: 0, validee: 0, refusee: 0, total: 0 })),
                    getReleves(isMgr ? { statut: 'soumis' } : { userId: profile?.id }).catch(() => []),
                    profile?.id ? getUnreadCount(profile.id).catch(() => 0) : Promise.resolve(0),
                ]);

                if (isAdmin || isBureau) {
                    setKpis([
                        { label: 'Demandes en attente', value: String(absStats.en_attente), icon: Clock, colorClass: 'orange', change: `${absStats.total} total` },
                        { label: 'Frais à valider', value: String(releves.length), icon: Receipt, colorClass: 'blue', change: 'Période en cours' },
                        { label: 'Effectif actif', value: `${absStats.total}`, icon: UserCheck, colorClass: 'green', change: `${absStats.validee} validées` },
                        { label: 'Notifications', value: String(unread), icon: MessageSquare, colorClass: 'purple', change: 'Non lues' },
                    ]);

                    // Feed: recent absences
                    const allAbsences = await getAbsences().catch(() => []);
                    const recent = allAbsences.slice(0, 8).map((a: Absence) => ({
                        type: 'absence',
                        label: getAbsenceTypeLabel(a.type),
                        name: a.employe ? `${a.employe.prenom} ${a.employe.nom}` : '—',
                        statut: a.statut,
                        date: a.created_at,
                        href: `/absences/${a.id}`,
                    }));
                    setRecentItems(recent);

                    // Absences for calendar
                    const validees = allAbsences.filter((a: Absence) => a.statut === 'validee');
                    setAbsencesForCal(validees);

                    // Alertes
                    const contestations = await getAllContestations().catch(() => []);
                    const openContestations = Array.isArray(contestations)
                        ? contestations.filter((c: { statut: string }) => c.statut === 'ouverte').length
                        : 0;
                    const urgentAbsences = allAbsences.filter((a: Absence) => a.derniere_minute && a.statut === 'en_attente').length;

                    const alertsList = [];
                    if (absStats.en_attente > 0) alertsList.push({ label: 'Absences en attente', count: absStats.en_attente, href: '/absences', color: '#f59e0b' });
                    if (openContestations > 0) alertsList.push({ label: 'Contestations ouvertes', count: openContestations, href: '/frais', color: '#ef4444' });
                    if (urgentAbsences > 0) alertsList.push({ label: 'Absences dernière minute', count: urgentAbsences, href: '/absences', color: '#ef4444' });
                    if (releves.length > 0) alertsList.push({ label: 'Relevés à valider', count: releves.length, href: '/frais', color: '#3b82f6' });
                    setAlertes(alertsList);
                } else {
                    setKpis([
                        { label: 'Mes absences', value: String(absStats.total), icon: CalendarOff, colorClass: 'blue', change: `${absStats.en_attente} en attente` },
                        { label: 'Mes frais', value: releves.length > 0 ? `${releves[0].total_general} €` : '0 €', icon: Receipt, colorClass: 'green', change: 'Période en cours' },
                        { label: 'Messages', value: String(unread), icon: MessageSquare, colorClass: 'purple', change: 'Non lus' },
                        { label: 'Solde CP', value: '—', icon: Clock, colorClass: 'orange', change: 'Voir les absences' },
                    ]);
                }
            } catch {
                setError('Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        }
        if (userLoading || !profile?.id) return;
        load();
    }, [isAdmin, isBureau, profile?.id, userLoading]);

    const reload = () => { setLoading(true); setError(''); };

    // Calendar helpers
    const days = getDaysInMonth(calYear, calMonth);
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    function getAbsencesForDay(day: Date): Absence[] {
        const dayStr = day.toISOString().split('T')[0];
        return absencesForCal.filter((a) => {
            const start = a.date_dernier_jour_travaille;
            const end = a.date_reprise;
            return dayStr >= start && dayStr <= end;
        });
    }

    function prevMonth() {
        if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
        else setCalMonth(calMonth - 1);
    }
    function nextMonth() {
        if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
        else setCalMonth(calMonth + 1);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {error && <ErrorBanner message={error} onRetry={reload} />}
            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>
                        Bonjour{profile ? `, ${profile.prenom}` : ''} 👋
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                        {isAdmin || isBureau
                            ? 'Vue d\'ensemble de la gestion RH'
                            : 'Votre espace personnel'}
                    </p>
                </div>
                <Link href="/absences/nouvelle" className="btn btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>
                    + Nouvelle demande
                </Link>
            </div>

            {/* KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{
                            background: 'var(--white)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '22px 24px',
                        }} className="animate-pulse">
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', marginBottom: '14px' }} />
                            <div style={{ width: '60px', height: '30px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '4px' }} />
                            <div style={{ width: '100px', height: '16px', background: 'var(--bg)', borderRadius: '6px' }} />
                        </div>
                    ))
                ) : kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    const style = kpiStyles[kpi.colorClass] || kpiStyles.blue;
                    const kpiId = idx === 0 ? 'kpi-absences' : idx === 1 ? 'kpi-frais' : idx === 2 ? 'kpi-effectif' : 'kpi-notifs';
                    return (
                        <div key={kpi.label} id={kpiId} style={{
                            background: 'var(--white)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '22px 24px',
                            transition: 'all var(--transition)', cursor: 'default',
                            position: 'relative', overflow: 'hidden',
                        }} className="animate-in hover:shadow-md hover:-translate-y-0.5">
                            <div style={{
                                width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '14px', background: style.bg, color: style.color,
                            }}>
                                <Icon style={{ width: '18px', height: '18px' }} />
                            </div>
                            <p style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1, marginBottom: '4px', color: 'var(--text)' }}>
                                {kpi.value}
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{kpi.label}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>{kpi.change}</p>
                        </div>
                    );
                })}
            </div>

            {/* Alertes */}
            {(isAdmin || isBureau) && alertes.length > 0 && (
                <div style={{
                    display: 'flex', gap: '12px', flexWrap: 'wrap',
                }}>
                    {alertes.map((a) => (
                        <Link key={a.label} href={a.href} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px', borderRadius: 'var(--radius-pill)',
                            background: `${a.color}12`, border: `1px solid ${a.color}30`,
                            color: a.color, fontSize: '13px', fontWeight: 600,
                            textDecoration: 'none', transition: 'all var(--transition-fast)',
                        }}>
                            <Bell style={{ width: '14px', height: '14px' }} />
                            {a.count} {a.label}
                        </Link>
                    ))}
                </div>
            )}

            {/* Two-column: Feed + Calendar */}
            {(isAdmin || isBureau) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }} className="dashboard-grid">

                    {/* Feed */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>Dernières demandes</h2>
                            <Link href="/absences" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Voir tout →</Link>
                        </div>
                        {recentItems.length === 0 ? (
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>Aucune demande récente</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {recentItems.map((item, i) => {
                                    return (
                                        <Link key={i} href={item.href} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '12px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                                            textDecoration: 'none', color: 'inherit',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                    background: 'var(--primary-bg)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <CalendarOff style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{item.name}</p>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label} · {formatDateShort(item.date)}</p>
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                                                fontSize: '11px', fontWeight: 600,
                                                background: item.statut === 'validee' ? 'var(--success-bg)' : item.statut === 'refusee' ? 'var(--error-bg)' : 'var(--warning-bg)',
                                                color: item.statut === 'validee' ? '#065f46' : item.statut === 'refusee' ? '#991b1b' : '#92400e',
                                            }}>{getStatutLabel(item.statut)}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Team Calendar */}
                    <div id="absence-calendar" className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                                <Calendar style={{ width: '16px', height: '16px', display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                                Calendrier d&apos;équipe
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                                    <ChevronLeft style={{ width: '16px', height: '16px' }} />
                                </button>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', minWidth: '120px', textAlign: 'center' }}>
                                    {monthNames[calMonth]} {calYear}
                                </span>
                                <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                                </button>
                            </div>
                        </div>

                        {/* Mini month grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '20px' }}>
                            {dayNames.map((d) => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0', textTransform: 'uppercase' }}>{d}</div>
                            ))}
                            {days.map((day, i) => {
                                const isCurrentMonth = day.getMonth() === calMonth;
                                const isToday = day.toDateString() === new Date().toDateString();
                                const absForDay = getAbsencesForDay(day);
                                const hasAbsences = absForDay.length > 0;
                                return (
                                    <div key={i} title={hasAbsences ? absForDay.map(a => `${a.employe?.prenom} ${a.employe?.nom}`).join(', ') : undefined} style={{
                                        textAlign: 'center', padding: '6px 2px', fontSize: '12px',
                                        borderRadius: '6px', position: 'relative',
                                        color: isCurrentMonth ? 'var(--text)' : 'var(--text-muted)',
                                        opacity: isCurrentMonth ? 1 : 0.35,
                                        fontWeight: isToday ? 700 : 400,
                                        background: isToday ? 'var(--primary-bg)' : hasAbsences ? 'var(--warning-bg)' : 'transparent',
                                        cursor: hasAbsences ? 'pointer' : 'default',
                                    }}>
                                        {day.getDate()}
                                        {hasAbsences && (
                                            <div style={{
                                                position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)',
                                                width: '4px', height: '4px', borderRadius: '50%',
                                                background: '#f59e0b',
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Team absence list for this month */}
                        {(() => {
                            const monthStart = new Date(calYear, calMonth, 1).toISOString().split('T')[0];
                            const monthEnd = new Date(calYear, calMonth + 1, 0).toISOString().split('T')[0];
                            const monthAbsences = absencesForCal.filter((a) => {
                                return a.date_reprise >= monthStart && a.date_dernier_jour_travaille <= monthEnd;
                            });

                            const absenceColors: Record<string, { bg: string; text: string; label: string }> = {
                                conge_paye: { bg: '#dbeafe', text: '#1e40af', label: 'CP' },
                                maladie: { bg: '#fef3c7', text: '#92400e', label: 'Maladie' },
                                rtt: { bg: '#d1fae5', text: '#065f46', label: 'RTT' },
                                sans_solde: { bg: '#fce7f3', text: '#9d174d', label: 'Sans solde' },
                                formation: { bg: '#e0e7ff', text: '#3730a3', label: 'Formation' },
                                autre: { bg: '#f3f4f6', text: '#374151', label: 'Autre' },
                            };

                            if (monthAbsences.length === 0) {
                                return (
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                                        Aucune absence ce mois
                                    </p>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                                        Absences validées
                                    </p>
                                    {monthAbsences.map((a) => {
                                        const style = absenceColors[a.type] || absenceColors.autre;
                                        const startDate = new Date(a.date_dernier_jour_travaille);
                                        const endDate = new Date(a.date_reprise);
                                        const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                        return (
                                            <Link key={a.id} href={`/absences/${a.id}`} style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '8px 12px', borderRadius: '8px',
                                                background: style.bg, textDecoration: 'none',
                                                transition: 'all var(--transition-fast)',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                                    <div style={{
                                                        width: '6px', height: '6px', borderRadius: '50%',
                                                        background: style.text, flexShrink: 0,
                                                    }} />
                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: style.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {a.employe ? `${a.employe.prenom} ${a.employe.nom}` : '—'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                                    <span style={{ fontSize: '10px', fontWeight: 600, color: style.text, opacity: 0.7 }}>
                                                        {diffDays}j · {style.label}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: style.text, opacity: 0.6 }}>
                                                        {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → {endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Quick links for conducteur */}
            {!(isAdmin || isBureau) && (
                <div className="glass-card">
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Accès rapides</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="kpi-grid">
                        {[
                            { href: '/absences/nouvelle', label: 'Nouvelle absence', icon: CalendarOff },
                            { href: '/frais/saisie', label: 'Saisir mes frais', icon: Receipt },
                            { href: '/messages', label: 'Messages', icon: MessageSquare },
                            { href: '/notifications', label: 'Notifications', icon: Bell },
                        ].map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link key={link.href} href={link.href} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '16px', borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border)', background: 'var(--white)',
                                    color: 'var(--text)', fontSize: '14px', fontWeight: 500,
                                    textDecoration: 'none', transition: 'all var(--transition-fast)',
                                }}>
                                    <Icon style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
