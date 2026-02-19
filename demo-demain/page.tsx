'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
    Home, CalendarOff, Receipt, MessageSquare, ChevronLeft,
    Plus, Clock, CheckCircle, XCircle, AlertTriangle, FileText,
    Bell, Truck, User, Send, ChevronsRight, Eye, X,
    ChevronDown, ChevronUp, Coffee, Moon, Utensils, MapPin
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type TabId = 'home' | 'absences' | 'frais' | 'messages';
type Screen =
    | { type: 'tab'; tab: TabId }
    | { type: 'absenceDetail'; absence: Absence }
    | { type: 'newAbsence' }
    | { type: 'fraisDetail' }
    | { type: 'messageDetail'; message: Message };

type AbsenceType = 'cp' | 'cp_anticipation' | 'sans_solde' | 'maladie' | 'accident_travail' | 'exceptionnelle';
type AbsenceStatut = 'en_attente' | 'validee' | 'refusee';
type ReleveStatut = 'brouillon' | 'soumis' | 'valide' | 'corrige' | 'conteste';
type MessageType = 'note_service' | 'info' | 'rappel' | 'urgent';

interface Absence {
    id: string;
    type: AbsenceType;
    dateDebut: string;
    dateFin: string;
    statut: AbsenceStatut;
    commentaire?: string;
    motifRefus?: string;
    derniereMinute?: boolean;
    createdAt: string;
}

interface FraisLigne {
    categorie: string;
    montant: number;
    jours: number;
    total: number;
    icon: 'repas' | 'nuit' | 'carburant' | 'prime';
}

interface Message {
    id: string;
    titre: string;
    contenu: string;
    type: MessageType;
    auteur: string;
    date: string;
    lu: boolean;
}

/* ═══════════════════════════════════════════════════════
   MOCK DATA — Based on real Flash Transports context
═══════════════════════════════════════════════════════ */
const CONDUCTEUR = { prenom: 'Pierre', nom: 'Martin', profil: 'PL' as const, equipe: 'Poids Lourds' };

const MOCK_ABSENCES: Absence[] = [
    {
        id: '1', type: 'cp', dateDebut: '2026-03-10', dateFin: '2026-03-14',
        statut: 'validee', createdAt: '2026-02-20T10:00:00Z',
    },
    {
        id: '2', type: 'cp', dateDebut: '2026-02-24', dateFin: '2026-02-28',
        statut: 'en_attente', commentaire: 'Vacances familiales', createdAt: '2026-02-15T10:00:00Z',
    },
    {
        id: '3', type: 'maladie', dateDebut: '2026-02-03', dateFin: '2026-02-05',
        statut: 'validee', derniereMinute: true, createdAt: '2026-02-03T07:00:00Z',
    },
    {
        id: '4', type: 'sans_solde', dateDebut: '2026-01-15', dateFin: '2026-01-17',
        statut: 'refusee', motifRefus: 'Période de forte activité — tous les PL sont mobilisés.',
        createdAt: '2026-01-10T09:00:00Z',
    },
];

const MOCK_FRAIS: FraisLigne[] = [
    { categorie: 'Repas midi province', montant: 9, jours: 14, total: 126, icon: 'repas' },
    { categorie: 'Repas soir province', montant: 16, jours: 10, total: 160, icon: 'repas' },
    { categorie: 'Casse-croûte', montant: 19, jours: 3, total: 57, icon: 'repas' },
    { categorie: 'Nuit province PL', montant: 65, jours: 5, total: 325, icon: 'nuit' },
    { categorie: 'Repas midi RP', montant: 10, jours: 6, total: 60, icon: 'repas' },
    { categorie: 'Repas soir RP', montant: 10, jours: 4, total: 40, icon: 'repas' },
];

const MOCK_PRIMES: FraisLigne[] = [
    { categorie: 'Départ dimanche', montant: 45, jours: 2, total: 90, icon: 'prime' },
    { categorie: 'Samedi travaillé', montant: 70, jours: 1, total: 70, icon: 'prime' },
];

const MOCK_MESSAGES: Message[] = [
    {
        id: '1', titre: 'Rappel : saisie des frais avant le 17',
        contenu: 'Merci de compléter votre saisie de frais avant le 17 février. Passé cette date, une relance automatique sera envoyée.\n\nEn cas de difficulté, contactez le bureau.',
        type: 'rappel', auteur: 'Brice GERARD', date: '16 fév.', lu: false,
    },
    {
        id: '2', titre: 'Note de service — Procédure livraison zone piétonne',
        contenu: 'Suite aux nouvelles réglementations municipales, toute livraison en zone piétonne doit être effectuée avant 10h.\n\nMerci de planifier vos tournées en conséquence. En cas d\'impossibilité, contactez l\'exploitation.',
        type: 'note_service', auteur: 'Delphine MOREAU', date: '14 fév.', lu: true,
    },
    {
        id: '3', titre: 'URGENT — Fermeture A86 ce weekend',
        contenu: 'L\'autoroute A86 sera fermée entre Taverny et Argenteuil ce weekend (15-16 fév.) pour travaux.\n\nItinéraire alternatif conseillé : D928 → N1 → D407.\n\nContactez l\'exploitation si besoin d\'ajuster vos tournées.',
        type: 'urgent', auteur: 'Brice GERARD', date: '13 fév.', lu: true,
    },
    {
        id: '4', titre: 'Documents disponibles — Fiches de paie janvier',
        contenu: 'Vos fiches de paie de janvier 2026 sont disponibles. Merci de vérifier vos coordonnées bancaires.',
        type: 'info', auteur: 'Comptabilité', date: '10 fév.', lu: true,
    },
    {
        id: '5', titre: 'Bienvenue à Thomas Petit',
        contenu: 'Nous accueillons Thomas Petit dans l\'équipe VL à compter du 10 février. Bienvenue à lui !',
        type: 'info', auteur: 'Brice GERARD', date: '10 fév.', lu: true,
    },
];

const ACTIVITY = [
    { action: 'CP validé', detail: '10-14 mars', time: '2h', color: 'bg-emerald-500' },
    { action: 'Frais soumis', detail: 'Période janv-fév : 928 €', time: '4h', color: 'bg-blue-500' },
    { action: 'Note de service', detail: 'Procédure zone piétonne', time: 'Hier', color: 'bg-violet-500' },
    { action: 'Frais corrigés', detail: 'Nuit province manquante ajoutée', time: 'Hier', color: 'bg-amber-500' },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const absenceTypeLabel: Record<AbsenceType, string> = {
    cp: 'Congés payés', cp_anticipation: 'CP anticipation', sans_solde: 'Sans solde',
    maladie: 'Maladie', accident_travail: 'Accident travail', exceptionnelle: 'Exceptionnelle',
};

const statutConfig: Record<AbsenceStatut, { label: string; color: string; bg: string; border: string }> = {
    en_attente: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/25' },
    validee: { label: 'Validé', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25' },
    refusee: { label: 'Refusé', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/25' },
};

const msgTypeConfig: Record<MessageType, { icon: typeof Bell; color: string }> = {
    rappel: { icon: Bell, color: 'bg-amber-500/15 text-amber-400' },
    note_service: { icon: FileText, color: 'bg-blue-500/15 text-blue-400' },
    urgent: { icon: AlertTriangle, color: 'bg-red-500/15 text-red-400' },
    info: { icon: MessageSquare, color: 'bg-slate-500/15 text-slate-400' },
};

const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function FlashRHMobileDemo() {
    const [screen, setScreen] = useState<Screen>({ type: 'tab', tab: 'home' });
    const [absences, setAbsences] = useState(MOCK_ABSENCES);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [fraisChecked, setFraisChecked] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<string | null>(null);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    }, []);

    const currentTab = screen.type === 'tab' ? screen.tab : null;
    const goTab = (tab: TabId) => setScreen({ type: 'tab', tab });
    const goBack = () => goTab(
        screen.type === 'absenceDetail' || screen.type === 'newAbsence' ? 'absences' :
            screen.type === 'fraisDetail' ? 'frais' :
                screen.type === 'messageDetail' ? 'messages' : 'home'
    );

    const unreadCount = messages.filter(m => !m.lu).length;
    const totalFrais = MOCK_FRAIS.reduce((s, f) => s + f.total, 0);
    const totalPrimes = MOCK_PRIMES.reduce((s, p) => s + p.total, 0);
    const totalGeneral = totalFrais + totalPrimes;

    /* ─── NEW ABSENCE ─── */
    const [newAbsType, setNewAbsType] = useState<AbsenceType>('cp');
    const [newAbsComment, setNewAbsComment] = useState('');

    const submitAbsence = () => {
        const now = new Date();
        const newAbs: Absence = {
            id: `new-${Date.now()}`,
            type: newAbsType,
            dateDebut: '2026-04-07',
            dateFin: '2026-04-11',
            statut: 'en_attente',
            commentaire: newAbsComment || undefined,
            createdAt: now.toISOString(),
        };
        setAbsences(prev => [newAbs, ...prev]);
        showToast('✅ Demande envoyée à Brice GERARD');
        goTab('absences');
    };

    /* ─── MARK MESSAGE READ ─── */
    const markRead = (id: string) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, lu: true } : m));
    };

    /* ═══════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════ */
    return (
        <div className="flex items-center justify-center min-h-screen"
            style={{ background: 'linear-gradient(145deg, #070B14 0%, #0f172a 40%, #131B2E 100%)' }}>

            {/* ── iPhone Frame ── */}
            <div className="relative" style={{ width: 393, height: 852 }}>
                {/* Bezel */}
                <div className="absolute inset-0 rounded-[55px]"
                    style={{
                        background: '#1a1a1a',
                        boxShadow: '0 0 0 2px #333, 0 0 0 4px #6a6a6a, 0 30px 80px -10px rgba(0,0,0,0.6), 0 15px 30px rgba(0,0,0,0.3)',
                    }} />

                {/* Dynamic Island */}
                <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-[20px] z-50" />

                {/* Screen */}
                <div className="absolute inset-3 rounded-[45px] overflow-hidden flex flex-col"
                    style={{ background: '#0c1222' }}>

                    {/* Status bar */}
                    <div className="h-[54px] flex-shrink-0 flex items-end justify-between px-8 pb-1.5">
                        <span className="text-[13px] font-semibold text-white/70">19:48</span>
                        <div className="flex items-center gap-1.5">
                            <div className="flex gap-[3px]">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-[3px] rounded-full bg-white/60"
                                        style={{ height: 4 + i * 2.5 }} />
                                ))}
                            </div>
                            <span className="text-[11px] font-medium text-white/60 ml-1">5G</span>
                            <div className="w-[25px] h-[11px] rounded-[3px] border border-white/30 ml-1 relative overflow-hidden">
                                <div className="absolute inset-[1.5px] rounded-[1.5px] bg-emerald-400" style={{ width: '72%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Screen content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden"
                        style={{ scrollbarWidth: 'none' }}>

                        {screen.type === 'tab' && screen.tab === 'home' && (
                            <HomeScreen
                                absences={absences}
                                unreadCount={unreadCount}
                                totalFrais={totalGeneral}
                                onGoAbsences={() => goTab('absences')}
                                onGoFrais={() => goTab('frais')}
                                onGoMessages={() => goTab('messages')}
                            />
                        )}

                        {screen.type === 'tab' && screen.tab === 'absences' && (
                            <AbsencesScreen
                                absences={absences}
                                onNew={() => setScreen({ type: 'newAbsence' })}
                                onDetail={(a) => setScreen({ type: 'absenceDetail', absence: a })}
                            />
                        )}

                        {screen.type === 'tab' && screen.tab === 'frais' && (
                            <FraisScreen
                                frais={MOCK_FRAIS}
                                primes={MOCK_PRIMES}
                                totalFrais={totalFrais}
                                totalPrimes={totalPrimes}
                                totalGeneral={totalGeneral}
                                onDetail={() => setScreen({ type: 'fraisDetail' })}
                            />
                        )}

                        {screen.type === 'tab' && screen.tab === 'messages' && (
                            <MessagesScreen
                                messages={messages}
                                onDetail={(m) => {
                                    markRead(m.id);
                                    setScreen({ type: 'messageDetail', message: m });
                                }}
                            />
                        )}

                        {screen.type === 'newAbsence' && (
                            <NewAbsenceScreen
                                type={newAbsType}
                                comment={newAbsComment}
                                onTypeChange={setNewAbsType}
                                onCommentChange={setNewAbsComment}
                                onSubmit={submitAbsence}
                                onBack={goBack}
                            />
                        )}

                        {screen.type === 'absenceDetail' && (
                            <AbsenceDetailScreen absence={screen.absence} onBack={goBack} />
                        )}

                        {screen.type === 'fraisDetail' && (
                            <FraisDetailScreen
                                frais={MOCK_FRAIS}
                                checked={fraisChecked}
                                onToggle={(cat) => setFraisChecked(p => ({ ...p, [cat]: !p[cat] }))}
                                onBack={goBack}
                                onSave={() => { showToast('✅ Frais enregistrés'); goTab('frais'); }}
                            />
                        )}

                        {screen.type === 'messageDetail' && (
                            <MessageDetailScreen message={screen.message} onBack={goBack} />
                        )}
                    </div>

                    {/* Bottom Nav */}
                    {screen.type === 'tab' && (
                        <div className="flex-shrink-0 px-3 pb-2 pt-1.5"
                            style={{
                                background: 'rgba(12,18,34,0.92)',
                                backdropFilter: 'blur(24px) saturate(1.8)',
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                            }}>
                            <div className="flex justify-around">
                                {([
                                    { id: 'home' as TabId, icon: Home, label: 'Accueil' },
                                    { id: 'absences' as TabId, icon: CalendarOff, label: 'Absences' },
                                    { id: 'frais' as TabId, icon: Receipt, label: 'Frais' },
                                    { id: 'messages' as TabId, icon: MessageSquare, label: 'Messages', badge: unreadCount },
                                ]).map(tab => {
                                    const active = currentTab === tab.id;
                                    const Icon = tab.icon;
                                    return (
                                        <button key={tab.id} onClick={() => goTab(tab.id)}
                                            className="flex flex-col items-center gap-0.5 py-2 px-4 relative transition-colors"
                                            style={{ color: active ? '#3b82f6' : '#64748b' }}>
                                            <div className="relative">
                                                <Icon size={22} strokeWidth={active ? 2.2 : 1.5} />
                                                {tab.badge && tab.badge > 0 && (
                                                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                                        {tab.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-medium">{tab.label}</span>
                                            {active && (
                                                <div className="absolute -bottom-0.5 w-5 h-[3px] rounded-full"
                                                    style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Home indicator */}
                            <div className="mx-auto mt-2 w-[134px] h-[5px] rounded-full bg-white/20" />
                        </div>
                    )}

                    {/* Toast */}
                    {toast && (
                        <div className="absolute bottom-24 left-4 right-4 z-50"
                            style={{ animation: 'slideUp 0.3s ease-out' }}>
                            <div className="px-4 py-3 rounded-2xl text-[13px] font-semibold text-white text-center"
                                style={{
                                    background: 'rgba(16,185,129,0.9)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
                                }}>
                                {toast}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Global animations */}
            <style jsx global>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .anim-card { animation: fadeIn 0.35s ease-out forwards; opacity: 0; }
            `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   GLASS CARD COMPONENT
═══════════════════════════════════════════════════════ */
const Glass = ({ children, className = '', onClick, style, delay }: {
    children: React.ReactNode; className?: string; onClick?: () => void;
    style?: React.CSSProperties; delay?: number;
}) => (
    <div
        onClick={onClick}
        className={`anim-card ${onClick ? 'active:scale-[0.97] cursor-pointer' : ''} ${className}`}
        style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px) saturate(1.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            transition: 'all 0.2s ease',
            animationDelay: delay ? `${delay}ms` : undefined,
            ...style,
        }}
    >
        {children}
    </div>
);

const BackButton = ({ onBack, label }: { onBack: () => void; label: string }) => (
    <button onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 mb-5 active:text-white transition-colors">
        <ChevronLeft size={18} /> {label}
    </button>
);

const Badge = ({ statut }: { statut: AbsenceStatut }) => {
    const c = statutConfig[statut];
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.bg} ${c.color} ${c.border}`}>
            {c.label}
        </span>
    );
};

const SectionHeader = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
    <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold text-white">{title}</h2>
        {action && (
            <button onClick={onAction} className="text-[12px] font-medium text-blue-400 active:text-blue-300">
                {action} <ChevronsRight size={13} className="inline ml-0.5" />
            </button>
        )}
    </div>
);

/* ═══════════════════════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════════════════════ */
function HomeScreen({ absences, unreadCount, totalFrais, onGoAbsences, onGoFrais, onGoMessages }: {
    absences: Absence[]; unreadCount: number; totalFrais: number;
    onGoAbsences: () => void; onGoFrais: () => void; onGoMessages: () => void;
}) {
    const pendingAbs = absences.filter(a => a.statut === 'en_attente').length;

    return (
        <div className="px-5 pb-6">
            {/* Header */}
            <div className="pt-3 pb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] font-bold text-white">
                            Bonjour, {CONDUCTEUR.prenom} 👋
                        </h1>
                        <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Truck size={13} /> Flash Transports — {CONDUCTEUR.equipe}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                        <User size={18} className="text-white" />
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                    { label: 'Mes absences', value: pendingAbs > 0 ? `${pendingAbs} en attente` : 'À jour', icon: CalendarOff, gradient: 'from-blue-500 to-indigo-600', onClick: onGoAbsences },
                    { label: 'Frais du mois', value: `${totalFrais.toLocaleString('fr-FR')} €`, icon: Receipt, gradient: 'from-emerald-500 to-teal-600', onClick: onGoFrais },
                    { label: 'Messages', value: unreadCount > 0 ? `${unreadCount} non lu${unreadCount > 1 ? 's' : ''}` : 'Tout lu', icon: MessageSquare, gradient: 'from-violet-500 to-purple-600', onClick: onGoMessages },
                    { label: 'Solde CP', value: '18 jours', icon: Clock, gradient: 'from-amber-500 to-orange-600' },
                ] as const).map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <Glass key={kpi.label} className="p-4" delay={i * 60}
                            onClick={'onClick' in kpi ? kpi.onClick : undefined}>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center mb-3`}
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                <Icon size={17} className="text-white" />
                            </div>
                            <p className="text-[18px] font-bold text-white">{kpi.value}</p>
                            <p className="text-[12px] text-slate-500 mt-0.5">{kpi.label}</p>
                        </Glass>
                    );
                })}
            </div>

            {/* Alert card */}
            <Glass className="p-4 mb-6" delay={280}
                style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.06)' }}>
                <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-[13px] font-semibold text-amber-300">Rappel frais</p>
                        <p className="text-[12px] text-amber-400/70 mt-0.5">
                            Il reste 3 jours pour compléter votre saisie de frais.
                        </p>
                    </div>
                </div>
            </Glass>

            {/* Recent Activity */}
            <SectionHeader title="Activité récente" />
            <div className="space-y-2">
                {ACTIVITY.map((item, i) => (
                    <Glass key={i} className="p-3.5 flex items-center gap-3" delay={320 + i * 60}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-white">{item.action}</p>
                            <p className="text-[11px] text-slate-500 truncate">{item.detail}</p>
                        </div>
                        <span className="text-[11px] text-slate-600 flex-shrink-0">{item.time}</span>
                    </Glass>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   ABSENCES SCREEN
═══════════════════════════════════════════════════════ */
function AbsencesScreen({ absences, onNew, onDetail }: {
    absences: Absence[]; onNew: () => void; onDetail: (a: Absence) => void;
}) {
    return (
        <div className="px-5 pb-6">
            <div className="pt-3 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-bold text-white">Mes absences</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">{absences.length} demande{absences.length > 1 ? 's' : ''}</p>
                </div>
                <button onClick={onNew}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white active:scale-95 transition-transform"
                    style={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                    }}>
                    <Plus size={16} /> Nouvelle
                </button>
            </div>

            <div className="space-y-2.5">
                {absences.map((abs, i) => {
                    const StatusIcon = abs.statut === 'en_attente' ? Clock : abs.statut === 'validee' ? CheckCircle : XCircle;
                    return (
                        <Glass key={abs.id} className="p-4 flex items-center gap-3.5" delay={i * 60}
                            onClick={() => onDetail(abs)}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statutConfig[abs.statut].bg}`}>
                                <StatusIcon size={18} className={statutConfig[abs.statut].color} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-[13px] font-semibold text-white">
                                        {absenceTypeLabel[abs.type]}
                                    </p>
                                    {abs.derniereMinute && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                            URGENT
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Du {formatDate(abs.dateDebut)} au {formatDate(abs.dateFin)}
                                </p>
                            </div>
                            <Badge statut={abs.statut} />
                        </Glass>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   ABSENCE DETAIL
═══════════════════════════════════════════════════════ */
function AbsenceDetailScreen({ absence, onBack }: { absence: Absence; onBack: () => void }) {
    return (
        <div className="px-5 pb-6 pt-2">
            <BackButton onBack={onBack} label="Mes absences" />

            <Glass className="p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[17px] font-bold text-white">{absenceTypeLabel[absence.type]}</h2>
                    <Badge statut={absence.statut} />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-[12px] text-slate-500">Période</span>
                        <span className="text-[13px] font-medium text-white">
                            {formatDate(absence.dateDebut)} → {formatDate(absence.dateFin)}
                        </span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between">
                        <span className="text-[12px] text-slate-500">Demandé le</span>
                        <span className="text-[13px] font-medium text-slate-300">
                            {formatDate(absence.createdAt)}
                        </span>
                    </div>
                    {absence.commentaire && (
                        <>
                            <div className="h-px bg-white/5" />
                            <div>
                                <span className="text-[12px] text-slate-500">Commentaire</span>
                                <p className="text-[13px] text-slate-300 mt-1">{absence.commentaire}</p>
                            </div>
                        </>
                    )}
                </div>
            </Glass>

            {/* Timeline */}
            <Glass className="p-5">
                <h3 className="text-[14px] font-bold text-white mb-4">Suivi</h3>
                <div className="space-y-4">
                    <TimelineItem
                        label="Demande envoyée"
                        detail={`Par ${CONDUCTEUR.prenom} ${CONDUCTEUR.nom}`}
                        done={true}
                    />
                    <TimelineItem
                        label={absence.statut === 'validee' ? 'Validée par Brice GERARD' :
                            absence.statut === 'refusee' ? 'Refusée par Brice GERARD' :
                                'En attente de validation'}
                        detail={absence.motifRefus ? `Motif : ${absence.motifRefus}` : undefined}
                        done={absence.statut !== 'en_attente'}
                        error={absence.statut === 'refusee'}
                    />
                    {absence.statut !== 'en_attente' && (
                        <TimelineItem
                            label="Notification envoyée"
                            detail="Email + notification app"
                            done={true}
                        />
                    )}
                </div>
            </Glass>
        </div>
    );
}

const TimelineItem = ({ label, detail, done, error }: {
    label: string; detail?: string; done: boolean; error?: boolean;
}) => (
    <div className="flex gap-3">
        <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 ${done ? error ? 'bg-red-500 border-red-500' : 'bg-emerald-500 border-emerald-500' : 'border-slate-600 bg-transparent'}`} />
            <div className="w-px flex-1 bg-white/5 mt-1" />
        </div>
        <div className="pb-4">
            <p className={`text-[13px] font-medium ${done ? error ? 'text-red-400' : 'text-white' : 'text-slate-500'}`}>
                {label}
            </p>
            {detail && <p className="text-[11px] text-slate-500 mt-0.5">{detail}</p>}
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════
   NEW ABSENCE SCREEN
═══════════════════════════════════════════════════════ */
function NewAbsenceScreen({ type, comment, onTypeChange, onCommentChange, onSubmit, onBack }: {
    type: AbsenceType; comment: string; onTypeChange: (t: AbsenceType) => void;
    onCommentChange: (c: string) => void; onSubmit: () => void; onBack: () => void;
}) {
    const types: { id: AbsenceType; label: string }[] = [
        { id: 'cp', label: 'Congés payés' },
        { id: 'cp_anticipation', label: 'CP anticipation' },
        { id: 'sans_solde', label: 'Sans solde' },
        { id: 'maladie', label: 'Maladie' },
        { id: 'accident_travail', label: 'Accident travail' },
        { id: 'exceptionnelle', label: 'Exceptionnelle' },
    ];

    return (
        <div className="px-5 pb-6 pt-2">
            <BackButton onBack={onBack} label="Mes absences" />

            <h1 className="text-[20px] font-bold text-white mb-2">Nouvelle demande</h1>
            <p className="text-[12px] text-slate-500 mb-5">La demande sera envoyée à Brice GERARD.</p>

            {/* Type selector */}
            <Glass className="p-4 mb-4">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Type d&apos;absence</p>
                <div className="grid grid-cols-2 gap-2">
                    {types.map(t => (
                        <button key={t.id} onClick={() => onTypeChange(t.id)}
                            className="px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all active:scale-95"
                            style={{
                                background: type === t.id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${type === t.id ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                                color: type === t.id ? '#60a5fa' : '#94a3b8',
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </Glass>

            {/* Dates */}
            <Glass className="p-4 mb-4">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Dates souhaitées</p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-[12px] text-slate-500">Dernier jour travaillé</span>
                        <span className="text-[13px] font-medium text-white">4 avril 2026</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-[12px] text-slate-500">Date de reprise</span>
                        <span className="text-[13px] font-medium text-white">14 avril 2026</span>
                    </div>
                    <p className="text-[11px] text-slate-600 text-center">5 jours ouvrés</p>
                </div>
            </Glass>

            {/* Comment */}
            <Glass className="p-4 mb-6">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Commentaire (optionnel)</p>
                <textarea
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="Ex: vacances familiales..."
                    rows={3}
                    className="w-full rounded-xl p-3 text-[13px] text-white placeholder-slate-600 resize-none outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                />
            </Glass>

            {/* Submit */}
            <button onClick={onSubmit}
                className="w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                style={{
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                }}>
                <Send size={16} /> Envoyer la demande
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   FRAIS SCREEN
═══════════════════════════════════════════════════════ */
function FraisScreen({ frais, primes, totalFrais, totalPrimes, totalGeneral, onDetail }: {
    frais: FraisLigne[]; primes: FraisLigne[];
    totalFrais: number; totalPrimes: number; totalGeneral: number;
    onDetail: () => void;
}) {
    const fraisIconMap: Record<string, typeof Coffee> = { repas: Utensils, nuit: Moon, carburant: MapPin, prime: Clock };

    return (
        <div className="px-5 pb-6">
            <div className="pt-3 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-bold text-white">Mes frais</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Période du 20 janv. au 19 fév.</p>
                </div>
                <button onClick={onDetail}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white active:scale-95 transition-transform"
                    style={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                    }}>
                    <Plus size={16} /> Saisir
                </button>
            </div>

            {/* Total card */}
            <Glass className="p-5 mb-5" delay={0}
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))', borderColor: 'rgba(59,130,246,0.15)' }}>
                <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">Total période</p>
                <p className="text-[32px] font-extrabold text-white">{totalGeneral.toLocaleString('fr-FR')} €</p>
                <div className="flex gap-4 mt-2">
                    <span className="text-[12px] text-slate-400">Frais : {totalFrais} €</span>
                    <span className="text-[12px] text-slate-400">Primes : {totalPrimes} €</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                        Brouillon
                    </span>
                    <span className="text-[11px] text-slate-500">22/31 jours saisis</span>
                </div>
            </Glass>

            {/* Frais breakdown */}
            <SectionHeader title="Détail des frais" />
            <div className="space-y-2 mb-5">
                {frais.map((f, i) => {
                    const Icon = fraisIconMap[f.icon] || Coffee;
                    return (
                        <Glass key={f.categorie} className="p-3.5 flex items-center gap-3" delay={80 + i * 40}>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Icon size={15} className="text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium text-white truncate">{f.categorie}</p>
                                <p className="text-[10px] text-slate-500">{f.jours}j × {f.montant} €</p>
                            </div>
                            <p className="text-[14px] font-bold text-white">{f.total} €</p>
                        </Glass>
                    );
                })}
            </div>

            {/* Primes */}
            <SectionHeader title="Primes" />
            <div className="space-y-2">
                {primes.map((p, i) => (
                    <Glass key={p.categorie} className="p-3.5 flex items-center gap-3" delay={360 + i * 40}>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Clock size={15} className="text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-white truncate">{p.categorie}</p>
                            <p className="text-[10px] text-slate-500">{p.jours}× {p.montant} €</p>
                        </div>
                        <p className="text-[14px] font-bold text-white">{p.total} €</p>
                    </Glass>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   FRAIS DETAIL (SAISIE) SCREEN
═══════════════════════════════════════════════════════ */
function FraisDetailScreen({ frais, checked, onToggle, onBack, onSave }: {
    frais: FraisLigne[]; checked: Record<string, boolean>;
    onToggle: (cat: string) => void; onBack: () => void; onSave: () => void;
}) {
    const categories = [
        { nom: 'Repas midi RP', montant: 10 },
        { nom: 'Repas soir RP', montant: 10 },
        { nom: 'Repas midi province', montant: 9 },
        { nom: 'Casse-croûte', montant: 19 },
        { nom: 'Repas soir province', montant: 16 },
        { nom: 'Nuit province PL', montant: 65 },
        { nom: 'Repas soir étranger', montant: 34 },
        { nom: 'Repas midi étranger', montant: 19 },
        { nom: 'Hôtel', montant: 19 },
    ];

    return (
        <div className="px-5 pb-6 pt-2">
            <BackButton onBack={onBack} label="Mes frais" />

            <h1 className="text-[20px] font-bold text-white mb-1">Saisie des frais</h1>
            <p className="text-[12px] text-slate-500 mb-5">
                Cochez les frais du jour — les montants sont calculés automatiquement.
            </p>

            <Glass className="p-4 mb-4">
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Aujourd&apos;hui — Lundi 17 février
                </p>
            </Glass>

            <div className="space-y-2 mb-6">
                {categories.map((cat, i) => {
                    const isChecked = checked[cat.nom] ?? false;
                    return (
                        <Glass key={cat.nom} className="p-3.5 flex items-center gap-3" delay={i * 30}
                            onClick={() => onToggle(cat.nom)}
                            style={{
                                borderColor: isChecked ? 'rgba(16,185,129,0.3)' : undefined,
                                background: isChecked ? 'rgba(16,185,129,0.06)' : undefined,
                            }}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                {isChecked && <CheckCircle size={14} className="text-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] font-medium text-white">{cat.nom}</p>
                            </div>
                            <span className={`text-[14px] font-bold ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {cat.montant} €
                            </span>
                        </Glass>
                    );
                })}
            </div>

            {/* Save */}
            <button onClick={onSave}
                className="w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                }}>
                <CheckCircle size={16} /> Enregistrer
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MESSAGES SCREEN
═══════════════════════════════════════════════════════ */
function MessagesScreen({ messages, onDetail }: {
    messages: Message[]; onDetail: (m: Message) => void;
}) {
    return (
        <div className="px-5 pb-6">
            <div className="pt-3 pb-4">
                <h1 className="text-[20px] font-bold text-white">Messagerie</h1>
                <p className="text-[12px] text-slate-500 mt-0.5">Communication interne</p>
            </div>

            <div className="space-y-2">
                {messages.map((msg, i) => {
                    const config = msgTypeConfig[msg.type];
                    const Icon = config.icon;
                    return (
                        <Glass key={msg.id} className="p-4 flex items-start gap-3" delay={i * 50}
                            onClick={() => onDetail(msg)}
                            style={{
                                borderLeft: !msg.lu ? '3px solid #3b82f6' : undefined,
                            }}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                                <Icon size={17} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`text-[13px] font-semibold truncate ${!msg.lu ? 'text-white' : 'text-slate-300'}`}>
                                        {msg.titre}
                                    </p>
                                    {!msg.lu && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    {msg.auteur} — {msg.date}
                                </p>
                            </div>
                        </Glass>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MESSAGE DETAIL
═══════════════════════════════════════════════════════ */
function MessageDetailScreen({ message, onBack }: { message: Message; onBack: () => void }) {
    const config = msgTypeConfig[message.type];
    const Icon = config.icon;

    return (
        <div className="px-5 pb-6 pt-2">
            <BackButton onBack={onBack} label="Messages" />

            <Glass className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
                        <Icon size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[15px] font-bold text-white">{message.titre}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            {message.auteur} — {message.date}
                        </p>
                    </div>
                </div>
                <div className="h-px bg-white/5 mb-4" />
                <p className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-line">
                    {message.contenu}
                </p>
            </Glass>
        </div>
    );
}
