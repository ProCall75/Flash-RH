'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Loader2 } from 'lucide-react';
import { getProfiles } from '@/lib/actions/users';
import type { Profile, Role } from '@/types/database';

const roleLabels: Record<Role, string> = { admin: 'Admin', bureau: 'Bureau', conducteur: 'Conducteur' };
const roleColors: Record<Role, string> = {
    admin: 'bg-violet-500/15 text-violet-400',
    bureau: 'bg-blue-500/15 text-blue-400',
    conducteur: 'bg-slate-500/15 text-slate-400',
};

export default function UtilisateursPage() {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getProfiles();
                setUsers(data);
            } catch {
                void 0; // error handled silently
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = users.filter((u) =>
        `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
                    <p className="text-slate-400 mt-1">{users.length} comptes</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Ajouter</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un employé..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>

            {/* Loading */}
            {loading && (
                <div className="glass-card p-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                    <p className="text-slate-400 mt-2">Chargement...</p>
                </div>
            )}

            {/* Table */}
            {!loading && (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Employé</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4 hidden md:table-cell">Email</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Rôle</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4 hidden sm:table-cell">Véhicule</th>
                                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-4">Statut</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {user.prenom[0]}{user.nom[0]}
                                                </div>
                                                <span className="text-sm font-medium text-white">{user.prenom} {user.nom}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400 hidden md:table-cell">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`badge ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400 hidden sm:table-cell">{user.profil_vehicule || '—'}</td>
                                        <td className="p-4">
                                            <span className={`w-2 h-2 rounded-full inline-block ${user.actif ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                        </td>
                                        <td className="p-4">
                                            <button className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
