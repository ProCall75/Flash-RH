/**
 * Flash RH — Cleanup Script
 * 
 * 1. Remove duplicate expense categories (keeping first of each group)
 * 2. Fix "Inconnu" profiles
 * 
 * Usage: node scripts/cleanup-data.mjs
 * Requires: .env.local with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env vars from .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim();
    }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function cleanupCategories() {
    console.log('\n🧹 Phase 3: Cleaning duplicate categories...\n');

    const { data: cats, error } = await supabase
        .from('categories_frais')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('❌ Error fetching categories:', error.message);
        return;
    }

    console.log(`   Found ${cats.length} total categories`);

    // Group by (nom, montant_defaut, type, vehicule)
    const groups = {};
    for (const cat of cats) {
        const key = `${cat.nom}|${cat.montant_defaut}|${cat.type}|${cat.vehicule || 'null'}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(cat);
    }

    const duplicateIds = [];
    for (const [key, group] of Object.entries(groups)) {
        if (group.length > 1) {
            // Keep first, delete rest
            const [keep, ...remove] = group;
            console.log(`   🔁 "${keep.nom}" (${keep.type}, ${keep.vehicule || 'all'}) — keeping 1, removing ${remove.length} duplicates`);
            duplicateIds.push(...remove.map(c => c.id));
        }
    }

    if (duplicateIds.length === 0) {
        console.log('   ✅ No duplicates found!');
        return;
    }

    console.log(`\n   Deleting ${duplicateIds.length} duplicate categories...`);

    // Delete in batches of 10
    for (let i = 0; i < duplicateIds.length; i += 10) {
        const batch = duplicateIds.slice(i, i + 10);
        const { error: delError } = await supabase
            .from('categories_frais')
            .delete()
            .in('id', batch);

        if (delError) {
            console.error(`   ❌ Error deleting batch:`, delError.message);
        }
    }

    // Verify
    const { data: remaining } = await supabase
        .from('categories_frais')
        .select('id');

    console.log(`   ✅ Done! ${remaining?.length || 0} categories remaining (was ${cats.length})`);
}

async function fixProfiles() {
    console.log('\n🧑 Phase 4: Fixing "Inconnu" profiles...\n');

    const { data: unknowns, error } = await supabase
        .from('profiles')
        .select('id, nom, prenom, email, role')
        .or('nom.eq.Inconnu,prenom.eq.Inconnu');

    if (error) {
        console.error('❌ Error fetching profiles:', error.message);
        return;
    }

    if (!unknowns || unknowns.length === 0) {
        console.log('   ✅ No "Inconnu" profiles found!');
        return;
    }

    console.log(`   Found ${unknowns.length} profiles with "Inconnu":`);

    for (const profile of unknowns) {
        console.log(`   - ${profile.email} (${profile.role})`);

        // Generate name from email
        let nom = 'Bureau';
        let prenom = 'Flash';

        if (profile.email?.includes('conducteur')) {
            nom = 'Conducteur';
            prenom = 'Flash';
        } else if (profile.email?.includes('bureau')) {
            nom = 'Bureau';
            prenom = 'Flash';
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ nom, prenom })
            .eq('id', profile.id);

        if (updateError) {
            console.error(`     ❌ Error updating:`, updateError.message);
        } else {
            console.log(`     ✅ Updated to "${prenom} ${nom}"`);
        }
    }
}

async function main() {
    console.log('━'.repeat(50));
    console.log('  Flash RH — Data Cleanup Script');
    console.log('━'.repeat(50));

    await cleanupCategories();
    await fixProfiles();

    console.log('\n' + '━'.repeat(50));
    console.log('  ✅ Cleanup complete!');
    console.log('━'.repeat(50) + '\n');
}

main().catch(console.error);
