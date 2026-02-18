import { createUntypedClient } from '@/lib/supabase/untyped-client';
import type { Absence, AbsenceType } from '@/types/database';

function getClient() {
    return createUntypedClient();
}

export async function getAbsences(filters?: {
    userId?: string;
    statut?: string;
}) {
    const supabase = getClient();
    let query = supabase
        .from('absences')
        .select('*, employe:profiles!employe_id(*)')
        .order('created_at', { ascending: false });

    if (filters?.userId) {
        query = query.eq('employe_id', filters.userId);
    }
    if (filters?.statut) {
        query = query.eq('statut', filters.statut);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Absence[];
}

export async function getAbsenceById(id: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('absences')
        .select('*, employe:profiles!employe_id(*), validateur:profiles!validee_par(*)')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Absence;
}

export async function createAbsence(input: {
    type: AbsenceType;
    date_dernier_jour_travaille: string;
    date_reprise: string;
    choix_dates_2?: { dernier_jour: string; reprise: string } | null;
    choix_dates_3?: { dernier_jour: string; reprise: string } | null;
    commentaire?: string;
    derniere_minute: boolean;
}) {
    const supabase = getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
        .from('absences')
        .insert({
            employe_id: user.id,
            type: input.type,
            date_dernier_jour_travaille: input.date_dernier_jour_travaille,
            date_reprise: input.date_reprise,
            choix_dates_2: input.choix_dates_2 ?? null,
            choix_dates_3: input.choix_dates_3 ?? null,
            commentaire: input.commentaire ?? null,
            derniere_minute: input.derniere_minute,
            statut: 'en_attente',
        })
        .select()
        .single();

    if (error) throw error;
    return data as Absence;
}

export async function updateAbsenceStatut(
    id: string,
    statut: 'validee' | 'refusee',
    motif_refus?: string
) {
    const supabase = getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
        .from('absences')
        .update({
            statut,
            motif_refus: motif_refus || null,
            validee_par: user.id,
            date_validation: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Absence;
}

export async function getAbsenceStats() {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('absences')
        .select('statut');

    if (error) throw error;
    const all = data ?? [];

    return {
        en_attente: all.filter((a: { statut: string }) => a.statut === 'en_attente').length,
        validee: all.filter((a: { statut: string }) => a.statut === 'validee').length,
        refusee: all.filter((a: { statut: string }) => a.statut === 'refusee').length,
        total: all.length,
    };
}
