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

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'var(--white)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit',
    color: 'var(--text)', outline: 'none', transition: 'border-color var(--transition-fast)',
};

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: 'var(--text-muted)', marginBottom: '6px',
};

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

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Link href="/absences" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour aux absences
            </Link>

            <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>Nouvelle demande d&apos;absence</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                    Remplissez le formulaire ci-dessous. Vous pouvez proposer jusqu&apos;à 3 choix de dates.
                </p>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)', color: '#991b1b', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Type */}
                <div className="glass-card">
                    <label style={labelStyle}>Type d&apos;absence</label>
                    <select value={type} onChange={(e) => setType(e.target.value as AbsenceType)} style={inputStyle}>
                        {absenceTypes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                {/* Choix 1 */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Choix de dates n°1</h2>
                        <span style={{ fontSize: '11px', color: 'var(--error)', fontWeight: 600 }}>*obligatoire</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Dernier jour travaillé</label>
                            <input type="date" required value={dateDebut1} onChange={(e) => setDateDebut1(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Date de reprise</label>
                            <input type="date" required value={dateReprise1} onChange={(e) => setDateReprise1(e.target.value)} style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Choix 2 */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.75 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Choix de dates n°2</h2>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>optionnel</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Dernier jour travaillé</label>
                            <input type="date" value={dateDebut2} onChange={(e) => setDateDebut2(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Date de reprise</label>
                            <input type="date" value={dateReprise2} onChange={(e) => setDateReprise2(e.target.value)} style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Choix 3 */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.75 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Choix de dates n°3</h2>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>optionnel</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Dernier jour travaillé</label>
                            <input type="date" value={dateDebut3} onChange={(e) => setDateDebut3(e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Date de reprise</label>
                            <input type="date" value={dateReprise3} onChange={(e) => setDateReprise3(e.target.value)} style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Dernière minute + Commentaire */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={derniereMinute}
                            onChange={(e) => setDerniereMinute(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                        />
                        <span style={{ fontSize: '14px', color: 'var(--text)' }}>Demande de dernière minute (délai &lt; 48h)</span>
                    </label>

                    <div>
                        <label style={labelStyle}>Commentaire</label>
                        <textarea
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            rows={3}
                            placeholder="Précisions éventuelles..."
                            style={{ ...inputStyle, resize: 'none' as const }}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !dateDebut1 || !dateReprise1}
                    className="btn btn-primary"
                    style={{
                        width: '100%', padding: '14px', justifyContent: 'center', fontSize: '14px',
                        opacity: (loading || !dateDebut1 || !dateReprise1) ? 0.5 : 1,
                        cursor: (loading || !dateDebut1 || !dateReprise1) ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> : <Send style={{ width: '20px', height: '20px' }} />}
                    {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
                </button>
            </form>
        </div>
    );
}
