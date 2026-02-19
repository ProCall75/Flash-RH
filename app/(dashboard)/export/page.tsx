'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Loader2 } from 'lucide-react';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import { getExportPeriodes, getExportData } from '@/lib/actions/export';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

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
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await getExportPeriodes();
                setPeriodes(data);
            } catch {
                setError('Erreur lors du chargement des périodes.');
            } finally {
                setPageLoading(false);
            }
        }
        load();
    }, []);

    async function handleExport(periodeId: string, format: 'pdf' | 'excel') {
        setLoading(`${periodeId}-${format}`);
        setError('');
        try {
            const data = await getExportData(periodeId);
            const rows: string[][] = [
                ['Employé', 'Total Frais', 'Total Primes', 'Total Général', 'Statut']
            ];
            for (const r of data.releves) {
                rows.push([
                    r.employe ? `${r.employe.prenom} ${r.employe.nom}` : 'Inconnu',
                    String(r.total_frais),
                    String(r.total_primes),
                    String(r.total_general),
                    r.statut,
                ]);
            }
            rows.push(['', '', '', '', '']);
            rows.push(['TOTAL', '', '', String(data.totalGeneral), `${data.nbReleves} relevés`]);

            if (format === 'excel') {
                const csv = rows.map(r => r.map(c => `"${c}"`).join(';')).join('\n');
                const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `export-frais-${formatDateShort(data.periode.date_debut)}-${formatDateShort(data.periode.date_fin)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                // PDF: generate printable HTML window
                const html = `
                    <html><head><title>Export Frais</title>
                    <style>body{font-family:Arial,sans-serif;padding:40px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px 12px;text-align:left}th{background:#f5f5f5;font-weight:600}h1{font-size:18px}</style>
                    </head><body>
                    <h1>Relevé de frais — ${formatDateShort(data.periode.date_debut)} → ${formatDateShort(data.periode.date_fin)}</h1>
                    <p>${data.nbReleves} relevés — Total: ${formatCurrency(data.totalGeneral)}</p>
                    <table><thead><tr>${rows[0].map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>${rows.slice(1).map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
                    </body></html>
                `;
                const w = window.open('', '_blank');
                if (w) {
                    w.document.write(html);
                    w.document.close();
                    w.print();
                }
            }
        } catch {
            setError('Erreur lors de l\'export.');
        } finally {
            setLoading(null);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && <ErrorBanner message={error} />}
            <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>Export</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Exportez les relevés de frais par période</p>
            </div>

            {pageLoading && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Loader2 style={{ width: '32px', height: '32px', color: 'var(--primary)', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chargement...</p>
                </div>
            )}

            {!pageLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {periodes.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                            <Calendar style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Aucune période disponible</p>
                        </div>
                    )}
                    {periodes.map((p) => (
                        <div key={p.id} className="glass-card">
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--primary-bg)',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Calendar style={{ width: '20px', height: '20px' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                                            {formatDateShort(p.date_debut)} → {formatDateShort(p.date_fin)}
                                        </h2>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {p.nb_releves} relevés — Total {formatCurrency(p.total)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => handleExport(p.id, 'pdf')}
                                    disabled={loading !== null}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border)',
                                        background: 'var(--error-bg)',
                                        color: '#991b1b',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        fontFamily: 'inherit',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.5 : 1,
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    {loading === `${p.id}-pdf` ? <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> : <FileText style={{ width: '16px', height: '16px' }} />}
                                    Export PDF
                                </button>
                                <button
                                    onClick={() => handleExport(p.id, 'excel')}
                                    disabled={loading !== null}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border)',
                                        background: 'var(--success-bg)',
                                        color: '#065f46',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        fontFamily: 'inherit',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.5 : 1,
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    {loading === `${p.id}-excel` ? <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> : <Download style={{ width: '16px', height: '16px' }} />}
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
