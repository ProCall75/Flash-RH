import { createUntypedClient } from '@/lib/supabase/untyped-client';
import type { Contestation } from '@/types/database';

function getClient() {
    return createUntypedClient();
}

export async function getContestations(releveId: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('contestations')
        .select('*')
        .eq('releve_id', releveId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Contestation[];
}

export async function getAllContestations() {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('contestations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Contestation[];
}

export async function createContestation(releveId: string, message: string) {
    const supabase = getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
        .from('contestations')
        .insert({
            releve_id: releveId,
            employe_id: user.id,
            message,
            statut: 'ouverte',
        })
        .select()
        .single();

    if (error) throw error;
    return data as Contestation;
}

export async function resolveContestation(id: string) {
    const supabase = getClient();
    const { error } = await supabase
        .from('contestations')
        .update({ statut: 'resolue', resolue_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
}
