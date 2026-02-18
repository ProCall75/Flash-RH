'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Loader2 } from 'lucide-react';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import { getExportPeriodes } from '@/lib/actions/export';

interface EnrichedPeriode {
    id: string;
    date_debut: string;
    date_fin: string;
    nb_releves: number;
    total: number;
}

export default function ExportPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [periodes, setPeriodes] = useState<EnrichedPeriode[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getExportPeriodes();
                setPeriodes(data);
            } catch (err) {
                console.error('Export load error:', err);
            } finally {
                setPageLoading(false);
            }
        }
        load();
    }, []);

    async function handleExport(periodeId: string, format: 'pdf' | 'excel') {
        setLoading(`${periodeId}-${format}`);
        // TODO: implement actual export
        await new Promise((r) => setTimeout(r, 1500));
        setLoading(null);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Export</h1>
                <p className="text-slate-400 mt-1">Exportez les relevés de frais par période</p>
            </div>

            {pageLoading && (
                <div className="glass-card p-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
                    <p className="text-slate-400 mt-2">Chargement...</p>
                </div>
            )}

            {!pageLoading && (
                <div className="space-y-4">
                    {periodes.length === 0 && (
                        <div className="glass-card p-12 text-center">
                            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">Aucune période disponible</p>
                        </div>
                    )}
                    {periodes.map((p) => (
                        <div key={p.id} className="glass-card p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold text-white">
                                            {formatDateShort(p.date_debut)} → {formatDateShort(p.date_fin)}
                                        </h2>
                                        <p className="text-xs text-slate-500">{p.nb_releves} relevés — Total {formatCurrency(p.total)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleExport(p.id, 'pdf')}
                                    disabled={loading !== null}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium disabled:opacity-50"
                                >
                                    {loading === `${p.id}-pdf` ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                                    Export PDF
                                </button>
                                <button
                                    onClick={() => handleExport(p.id, 'excel')}
                                    disabled={loading !== null}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all text-sm font-medium disabled:opacity-50"
                                >
                                    {loading === `${p.id}-excel` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    Export Excel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
