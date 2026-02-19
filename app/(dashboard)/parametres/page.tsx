'use client';

import { useState, useEffect } from 'react';
import { Settings, Receipt, Save, Loader2, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getCategories, updateCategorie } from '@/lib/actions/frais';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { CategorieFrais } from '@/types/database';

export default function ParametresPage() {
    const [categories, setCategories] = useState<CategorieFrais[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);
    const [savedId, setSavedId] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch {
                setError('Erreur lors du chargement des catégories.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleSave(cat: CategorieFrais) {
        const newMontant = parseFloat(editValue);
        if (isNaN(newMontant) || newMontant < 0) return;
        setSaving(true);
        try {
            const updated = await updateCategorie(cat.id, { montant_defaut: newMontant });
            setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, ...updated } : c));
            setEditingId(null);
            setSavedId(cat.id);
            setTimeout(() => setSavedId(null), 2000);
        } catch {
            setError('Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleActif(cat: CategorieFrais) {
        try {
            const updated = await updateCategorie(cat.id, { actif: !cat.actif });
            setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, ...updated } : c));
        } catch {
            setError('Erreur lors de la mise à jour.');
        }
    }

    if (loading) {
        return (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
            </div>
        );
    }

    const vehiculeStyles: Record<string, { bg: string; color: string }> = {
        PL: { bg: 'var(--info-bg)', color: '#1e40af' },
        VL: { bg: 'var(--success-bg)', color: '#065f46' },
        tous: { bg: 'rgba(100,116,139,0.1)', color: '#64748b' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <ErrorBanner message={error} />}

            <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>Paramètres</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Configuration des catégories et montants</p>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Receipt style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                        Catégories de frais et primes ({categories.length})
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Cliquez sur un montant pour le modifier
                    </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['Catégorie', 'Montant', 'Véhicule', 'Type', 'Actif'].map((h) => (
                                    <th key={h} style={{
                                        textAlign: 'left', padding: '12px 16px', fontSize: '11px',
                                        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                                        color: 'var(--text-muted)',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => {
                                const vs = vehiculeStyles[cat.profil_vehicule] || vehiculeStyles.tous;
                                const isEditing = editingId === cat.id;
                                return (
                                    <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{cat.nom}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {isEditing ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(cat); if (e.key === 'Escape') setEditingId(null); }}
                                                        autoFocus
                                                        style={{
                                                            width: '90px', padding: '4px 8px', fontSize: '14px',
                                                            border: '1.5px solid var(--primary)', borderRadius: 'var(--radius-sm)',
                                                            fontFamily: 'inherit', outline: 'none', fontWeight: 700,
                                                            color: 'var(--primary)',
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleSave(cat)}
                                                        disabled={saving}
                                                        style={{
                                                            padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                                                            background: 'var(--primary)', color: 'white', border: 'none',
                                                            cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                                                            fontFamily: 'inherit',
                                                        }}
                                                    >
                                                        {saving ? <Loader2 style={{ width: '12px', height: '12px' }} className="animate-spin" /> : <Save style={{ width: '12px', height: '12px' }} />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setEditingId(cat.id); setEditValue(String(cat.montant_defaut)); }}
                                                    style={{
                                                        padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                                                        background: savedId === cat.id ? 'var(--success-bg)' : 'transparent',
                                                        border: 'none', cursor: 'pointer', fontSize: '14px',
                                                        fontWeight: 700, color: savedId === cat.id ? '#065f46' : 'var(--primary)',
                                                        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px',
                                                        transition: 'all var(--transition-fast)',
                                                    }}
                                                >
                                                    {savedId === cat.id && <Check style={{ width: '14px', height: '14px' }} />}
                                                    {formatCurrency(cat.montant_defaut)}
                                                </button>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', padding: '4px 12px',
                                                borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: 600,
                                                background: vs.bg, color: vs.color,
                                            }}>
                                                {cat.profil_vehicule === 'tous' ? 'Tous' : cat.profil_vehicule}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', padding: '4px 12px',
                                                borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: 600,
                                                background: cat.type === 'frais' ? 'var(--warning-bg)' : 'var(--primary-bg)',
                                                color: cat.type === 'frais' ? '#92400e' : 'var(--primary)',
                                            }}>
                                                {cat.type === 'frais' ? 'Frais' : 'Prime'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button
                                                onClick={() => handleToggleActif(cat)}
                                                style={{
                                                    width: '36px', height: '20px', borderRadius: '10px',
                                                    background: cat.actif ? 'var(--success)' : '#d1d5db',
                                                    border: 'none', cursor: 'pointer', position: 'relative',
                                                    transition: 'background 0.2s ease',
                                                }}
                                            >
                                                <span style={{
                                                    position: 'absolute', top: '2px',
                                                    left: cat.actif ? '18px' : '2px',
                                                    width: '16px', height: '16px', borderRadius: '50%',
                                                    background: 'white', transition: 'left 0.2s ease',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                }} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Aucune catégorie trouvée</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Settings style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                    <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Informations</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Les montants sont définis selon la convention collective du transport routier.</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Toute modification prendra effet à la prochaine période de frais.</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Flash Transports © 2026 — Propulsé par PRAGMA</p>
                </div>
            </div>
        </div>
    );
}
