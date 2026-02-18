import { createUntypedClient } from '@/lib/supabase/untyped-client';
import type { Profile } from '@/types/database';

function getClient() {
    return createUntypedClient();
}

export async function getProfiles() {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('nom');

    if (error) throw error;
    return (data ?? []) as Profile[];
}

export async function getProfileById(id: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Profile;
}

export async function updateProfile(
    id: string,
    updates: Partial<Pick<Profile, 'nom' | 'prenom' | 'role' | 'profil_vehicule' | 'actif'>>
) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Profile;
}

export async function getActiveDriverCount() {
    const supabase = getClient();
    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'conducteur')
        .eq('actif', true);

    if (error) throw error;
    return count || 0;
}
