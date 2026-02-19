'use client';

import { useState, useRef, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, Paperclip, X } from 'lucide-react';
import type { MessageType, Destinataires } from '@/types/database';
import { createMessage } from '@/lib/actions/messages';
import { createClient } from '@/lib/supabase/client';

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

export default function NouveauMessagePage() {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [titre, setTitre] = useState('');
    const [contenu, setContenu] = useState('');
    const [type, setType] = useState<MessageType>('info');
    const [destinataires, setDestinataires] = useState<Destinataires>('tous');
    const [file, setFile] = useState<File | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let piece_jointe_url: string | null = null;

            // Upload file if selected
            if (file) {
                const supabase = createClient();
                const ext = file.name.split('.').pop();
                const path = `messages/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from('attachments')
                    .upload(path, file);

                if (uploadError) {
                    throw new Error('Erreur lors de l\'upload du fichier: ' + uploadError.message);
                }

                const { data: urlData } = supabase.storage
                    .from('attachments')
                    .getPublicUrl(path);

                piece_jointe_url = urlData.publicUrl;
            }

            await createMessage({ titre, contenu, type, destinataires, piece_jointe_url });
            router.push('/messages');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Link href="/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour aux messages
            </Link>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)' }}>Nouveau message</h1>

            {error && (
                <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)', color: '#991b1b', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value as MessageType)} style={inputStyle}>
                                <option value="info">Information</option>
                                <option value="note_service">Note de service</option>
                                <option value="rappel">Rappel</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Destinataires</label>
                            <select value={destinataires} onChange={(e) => setDestinataires(e.target.value as Destinataires)} style={inputStyle}>
                                <option value="tous">Tous les employés</option>
                                <option value="conducteurs_pl">Conducteurs PL</option>
                                <option value="conducteurs_vl">Conducteurs VL</option>
                                <option value="bureau">Bureau uniquement</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Titre</label>
                        <input type="text" required value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Objet du message" style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Contenu</label>
                        <textarea required value={contenu} onChange={(e) => setContenu(e.target.value)} rows={6} placeholder="Rédigez votre message..." style={{ ...inputStyle, resize: 'none' as const }} />
                    </div>

                    {/* File Attachment */}
                    <div>
                        <label style={labelStyle}>Pièce jointe (optionnel)</label>
                        <input
                            ref={fileRef}
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                            style={{ display: 'none' }}
                        />
                        {file ? (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--info-bg)', border: '1px solid rgba(59,130,246,0.2)',
                            }}>
                                <Paperclip style={{ width: '14px', height: '14px', color: '#1e40af', flexShrink: 0 }} />
                                <span style={{ fontSize: '13px', color: '#1e40af', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                <span style={{ fontSize: '11px', color: '#1e40af', opacity: 0.7, flexShrink: 0 }}>{(file.size / 1024).toFixed(0)} Ko</span>
                                <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }} style={{
                                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#1e40af',
                                }}>
                                    <X style={{ width: '14px', height: '14px' }} />
                                </button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileRef.current?.click()} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--white)', border: '1.5px dashed var(--border)',
                                cursor: 'pointer', width: '100%', color: 'var(--text-muted)',
                                fontSize: '13px', fontFamily: 'inherit',
                            }}>
                                <Paperclip style={{ width: '14px', height: '14px' }} />
                                Ajouter un fichier (PDF, image, document)
                            </button>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !titre || !contenu}
                    className="btn btn-primary"
                    style={{
                        width: '100%', padding: '14px', justifyContent: 'center', fontSize: '14px',
                        opacity: (loading || !titre || !contenu) ? 0.5 : 1,
                        cursor: (loading || !titre || !contenu) ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> : <Send style={{ width: '20px', height: '20px' }} />}
                    {loading ? 'Envoi...' : 'Envoyer'}
                </button>
            </form>
        </div>
    );
}
