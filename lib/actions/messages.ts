import { createUntypedClient } from '@/lib/supabase/untyped-client';
import type { Message, MessageType, Destinataires } from '@/types/database';

function getClient() {
    return createUntypedClient();
}

export async function getMessages(filters?: { type?: MessageType }) {
    const supabase = getClient();
    let query = supabase
        .from('messages')
        .select('*, auteur:profiles!auteur_id(*)')
        .order('created_at', { ascending: false });

    if (filters?.type) {
        query = query.eq('type', filters.type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Message[];
}

export async function getMessageById(id: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('messages')
        .select('*, auteur:profiles!auteur_id(*)')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Message;
}

export async function createMessage(input: {
    titre: string;
    contenu: string;
    type: MessageType;
    destinataires: Destinataires;
    piece_jointe_url?: string | null;
}) {
    const supabase = getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
        .from('messages')
        .insert({
            auteur_id: user.id,
            titre: input.titre,
            contenu: input.contenu,
            type: input.type,
            destinataires: input.destinataires,
            lu_par: [],
            piece_jointe_url: input.piece_jointe_url || null,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Message;
}

export async function markAsRead(messageId: string) {
    const supabase = getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Fetch current lu_par
    const { data: msg } = await supabase
        .from('messages')
        .select('lu_par')
        .eq('id', messageId)
        .single();

    if (!msg) return;

    const luPar: string[] = msg.lu_par || [];
    if (luPar.includes(user.id)) return;

    await supabase
        .from('messages')
        .update({ lu_par: [...luPar, user.id] })
        .eq('id', messageId);
}

export async function getUnreadMessageCount(userId: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('messages')
        .select('id, lu_par');

    if (error) throw error;

    return (data ?? []).filter(
        (m: { lu_par: string[] | null }) => !(m.lu_par || []).includes(userId)
    ).length;
}

export async function replyToMessage(parentId: string, contenu: string) {
    const supabase = getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Get parent message to build reply title
    const { data: parent } = await supabase
        .from('messages')
        .select('titre')
        .eq('id', parentId)
        .single();

    const replyTitle = parent?.titre
        ? (parent.titre.startsWith('Re:') ? parent.titre : `Re: ${parent.titre}`)
        : 'Re: message';

    const { data, error } = await supabase
        .from('messages')
        .insert({
            auteur_id: user.id,
            titre: replyTitle,
            contenu,
            type: 'info',
            destinataires: 'tous',
            lu_par: [],
        })
        .select()
        .single();

    if (error) throw error;
    return data as Message;
}
