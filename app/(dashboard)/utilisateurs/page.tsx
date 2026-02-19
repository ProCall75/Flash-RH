'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MoreVertical, Loader2, X, Edit2, UserX, UserCheck, Plus } from 'lucide-react';
import { getProfiles, updateProfile } from '@/lib/actions/users';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { Profile, Role, ProfilVehicule } from '@/types/database';

const roleLabels: Record<Role, string> = { admin: 'Admin', bureau: 'Bureau', conducteur: 'Conducteur' };
const roleStyles: Record<Role, { bg: string; color: string }> = {
    admin: { bg: 'var(--primary-bg)', color: 'var(--primary)' },
    bureau: { bg: 'var(--info-bg)', color: '#1e40af' },
    conducteur: { bg: 'rgba(100,116,139,0.1)', color: '#64748b' },
};

export default function UtilisateursPage() {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<Profile | null>(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        role: '' as Role,
        profil_vehicule: null as ProfilVehicule | null,
        actif: true,
    });
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({
        nom: '', prenom: '', email: '', password: '',
        role: 'conducteur' as Role,
        profil_vehicule: null as ProfilVehicule | null,
    });

    async function handleCreate() {
        setCreating(true);
        setError('');
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur');
            setShowCreate(false);
            setCreateForm({ nom: '', prenom: '', email: '', password: '', role: 'conducteur', profil_vehicule: null });
            load();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création.');
        } finally {
            setCreating(false);
        }
    }

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getProfiles();
            setUsers(data);
        } catch {
            setError('Erreur lors du chargement des utilisateurs.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    function openEdit(user: Profile) {
        setEditUser(user);
        setEditForm({
            role: user.role,
            profil_vehicule: user.profil_vehicule,
            actif: user.actif,
        });
        setMenuOpen(null);
    }

    async function handleSaveEdit() {
        if (!editUser) return;
        setSaving(true);
        try {
            const updated = await updateProfile(editUser.id, editForm);
            setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...updated } : u));
            setEditUser(null);
        } catch {
            setError('Erreur lors de la mise à jour du profil.');
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleActive(user: Profile) {
        setMenuOpen(null);
        try {
            const updated = await updateProfile(user.id, { actif: !user.actif });
            setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, ...updated } : u));
        } catch {
            setError(`Erreur lors de la ${user.actif ? 'désactivation' : 'réactivation'}.`);
        }
    }

    const filtered = users.filter((u) =>
        `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <ErrorBanner message={error} onRetry={load} />}

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>Équipe</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>{users.length} collaborateurs</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="btn btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>
                    <Plus style={{ width: '16px', height: '16px' }} /> Nouvel utilisateur
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <Search style={{
                    width: '18px', height: '18px', color: 'var(--text-muted)',
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                }} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un employé..."
                    style={{
                        width: '100%', paddingLeft: '44px', paddingRight: '16px',
                        paddingTop: '12px', paddingBottom: '12px',
                        background: 'var(--white)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', fontSize: '14px',
                        fontFamily: 'inherit', color: 'var(--text)', outline: 'none',
                    }}
                />
            </div>

            {loading && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
                </div>
            )}

            {!loading && (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Employé', 'Email', 'Rôle', 'Véhicule', 'Statut', ''].map((h, i) => (
                                        <th key={i} style={{
                                            textAlign: 'left', padding: '14px 16px', fontSize: '11px',
                                            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                                            color: 'var(--text-muted)',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user) => {
                                    const rs = roleStyles[user.role];
                                    return (
                                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                        background: 'var(--gradient-aurora)', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        color: 'white', fontSize: '11px', fontWeight: 700,
                                                        opacity: user.actif ? 1 : 0.4,
                                                    }}>
                                                        {user.prenom[0]}{user.nom[0]}
                                                    </div>
                                                    <span style={{
                                                        fontSize: '14px', fontWeight: 600, color: 'var(--text)',
                                                        opacity: user.actif ? 1 : 0.5,
                                                    }}>
                                                        {user.prenom} {user.nom}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {user.email}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center',
                                                    padding: '4px 12px', borderRadius: 'var(--radius-pill)',
                                                    fontSize: '12px', fontWeight: 600, background: rs.bg, color: rs.color,
                                                }}>
                                                    {roleLabels[user.role]}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                {user.profil_vehicule || '—'}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    display: 'inline-block',
                                                    background: user.actif ? 'var(--success)' : '#d1d5db',
                                                }} />
                                            </td>
                                            <td style={{ padding: '14px 16px', position: 'relative' }}>
                                                <button
                                                    onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                                                    style={{
                                                        padding: '4px', borderRadius: '6px', background: 'transparent',
                                                        border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    <MoreVertical style={{ width: '16px', height: '16px' }} />
                                                </button>
                                                {menuOpen === user.id && (
                                                    <div style={{
                                                        position: 'absolute', right: '16px', top: '48px',
                                                        background: 'var(--white)', border: '1px solid var(--border)',
                                                        borderRadius: 'var(--radius-sm)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                                        zIndex: 20, minWidth: '160px', overflow: 'hidden',
                                                    }}>
                                                        <button
                                                            onClick={() => openEdit(user)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                                width: '100%', padding: '10px 14px', border: 'none',
                                                                background: 'none', cursor: 'pointer', fontSize: '13px',
                                                                color: 'var(--text)', fontFamily: 'inherit', textAlign: 'left',
                                                            }}
                                                        >
                                                            <Edit2 style={{ width: '14px', height: '14px' }} /> Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleActive(user)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                                width: '100%', padding: '10px 14px', border: 'none',
                                                                background: 'none', cursor: 'pointer', fontSize: '13px',
                                                                color: user.actif ? '#991b1b' : 'var(--success)',
                                                                fontFamily: 'inherit', textAlign: 'left',
                                                            }}
                                                        >
                                                            {user.actif ? (
                                                                <><UserX style={{ width: '14px', height: '14px' }} /> Désactiver</>
                                                            ) : (
                                                                <><UserCheck style={{ width: '14px', height: '14px' }} /> Réactiver</>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editUser && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
                    }}
                    onClick={(e) => e.target === e.currentTarget && setEditUser(null)}
                >
                    <div className="glass-card" style={{
                        width: '100%', maxWidth: '440px', padding: '28px',
                        margin: '16px', animation: 'fadeIn 0.2s ease-out',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                                Modifier {editUser.prenom} {editUser.nom}
                            </h2>
                            <button onClick={() => setEditUser(null)} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', padding: '4px',
                            }}>
                                <X style={{ width: '18px', height: '18px' }} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Rôle</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })}
                                    style={{
                                        width: '100%', padding: '10px 14px', background: 'var(--white)',
                                        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                        fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none',
                                    }}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="bureau">Bureau</option>
                                    <option value="conducteur">Conducteur</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Profil véhicule</label>
                                <select
                                    value={editForm.profil_vehicule || ''}
                                    onChange={(e) => setEditForm({ ...editForm, profil_vehicule: (e.target.value || null) as ProfilVehicule | null })}
                                    style={{
                                        width: '100%', padding: '10px 14px', background: 'var(--white)',
                                        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                        fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none',
                                    }}
                                >
                                    <option value="">Aucun</option>
                                    <option value="VL">VL (Véhicule Léger)</option>
                                    <option value="PL">PL (Poids Lourd)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="actif-checkbox"
                                    checked={editForm.actif}
                                    onChange={(e) => setEditForm({ ...editForm, actif: e.target.checked })}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                />
                                <label htmlFor="actif-checkbox" style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>
                                    Compte actif
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                            <button
                                onClick={() => setEditUser(null)}
                                className="btn btn-outline"
                                style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="btn btn-primary"
                                style={{
                                    flex: 1, justifyContent: 'center', padding: '10px',
                                    opacity: saving ? 0.6 : 1,
                                }}
                            >
                                {saving ? <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
                    onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}
                >
                    <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '28px', margin: '16px', animation: 'fadeIn 0.2s ease-out' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>Nouvel utilisateur</h2>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                                <X style={{ width: '18px', height: '18px' }} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Prénom</label>
                                    <input type="text" required value={createForm.prenom} onChange={(e) => setCreateForm({ ...createForm, prenom: e.target.value })} placeholder="Jean" style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Nom</label>
                                    <input type="text" required value={createForm.nom} onChange={(e) => setCreateForm({ ...createForm, nom: e.target.value })} placeholder="Dupont" style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Email</label>
                                <input type="email" required value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="prenom.nom@flash-transports.fr" style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Mot de passe initial</label>
                                <input type="text" required value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Minimum 6 caractères" style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Rôle</label>
                                    <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })} style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }}>
                                        <option value="conducteur">Conducteur</option>
                                        <option value="bureau">Bureau</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Véhicule</label>
                                    <select value={createForm.profil_vehicule || ''} onChange={(e) => setCreateForm({ ...createForm, profil_vehicule: (e.target.value || null) as ProfilVehicule | null })} style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)', outline: 'none' }}>
                                        <option value="">Aucun</option>
                                        <option value="VL">VL</option>
                                        <option value="PL">PL</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                            <button onClick={() => setShowCreate(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Annuler</button>
                            <button onClick={handleCreate} disabled={creating || !createForm.nom || !createForm.prenom || !createForm.email || !createForm.password} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', opacity: (creating || !createForm.nom || !createForm.prenom || !createForm.email || !createForm.password) ? 0.6 : 1 }}>
                                {creating ? <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> : 'Créer le compte'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
