import { createUntypedClient } from '@/lib/supabase/untyped-client';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
    ReleveFrais, CategorieFrais, PeriodeFrais,
    LigneFrais, LignePrime, CorrectionFrais,
} from '@/types/database';

function getClient() {
    return createUntypedClient();
}

// --- Périodes ---

export async function getPeriodeActive(): Promise<PeriodeFrais | null> {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('periodes_frais')
        .select('*')
        .eq('statut', 'ouverte')
        .order('date_debut', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data as PeriodeFrais | null;
}

export async function getPeriodes() {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('periodes_frais')
        .select('*')
        .order('date_debut', { ascending: false });

    if (error) throw error;
    return (data ?? []) as PeriodeFrais[];
}

// --- Catégories ---

export async function getCategories(vehicule?: 'VL' | 'PL') {
    const supabase = getClient();
    let query = supabase
        .from('categories_frais')
        .select('*')
        .eq('actif', true)
        .order('ordre_affichage');

    if (vehicule) {
        query = query.or(`profil_vehicule.eq.${vehicule},profil_vehicule.eq.tous`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as CategorieFrais[];
}

export async function updateCategorie(id: string, updates: { montant_defaut?: number; actif?: boolean }) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('categories_frais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as CategorieFrais;
}

// --- Relevés ---

export async function getReleves(filters?: {
    userId?: string;
    periodeId?: string;
    statut?: string;
}) {
    const supabase = getClient();
    let query = supabase
        .from('releves_frais')
        .select('*, employe:profiles!employe_id(*), periode:periodes_frais!periode_id(*)')
        .order('created_at', { ascending: false });

    if (filters?.userId) query = query.eq('employe_id', filters.userId);
    if (filters?.periodeId) query = query.eq('periode_id', filters.periodeId);
    if (filters?.statut) query = query.eq('statut', filters.statut);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as ReleveFrais[];
}

export async function getReleveById(id: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('releves_frais')
        .select(`
            *,
            employe:profiles!employe_id(*),
            periode:periodes_frais!periode_id(*),
            lignes_frais(*, categorie:categories_frais!categorie_id(*)),
            lignes_primes(*, categorie:categories_frais!categorie_id(*))
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as ReleveFrais;
}

export async function getOrCreateReleve(periodeId: string) {
    const supabase = getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Check existing
    const { data: existing } = await supabase
        .from('releves_frais')
        .select('*')
        .eq('employe_id', user.id)
        .eq('periode_id', periodeId)
        .single();

    if (existing) return existing as ReleveFrais;

    // Create new
    const { data, error } = await supabase
        .from('releves_frais')
        .insert({
            employe_id: user.id,
            periode_id: periodeId,
            statut: 'brouillon',
            total_frais: 0,
            total_primes: 0,
            total_general: 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as ReleveFrais;
}

// --- Lignes frais ---

export async function upsertLigneFrais(input: {
    releve_id: string;
    date_jour: string;
    categorie_id: string;
    montant: number;
    coche: boolean;
}) {
    const supabase = getClient();
    // Check if line exists
    const { data: existing } = await supabase
        .from('lignes_frais')
        .select('id')
        .eq('releve_id', input.releve_id)
        .eq('date_jour', input.date_jour)
        .eq('categorie_id', input.categorie_id)
        .single();

    if (existing) {
        if (!input.coche) {
            await supabase.from('lignes_frais').delete().eq('id', existing.id);
            return null;
        }
        const { data, error } = await supabase
            .from('lignes_frais')
            .update({ montant: input.montant, coche: input.coche })
            .eq('id', existing.id)
            .select().single();
        if (error) throw error;
        return data as LigneFrais;
    }

    if (!input.coche) return null;

    const { data, error } = await supabase
        .from('lignes_frais')
        .insert({ ...input, corrige_par_admin: false })
        .select().single();
    if (error) throw error;
    return data as LigneFrais;
}

export async function upsertLignePrime(input: {
    releve_id: string;
    date_jour: string;
    categorie_id: string;
    montant: number;
    quantite: number;
}) {
    const supabase = getClient();
    const { data: existing } = await supabase
        .from('lignes_primes')
        .select('id')
        .eq('releve_id', input.releve_id)
        .eq('date_jour', input.date_jour)
        .eq('categorie_id', input.categorie_id)
        .single();

    if (existing) {
        if (input.quantite <= 0) {
            await supabase.from('lignes_primes').delete().eq('id', existing.id);
            return null;
        }
        const { data, error } = await supabase
            .from('lignes_primes')
            .update({ montant: input.montant, quantite: input.quantite })
            .eq('id', existing.id)
            .select().single();
        if (error) throw error;
        return data as LignePrime;
    }

    if (input.quantite <= 0) return null;

    const { data, error } = await supabase
        .from('lignes_primes')
        .insert({ ...input, corrige_par_admin: false })
        .select().single();
    if (error) throw error;
    return data as LignePrime;
}

// --- Actions relevé ---

export async function submitReleve(id: string) {
    // Use admin client for status transitions — RLS blocks conducteur UPDATE to 'soumis'
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('releves_frais')
        .update({ statut: 'soumis' })
        .eq('id', id)
        .select().single();
    if (error) throw error;
    return data as ReleveFrais;
}

export async function saveDraftReleve(releveId: string) {
    // Just recalculate totals — status stays 'brouillon'
    return recalcTotals(releveId);
}

export async function getReleveLignes(releveId: string) {
    const supabase = getClient();
    const { data: frais, error: errF } = await supabase
        .from('lignes_frais')
        .select('*')
        .eq('releve_id', releveId);
    if (errF) throw errF;

    const { data: primes, error: errP } = await supabase
        .from('lignes_primes')
        .select('*')
        .eq('releve_id', releveId);
    if (errP) throw errP;

    return {
        frais: (frais ?? []) as LigneFrais[],
        primes: (primes ?? []) as LignePrime[],
    };
}

export async function validateReleve(id: string) {
    // Get user from browser client, write with admin client
    const browserClient = getClient();
    const { data: { user } } = await browserClient.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('releves_frais')
        .update({
            statut: 'valide',
            validee_par: user.id,
            date_validation: new Date().toISOString(),
        })
        .eq('id', id)
        .select().single();
    if (error) throw error;
    return data as ReleveFrais;
}

export async function correctReleve(
    releveId: string,
    corrections: { champ_modifie: string; ancienne_valeur: string; nouvelle_valeur: string; notes?: string }[]
) {
    // Get user from browser client, write with admin client
    const browserClient = getClient();
    const { data: { user } } = await browserClient.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const supabase = createAdminClient();

    // Insert corrections
    for (const c of corrections) {
        await supabase.from('corrections_frais').insert({
            releve_id: releveId,
            admin_id: user.id,
            champ_modifie: c.champ_modifie,
            ancienne_valeur: c.ancienne_valeur,
            nouvelle_valeur: c.nouvelle_valeur,
            notes: c.notes ?? null,
            date_correction: new Date().toISOString(),
        });
    }

    // Update statut
    const { data, error } = await supabase
        .from('releves_frais')
        .update({ statut: 'corrige' })
        .eq('id', releveId)
        .select().single();
    if (error) throw error;
    return data as ReleveFrais;
}

export async function getCorrections(releveId: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('corrections_frais')
        .select('*, admin:profiles!admin_id(*)')
        .eq('releve_id', releveId)
        .order('date_correction', { ascending: false });

    if (error) throw error;
    return (data ?? []) as CorrectionFrais[];
}

// --- Recalcul totaux ---

export async function recalcTotals(releveId: string) {
    const supabase = getClient();
    const { data: frais } = await supabase
        .from('lignes_frais')
        .select('montant')
        .eq('releve_id', releveId)
        .eq('coche', true);

    const { data: primes } = await supabase
        .from('lignes_primes')
        .select('montant, quantite')
        .eq('releve_id', releveId);

    const totalFrais = (frais ?? []).reduce((s: number, l: { montant: number }) => s + Number(l.montant), 0);
    const totalPrimes = (primes ?? []).reduce((s: number, l: { montant: number; quantite: number }) => s + Number(l.montant) * l.quantite, 0);

    await supabase
        .from('releves_frais')
        .update({
            total_frais: totalFrais,
            total_primes: totalPrimes,
            total_general: totalFrais + totalPrimes,
        })
        .eq('id', releveId);

    return { totalFrais, totalPrimes, totalGeneral: totalFrais + totalPrimes };
}
