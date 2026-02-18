import { createUntypedClient } from '@/lib/supabase/untyped-client';
import type { PeriodeFrais, ReleveFrais } from '@/types/database';

function getClient() {
    return createUntypedClient();
}

export async function getExportData(periodeId: string) {
    const supabase = getClient();

    // Get the period
    const { data: periode, error: pErr } = await supabase
        .from('periodes_frais')
        .select('*')
        .eq('id', periodeId)
        .single();

    if (pErr) throw pErr;

    // Get all releves for this period
    const { data: releves, error: rErr } = await supabase
        .from('releves_frais')
        .select(`
            *,
            employe:profiles!employe_id(*),
            lignes_frais(*, categorie:categories_frais!categorie_id(*)),
            lignes_primes(*, categorie:categories_frais!categorie_id(*))
        `)
        .eq('periode_id', periodeId)
        .in('statut', ['soumis', 'valide'])
        .order('created_at');

    if (rErr) throw rErr;

    const allReleves = (releves ?? []) as ReleveFrais[];
    const totalGeneral = allReleves.reduce(
        (sum, r) => sum + Number(r.total_general), 0
    );

    return {
        periode: periode as PeriodeFrais,
        releves: allReleves,
        totalGeneral,
        nbReleves: allReleves.length,
    };
}

export async function getExportPeriodes() {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('periodes_frais')
        .select('*')
        .order('date_debut', { ascending: false });

    if (error) throw error;

    const periodes = (data ?? []) as PeriodeFrais[];

    // For each period, get count and total
    const enriched = await Promise.all(
        periodes.map(async (p) => {
            const { count } = await supabase
                .from('releves_frais')
                .select('*', { count: 'exact', head: true })
                .eq('periode_id', p.id)
                .in('statut', ['soumis', 'valide']);

            const { data: totals } = await supabase
                .from('releves_frais')
                .select('total_general')
                .eq('periode_id', p.id)
                .in('statut', ['soumis', 'valide']);

            const total = (totals ?? []).reduce(
                (s: number, r: { total_general: number }) => s + Number(r.total_general), 0
            );

            return { ...p, nb_releves: count || 0, total };
        })
    );

    return enriched;
}
